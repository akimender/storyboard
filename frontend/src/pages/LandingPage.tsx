import { useNavigate } from 'react-router-dom';
import { useStoryboardStore } from '../store/storyboardStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCurrentProject, reset } = useStoryboardStore();

  const handleCreateStoryboard = () => {
    // Reset store to start fresh
    reset();
    
    // Create a new project in memory
    const newProject = {
      id: `project-${Date.now()}`,
      title: 'Untitled Storyboard',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setCurrentProject(newProject);
    
    // Navigate to editor
    navigate(`/editor/${newProject.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Storyboard Studio
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create beautiful storyboards with AI-generated images
        </p>
        
        <button
          onClick={handleCreateStoryboard}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
        >
          Create New Storyboard
        </button>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">AI Image Generation</h3>
            <p className="text-gray-600">
              Generate stunning images from text descriptions using AI
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📐</div>
            <h3 className="text-xl font-semibold mb-2">Visual Canvas</h3>
            <p className="text-gray-600">
              Arrange and connect scenes on an interactive canvas
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📤</div>
            <h3 className="text-xl font-semibold mb-2">Export & Share</h3>
            <p className="text-gray-600">
              Export your storyboard as PNG or PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

