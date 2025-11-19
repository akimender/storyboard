import { create } from 'zustand';

export type Scene = {
  id: string;
  project_id: string;
  prompt_text: string;
  caption?: string;
  image_url?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  created_at: string;
};

export type Connection = {
  id: string;
  project_id: string;
  from_scene_id: string;
  to_scene_id: string;
  label?: string;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

interface StoryboardState {
  // Current project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  
  // Scenes
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  deleteScene: (id: string) => void;
  
  // Connections
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  
  // Canvas state
  selectedSceneId: string | null;
  setSelectedSceneId: (id: string | null) => void;
  isConnecting: boolean;
  setIsConnecting: (isConnecting: boolean) => void;
  connectingFromSceneId: string | null;
  setConnectingFromSceneId: (id: string | null) => void;
  
  // Canvas transform
  scale: number;
  setScale: (scale: number) => void;
  offsetX: number;
  setOffsetX: (x: number) => void;
  offsetY: number;
  setOffsetY: (y: number) => void;
  
  // Undo stack
  undoStack: any[];
  pushToUndo: (state: any) => void;
  popFromUndo: () => any | null;
  
  // Reset
  reset: () => void;
}

const initialState = {
  currentProject: null,
  scenes: [],
  connections: [],
  selectedSceneId: null,
  isConnecting: false,
  connectingFromSceneId: null,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  undoStack: [],
};

export const useStoryboardStore = create<StoryboardState>((set, get) => ({
  ...initialState,
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setScenes: (scenes) => set({ scenes }),
  addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
  updateScene: (id, updates) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id ? { ...scene, ...updates } : scene
      ),
    })),
  deleteScene: (id) =>
    set((state) => ({
      scenes: state.scenes.filter((scene) => scene.id !== id),
      connections: state.connections.filter(
        (conn) => conn.from_scene_id !== id && conn.to_scene_id !== id
      ),
    })),
  
  setConnections: (connections) => set({ connections }),
  addConnection: (connection) =>
    set((state) => ({ connections: [...state.connections, connection] })),
  updateConnection: (id, updates) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id ? { ...conn, ...updates } : conn
      ),
    })),
  deleteConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id),
    })),
  
  setSelectedSceneId: (id) => set({ selectedSceneId: id }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setConnectingFromSceneId: (id) => set({ connectingFromSceneId: id }),
  
  setScale: (scale) => set({ scale }),
  setOffsetX: (x) => set({ offsetX: x }),
  setOffsetY: (y) => set({ offsetY: y }),
  
  pushToUndo: (state) =>
    set((current) => ({ undoStack: [...current.undoStack, state] })),
  popFromUndo: () => {
    const stack = get().undoStack;
    if (stack.length === 0) return null;
    const lastState = stack[stack.length - 1];
    set({ undoStack: stack.slice(0, -1) });
    return lastState;
  },
  
  reset: () => set(initialState),
}));

