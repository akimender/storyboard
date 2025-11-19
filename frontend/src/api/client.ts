import axios from 'axios';
import {
  mockProjectsApi,
  mockScenesApi,
  mockConnectionsApi,
  mockGenerateImageApi,
} from './mockClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !API_URL || API_URL === '';

// Use mock APIs if VITE_USE_MOCK is true or if API_URL is empty
const useMock = USE_MOCK;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('Backend unavailable, consider using mock mode');
    }
    return Promise.reject(error);
  }
);

// Projects API
export const projectsApi = useMock ? mockProjectsApi : {
  getAll: () => apiClient.get(`/api/projects/`),
  getById: (projectId: string) => apiClient.get(`/api/projects/${projectId}/full`),
  create: (data: { title: string }) => apiClient.post('/api/projects/', data),
  update: (projectId: string, data: { title: string }) => apiClient.put(`/api/projects/${projectId}`, data),
  delete: (projectId: string) => apiClient.delete(`/api/projects/${projectId}`),
};

// Scenes API
export const scenesApi = useMock ? mockScenesApi : {
  getAll: (projectId: string) => apiClient.get(`/api/scenes/?project_id=${projectId}`),
  getById: (sceneId: string) => apiClient.get(`/api/scenes/${sceneId}`),
  create: (data: any) => apiClient.post('/api/scenes/', data),
  update: (sceneId: string, data: any) => apiClient.patch(`/api/scenes/${sceneId}`, data),
  delete: (sceneId: string) => apiClient.delete(`/api/scenes/${sceneId}`),
};

// Connections API
export const connectionsApi = useMock ? mockConnectionsApi : {
  getAll: (projectId: string) => apiClient.get(`/api/connections/?project_id=${projectId}`),
  create: (data: any) => apiClient.post('/api/connections/', data),
  update: (connectionId: string, data: any) => apiClient.patch(`/api/connections/${connectionId}`, data),
  delete: (connectionId: string) => apiClient.delete(`/api/connections/${connectionId}`),
};

// Generate Image API
export const generateImageApi = useMock ? mockGenerateImageApi : {
  generate: (prompt: string, projectId: string) => 
    apiClient.post('/api/generate_image/', { prompt, project_id: projectId }),
};
