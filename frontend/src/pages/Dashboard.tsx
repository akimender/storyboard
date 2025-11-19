import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/client';
import type { Project } from '../store/storyboardStore';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      // In mock mode, start with empty array
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    try {
      setIsCreating(true);
      const response = await projectsApi.create({
        title: newProjectTitle,
      });
      setProjects([...projects, response.data]);
      setNewProjectTitle('');
    } catch (error: any) {
      console.error('Failed to create project:', error);
      alert(error.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsApi.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setEditTitle(project.title);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await projectsApi.update(id, { title: editTitle });
      setProjects(projects.map((p) => (p.id === id ? response.data : p)));
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Storyboard Studio</h1>
          <p className="text-gray-600">Create and manage your storyboard projects</p>
        </div>

        {/* Create New Project */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="Enter project title..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateProject}
              disabled={isCreating || !newProjectTitle.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No projects yet. Create your first project above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                {editingId === project.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(project.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenProject(project.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleStartEdit(project)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
