import { useState } from 'react';
import { useStoryboardStore } from '../store/storyboardStore';
import { generateImageApi } from '../api/client';

interface SceneCreatorProps {
  projectId: string;
}

export default function SceneCreator({ projectId }: SceneCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addScene, scenes, currentProject } = useStoryboardStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a scene description');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Generate image (still uses backend API)
      const imageResponse = await generateImageApi.generate(prompt, projectId);
      const imageUrl = imageResponse.data.image_url;
      
      console.log('✅ Image generated, URL:', imageUrl);
      console.log('Testing image URL accessibility...');
      
      // Test if image URL is accessible (without CORS first)
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image URL is accessible and loads successfully');
        console.log('Image dimensions:', img.width, 'x', img.height);
      };
      img.onerror = (error) => {
        console.error('❌ Image URL failed to load:', error);
        console.error('This is likely a CORS issue. Check S3 bucket CORS configuration.');
        console.error('Image URL:', imageUrl);
        console.error('Try opening this URL directly in a new tab to verify it works');
        alert('Image generated but failed to load. Check browser console for details. This is likely a CORS configuration issue with your S3 bucket.');
      };
      // Try without crossOrigin first
      img.src = imageUrl;
      
      // Create scene in memory (no backend save)
      const newScene = {
        id: `scene-${Date.now()}`,
        project_id: projectId,
        prompt_text: prompt,
        caption: prompt,
        image_url: imageUrl,
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
        width: 300,
        height: 200,
        created_at: new Date().toISOString(),
      };
      
      console.log('Creating scene with image_url:', newScene.image_url);
      addScene(newScene);
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

