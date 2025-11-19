import { useEffect, useRef } from 'react';
import { useStoryboardStore } from '../store/storyboardStore';
import { scenesApi } from '../api/client';

export function useAutoSave(projectId: string | undefined, delay: number = 1000) {
  const { scenes } = useStoryboardStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!projectId || scenes.length === 0) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      // Save all scenes that have been modified
      for (const scene of scenes) {
        try {
          await scenesApi.update(scene.id, {
            x: scene.x,
            y: scene.y,
            width: scene.width,
            height: scene.height,
            caption: scene.caption,
          });
        } catch (error) {
          console.error(`Failed to auto-save scene ${scene.id}:`, error);
        }
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scenes, projectId, delay]);
}

