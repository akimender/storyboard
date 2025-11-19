import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/client';
import { useStoryboardStore } from '../store/storyboardStore';
import StoryboardCanvas from '../components/StoryboardCanvas';
import SceneInspector from '../components/SceneInspector';
import SceneCreator from '../components/SceneCreator';
import ExportTools from '../components/ExportTools';
import { useAutoSave } from '../hooks/useAutoSave';

export default function StoryboardEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    currentProject,
    setCurrentProject,
    setScenes,
    setConnections,
  } = useStoryboardStore();

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
    return () => {
      // Cleanup on unmount
      setCurrentProject(null);
      setScenes([]);
      setConnections([]);
    };
  }, [projectId]);

  // Auto-save scenes
  useAutoSave(projectId);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getById(projectId!);
      const projectData = response.data;
      
      setCurrentProject({
        id: projectData.id,
        title: projectData.title,
        created_at: projectData.created_at,
        updated_at: projectData.updated_at,
      });
      
      setScenes(projectData.scenes || []);
      setConnections(projectData.connections || []);
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">{currentProject?.title || 'Storyboard'}</h1>
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

