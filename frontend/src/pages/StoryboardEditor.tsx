import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryboardStore } from '../store/storyboardStore';
import StoryboardCanvas from '../components/StoryboardCanvas';
import SceneInspector from '../components/SceneInspector';
import SceneCreator from '../components/SceneCreator';
import ExportTools from '../components/ExportTools';

export default function StoryboardEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useStoryboardStore();

  useEffect(() => {
    // If no current project, redirect to landing page
    if (!currentProject || currentProject.id !== projectId) {
      navigate('/');
    }
  }, [currentProject, projectId, navigate]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
          <input
            type="text"
            value={currentProject?.title || 'Untitled Storyboard'}
            onChange={(e) => {
              if (currentProject) {
                setCurrentProject({ ...currentProject, title: e.target.value });
              }
            }}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            placeholder="Untitled Storyboard"
          />
        </div>
        <ExportTools />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Scene Creator */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <SceneCreator projectId={projectId!} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <StoryboardCanvas />
        </div>

        {/* Right Sidebar - Scene Inspector */}
        <div className="w-80 bg-white border-l border-gray-200">
          <SceneInspector />
        </div>
      </div>
    </div>
  );
}

