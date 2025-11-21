import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Image, Text, Rect, Arrow } from 'react-konva';
import Konva from 'konva';
import { useStoryboardStore } from '../store/storyboardStore';
import type { Scene, Connection } from '../store/storyboardStore';
import useImage from 'use-image';
import { connectionsApi } from '../api/client';

interface SceneNodeProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onConnectionStart: () => void;
}

function SceneNode({ scene, isSelected, onSelect, onDragEnd, onConnectionStart }: SceneNodeProps) {
  // Try without crossOrigin first - S3 should handle CORS via bucket policy
  const [image, imageStatus] = useImage(scene.image_url || '');
  const [isHovered, setIsHovered] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Debug image loading with timeout detection
  useEffect(() => {
    if (scene.image_url) {
      console.log('Scene image URL:', scene.image_url);
      console.log('Image status:', imageStatus);
      
      // Set a timeout to detect if image is stuck loading
      const timeout = setTimeout(() => {
        if (imageStatus === 'loading') {
          console.warn('Image loading timeout - may be CORS issue');
          console.warn('Image URL:', scene.image_url);
          setLoadError(true);
        }
      }, 10000); // 10 second timeout
      
      if (imageStatus === 'failed') {
        console.error('Failed to load image:', scene.image_url);
        console.error('This might be a CORS issue. Check S3 bucket CORS configuration.');
        setLoadError(true);
        clearTimeout(timeout);
      } else if (imageStatus === 'loaded') {
        console.log('Image loaded successfully:', scene.image_url);
        setLoadError(false);
        clearTimeout(timeout);
      } else if (imageStatus === 'loading') {
        console.log('Loading image...', scene.image_url);
        setLoadError(false);
      }
      
      return () => clearTimeout(timeout);
    } else {
      console.warn('Scene has no image_url:', scene);
    }
  }, [imageStatus, scene.image_url]);

  return (
    <Group
      x={scene.x}
      y={scene.y}
      draggable
      onDragEnd={onDragEnd}
      onClick={onSelect}
      onTap={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scene card background */}
      <Rect
        width={scene.width}
        height={scene.height}
        fill="#ffffff"
        stroke={isSelected ? "#3b82f6" : isHovered ? "#60a5fa" : "#e5e7eb"}
        strokeWidth={isSelected ? 3 : 1}
        shadowBlur={isHovered ? 10 : 5}
        shadowColor="rgba(0,0,0,0.2)"
        cornerRadius={8}
      />
      
      {/* Scene image */}
      {image ? (
        <Image
          image={image}
          width={scene.width}
          height={scene.height * 0.7}
          cornerRadius={[8, 8, 0, 0]}
        />
      ) : (scene.image_url && (imageStatus === 'failed' || loadError)) ? (
        // Show error placeholder if image failed to load
        <Group>
          <Rect
            width={scene.width}
            height={scene.height * 0.7}
            fill="#fee2e2"
            cornerRadius={[8, 8, 0, 0]}
          />
          <Text
            x={scene.width / 2}
            y={scene.height * 0.35}
            text="Image failed to load"
            fontSize={12}
            fill="#dc2626"
            align="center"
            verticalAlign="middle"
            offsetX={scene.width / 2}
            offsetY={6}
          />
          <Text
            x={scene.width / 2}
            y={scene.height * 0.35 + 20}
            text="Check CORS settings"
            fontSize={10}
            fill="#991b1b"
            align="center"
            verticalAlign="middle"
            offsetX={scene.width / 2}
            offsetY={5}
          />
        </Group>
      ) : scene.image_url ? (
        // Show loading indicator
        <Group>
          <Rect
            width={scene.width}
            height={scene.height * 0.7}
            fill="#f3f4f6"
            cornerRadius={[8, 8, 0, 0]}
          />
          <Text
            x={scene.width / 2}
            y={scene.height * 0.35}
            text="Loading image..."
            fontSize={12}
            fill="#6b7280"
            align="center"
            verticalAlign="middle"
            offsetX={scene.width / 2}
            offsetY={6}
          />
        </Group>
      ) : (
        // No image URL
        <Rect
          width={scene.width}
          height={scene.height * 0.7}
          fill="#e5e7eb"
          cornerRadius={[8, 8, 0, 0]}
        />
      )}
      
      {/* Caption area */}
      <Rect
        y={scene.height * 0.7}
        width={scene.width}
        height={scene.height * 0.3}
        fill="#f9fafb"
        cornerRadius={[0, 0, 8, 8]}
      />
      
      <Text
        x={8}
        y={scene.height * 0.7 + 8}
        width={scene.width - 16}
        height={scene.height * 0.3 - 16}
        text={scene.caption || scene.prompt_text}
        fontSize={12}
        fontFamily="Arial"
        fill="#374151"
        align="left"
        verticalAlign="top"
        wrap="word"
      />
      
      {/* Connection button */}
      <Rect
        x={scene.width - 32}
        y={8}
        width={24}
        height={24}
        fill={isHovered ? "#3b82f6" : "#9ca3af"}
        cornerRadius={4}
        onClick={(e) => {
          e.cancelBubble = true;
          onConnectionStart();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onConnectionStart();
        }}
      />
    </Group>
  );
}

interface ConnectionArrowProps {
  fromScene: Scene;
  toScene: Scene;
}

function ConnectionArrow({ fromScene, toScene }: ConnectionArrowProps) {
  const fromX = fromScene.x + fromScene.width / 2;
  const fromY = fromScene.y + fromScene.height / 2;
  const toX = toScene.x + toScene.width / 2;
  const toY = toScene.y + toScene.height / 2;

  return (
    <Arrow
      points={[fromX, fromY, toX, toY]}
      stroke="#3b82f6"
      strokeWidth={2}
      fill="#3b82f6"
      pointerLength={10}
      pointerWidth={10}
    />
  );
}

export default function StoryboardCanvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const {
    scenes,
    connections,
    selectedSceneId,
    setSelectedSceneId,
    isConnecting,
    setIsConnecting,
    connectingFromSceneId,
    setConnectingFromSceneId,
    updateScene,
    addConnection,
  } = useStoryboardStore();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleSceneDragEnd = (sceneId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    updateScene(sceneId, {
      x: node.x(),
      y: node.y(),
    });
  };

  const handleSceneSelect = (sceneId: string) => () => {
    setSelectedSceneId(sceneId);
  };

  const handleConnectionStart = (sceneId: string) => async () => {
    if (isConnecting && connectingFromSceneId === sceneId) {
      // Cancel connection
      setIsConnecting(false);
      setConnectingFromSceneId(null);
    } else if (isConnecting && connectingFromSceneId && connectingFromSceneId !== sceneId) {
      // Complete connection (in memory only)
      const fromScene = scenes.find((s) => s.id === connectingFromSceneId);
      if (!fromScene) return;
      
      const newConnection = {
        id: `conn-${Date.now()}`,
        project_id: fromScene.project_id,
        from_scene_id: connectingFromSceneId,
        to_scene_id: sceneId,
        label: undefined,
        created_at: new Date().toISOString(),
      };
      
      addConnection(newConnection);
      setIsConnecting(false);
      setConnectingFromSceneId(null);
    } else {
      // Start connection
      setIsConnecting(true);
      setConnectingFromSceneId(sceneId);
    }
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedSceneId(null);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-100 relative overflow-hidden">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Grid background */}
          {Array.from({ length: Math.ceil(dimensions.width / 50) }).map((_, i) => (
            <Rect
              key={`v-${i}`}
              x={i * 50}
              y={0}
              width={1}
              height={dimensions.height}
              fill="#e5e7eb"
            />
          ))}
          {Array.from({ length: Math.ceil(dimensions.height / 50) }).map((_, i) => (
            <Rect
              key={`h-${i}`}
              x={0}
              y={i * 50}
              width={dimensions.width}
              height={1}
              fill="#e5e7eb"
            />
          ))}
          
          {/* Render connections first (behind scenes) */}
          {connections.map((connection) => {
            const fromScene = scenes.find((s) => s.id === connection.from_scene_id);
            const toScene = scenes.find((s) => s.id === connection.to_scene_id);
            if (!fromScene || !toScene) return null;
            return (
              <ConnectionArrow
                key={connection.id}
                fromScene={fromScene}
                toScene={toScene}
              />
            );
          })}
          
          {/* Render scenes */}
          {scenes.map((scene) => (
            <SceneNode
              key={scene.id}
              scene={scene}
              isSelected={selectedSceneId === scene.id}
              onSelect={handleSceneSelect(scene.id)}
              onDragEnd={handleSceneDragEnd(scene.id)}
              onConnectionStart={handleConnectionStart(scene.id)}
            />
          ))}
        </Layer>
      </Stage>
      
      {isConnecting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Click on a scene to connect
        </div>
      )}
    </div>
  );
}

