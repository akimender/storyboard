import { useState, useEffect } from 'react';
import { useStoryboardStore } from '../store/storyboardStore';
import { scenesApi, generateImageApi } from '../api/client';

export default function SceneInspector() {
  const { selectedSceneId, scenes, updateScene, deleteScene } = useStoryboardStore();
  const selectedScene = scenes.find((s) => s.id === selectedSceneId);
  const [caption, setCaption] = useState('');
  const [promptText, setPromptText] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (selectedScene) {
      setCaption(selectedScene.caption || '');
      setPromptText(selectedScene.prompt_text || '');
    }
  }, [selectedScene]);

  const handleUpdateCaption = async (newCaption: string) => {
    if (!selectedScene) return;
    
    try {
      await scenesApi.update(selectedScene.id, { caption: newCaption });
      updateScene(selectedScene.id, { caption: newCaption });
    } catch (error) {
      console.error('Failed to update caption:', error);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedScene) return;
    
    try {
      setIsRegenerating(true);
      const response = await generateImageApi.generate(
        selectedScene.prompt_text,
        selectedScene.project_id
      );
      
      await scenesApi.update(selectedScene.id, { image_url: response.data.image_url });
      updateScene(selectedScene.id, { image_url: response.data.image_url });
    } catch (error) {
      console.error('Failed to regenerate image:', error);
      alert('Failed to regenerate image');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedScene) return;
    if (!confirm('Are you sure you want to delete this scene?')) return;
    
    try {
      await scenesApi.delete(selectedScene.id);
      deleteScene(selectedScene.id);
    } catch (error) {
      console.error('Failed to delete scene:', error);
      alert('Failed to delete scene');
    }
  };

  if (!selectedScene) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select a scene to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Scene Inspector</h2>
      
      <div className="space-y-4">
        {/* Prompt Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Text
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            readOnly
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={(e) => handleUpdateCaption(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter caption..."
          />
        </div>

        {/* Position & Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X</label>
            <input
              type="number"
              value={selectedScene.x.toFixed(0)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Y</label>
            <input
              type="number"
              value={selectedScene.y.toFixed(0)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              value={selectedScene.width.toFixed(0)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input
              type="number"
              value={selectedScene.height.toFixed(0)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate Image'}
          </button>
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Scene
          </button>
        </div>
      </div>
    </div>
  );
}

