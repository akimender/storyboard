// Mock API client for demo mode (uses localStorage)
import type { Project, Scene, Connection } from '../store/storyboardStore';

const STORAGE_KEY_PROJECTS = 'storyboard_projects';
const STORAGE_KEY_SCENES = 'storyboard_scenes';
const STORAGE_KEY_CONNECTIONS = 'storyboard_connections';

function safeLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

function getProjects(): Project[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const stored = storage.getItem(STORAGE_KEY_PROJECTS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects:', e);
  }
}

function getScenes(projectId: string): Scene[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const stored = storage.getItem(`${STORAGE_KEY_SCENES}_${projectId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveScenes(projectId: string, scenes: Scene[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(`${STORAGE_KEY_SCENES}_${projectId}`, JSON.stringify(scenes));
  } catch (e) {
    console.error('Failed to save scenes:', e);
  }
}

function getConnections(projectId: string): Connection[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const stored = storage.getItem(`${STORAGE_KEY_CONNECTIONS}_${projectId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveConnections(projectId: string, connections: Connection[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(`${STORAGE_KEY_CONNECTIONS}_${projectId}`, JSON.stringify(connections));
  } catch (e) {
    console.error('Failed to save connections:', e);
  }
}

export const mockProjectsApi = {
  getAll: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return { data: getProjects().filter(p => p.user_id === userId) };
  },
  getById: async (projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    
    const scenes = getScenes(projectId);
    const connections = getConnections(projectId);
    
    return { data: { ...project, scenes, connections } };
  },
  create: async (data: { user_id: string; title: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const projects = getProjects();
    const newProject: Project = {
      id: `project-${Date.now()}`,
      user_id: data.user_id,
      title: data.title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    projects.push(newProject);
    saveProjects(projects);
    return { data: newProject };
  },
  update: async (projectId: string, data: { title: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    project.title = data.title;
    project.updated_at = new Date().toISOString();
    saveProjects(projects);
    return { data: project };
  },
  delete: async (projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    saveProjects(filtered);
    // Also delete associated scenes and connections
    const storage = safeLocalStorage();
    if (storage) {
      try {
        storage.removeItem(`${STORAGE_KEY_SCENES}_${projectId}`);
        storage.removeItem(`${STORAGE_KEY_CONNECTIONS}_${projectId}`);
      } catch (e) {
        console.error('Failed to remove items:', e);
      }
    }
    return { data: { success: true } };
  },
};

export const mockScenesApi = {
  getAll: async (projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: getScenes(projectId) };
  },
  getById: async (sceneId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Find scene across all projects
    const projects = getProjects();
    for (const project of projects) {
      const scenes = getScenes(project.id);
      const scene = scenes.find(s => s.id === sceneId);
      if (scene) return { data: scene };
    }
    throw new Error('Scene not found');
  },
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const scenes = getScenes(data.project_id);
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      project_id: data.project_id,
      prompt_text: data.prompt_text,
      caption: data.caption || data.prompt_text,
      image_url: data.image_url || 'https://via.placeholder.com/300x200?text=No+Image',
      x: data.x || 0,
      y: data.y || 0,
      width: data.width || 300,
      height: data.height || 200,
      created_at: new Date().toISOString(),
    };
    scenes.push(newScene);
    saveScenes(data.project_id, scenes);
    return { data: newScene };
  },
  update: async (sceneId: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const projects = getProjects();
    for (const project of projects) {
      const scenes = getScenes(project.id);
      const sceneIndex = scenes.findIndex(s => s.id === sceneId);
      if (sceneIndex !== -1) {
        scenes[sceneIndex] = { ...scenes[sceneIndex], ...data };
        saveScenes(project.id, scenes);
        return { data: scenes[sceneIndex] };
      }
    }
    throw new Error('Scene not found');
  },
  delete: async (sceneId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const projects = getProjects();
    for (const project of projects) {
      const scenes = getScenes(project.id);
      const filtered = scenes.filter(s => s.id !== sceneId);
      if (filtered.length !== scenes.length) {
        saveScenes(project.id, filtered);
        return { data: { success: true } };
      }
    }
    throw new Error('Scene not found');
  },
};

export const mockConnectionsApi = {
  getAll: async (projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: getConnections(projectId) };
  },
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const connections = getConnections(data.project_id);
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      project_id: data.project_id,
      from_scene_id: data.from_scene_id,
      to_scene_id: data.to_scene_id,
      label: data.label,
      created_at: new Date().toISOString(),
    };
    connections.push(newConnection);
    saveConnections(data.project_id, connections);
    return { data: newConnection };
  },
  update: async (connectionId: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const projects = getProjects();
    for (const project of projects) {
      const connections = getConnections(project.id);
      const connIndex = connections.findIndex(c => c.id === connectionId);
      if (connIndex !== -1) {
        connections[connIndex] = { ...connections[connIndex], ...data };
        saveConnections(project.id, connections);
        return { data: connections[connIndex] };
      }
    }
    throw new Error('Connection not found');
  },
  delete: async (connectionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const projects = getProjects();
    for (const project of projects) {
      const connections = getConnections(project.id);
      const filtered = connections.filter(c => c.id !== connectionId);
      if (filtered.length !== connections.length) {
        saveConnections(project.id, filtered);
        return { data: { success: true } };
      }
    }
    throw new Error('Connection not found');
  },
};

export const mockGenerateImageApi = {
  generate: async (prompt: string, _projectId: string) => {
    // Simulate image generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Return a placeholder image URL
    return {
      data: {
        image_url: `https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 30))}`,
      },
    };
  },
};

