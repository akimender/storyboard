import { useState } from 'react';
import { useStoryboardStore } from '../store/storyboardStore';
import { scenesApi, generateImageApi } from '../api/client';

interface SceneCreatorProps {
  projectId: string;
}

export default function SceneCreator({ projectId }: SceneCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addScene, scenes } = useStoryboardStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a scene description');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Generate image
      const imageResponse = await generateImageApi.generate(prompt, projectId);
      const imageUrl = imageResponse.data.image_url;
      
      // Create scene
      const sceneResponse = await scenesApi.create({
        project_id: projectId,
        prompt_text: prompt,
        caption: prompt,
        image_url: imageUrl,
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
        width: 300,
        height: 200,
      });
      
      addScene(sceneResponse.data);
      setPrompt('');
    } catch (error: any) {
      console.error('Failed to generate scene:', error);
      alert(error.response?.data?.detail || 'Failed to generate scene');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Create New Scene</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Scene Description
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the scene (e.g., 'A sunset over the ocean with waves crashing')"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            disabled={isGenerating}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating Image...' : 'Generate Scene with AI'}
        </button>
        <p className="text-xs text-gray-500">
          {scenes.length} scene{scenes.length !== 1 ? 's' : ''} in this project
        </p>
      </div>
    </div>
  );
}

