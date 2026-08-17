import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionEngine, MotionState, MotionPath } from './motion-engine';

/**
 * Hook to apply motion engine animations to Three.js objects
 */
export function useMotionAnimation(
  motionPathId: string,
  rotationPathId?: string,
  options: { loop?: boolean; yoyo?: boolean } = {}
) {
  const meshRef = useRef<THREE.Object3D>(null);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const currentTime = (performance.now() - startTime.current) / 1000;
    const motionState = motionEngine.evaluate3DMotion(motionPathId, currentTime, rotationPathId);

    // Apply position
    meshRef.current.position.set(motionState.position.x, motionState.position.y, motionState.position.z);

    // Apply rotation (use quaternion if available)
    if (motionState.quaternion) {
      meshRef.current.quaternion.set(
        motionState.quaternion.x,
        motionState.quaternion.y,
        motionState.quaternion.z,
        motionState.quaternion.w
      );
    } else {
      meshRef.current.rotation.set(
        motionState.rotation.x,
        motionState.rotation.y,
        motionState.rotation.z
      );
    }

    // Apply scale
    meshRef.current.scale.set(motionState.scale.x, motionState.scale.y, motionState.scale.z);
  });

  return meshRef;
}

/**
 * Animated Mesh component with motion engine integration
 */
export const AnimatedMesh: React.FC<{
  motionPathId: string;
  rotationPathId?: string;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({ motionPathId, rotationPathId, children, ...props }) => {
  const meshRef = useMotionAnimation(motionPathId, rotationPathId);

  return React.createElement('mesh', { ref: meshRef, ...props }, children);
};

/**
 * Animated Group component for complex 3D hierarchies
 */
export const AnimatedGroup: React.FC<{
  motionPathId: string;
  rotationPathId?: string;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({ motionPathId, rotationPathId, children, ...props }) => {
  const groupRef = useMotionAnimation(motionPathId, rotationPathId);

  return React.createElement('group', { ref: groupRef, ...props }, children);
};

/**
 * Camera animation component
 */
export const AnimatedCamera: React.FC<{
  motionPathId: string;
  lookAtPathId?: string;
  [key: string]: any;
}> = ({ motionPathId, lookAtPathId, ...props }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  useFrame(() => {
    if (!cameraRef.current) return;

    const currentTime = (performance.now() - startTime.current) / 1000;
    const motionState = motionEngine.evaluate3DMotion(motionPathId, currentTime);

    // Apply camera position
    cameraRef.current.position.set(
      motionState.position.x,
      motionState.position.y,
      motionState.position.z
    );

    // Apply camera rotation
    if (motionState.quaternion) {
      cameraRef.current.quaternion.set(
        motionState.quaternion.x,
        motionState.quaternion.y,
        motionState.quaternion.z,
        motionState.quaternion.w
      );
    } else {
      cameraRef.current.rotation.set(
        motionState.rotation.x,
        motionState.rotation.y,
        motionState.rotation.z
      );
    }

    // Look at target if specified
    if (lookAtPathId) {
      const lookAtState = motionEngine.evaluateMotion(lookAtPathId, currentTime);
      const target = typeof lookAtState.position === 'object' ? lookAtState.position : { x: 0, y: 0, z: 0 };
      cameraRef.current.lookAt(target.x, target.y, target.z);
    }
  });

  return React.createElement('perspectiveCamera', { ref: cameraRef, ...props });
};

/**
 * Material animation component for dynamic material properties
 */
export const AnimatedMaterial: React.FC<{
  motionPathId: string;
  property: 'opacity' | 'roughness' | 'metalness' | 'emissiveIntensity';
  children?: React.ReactNode;
  [key: string]: any;
}> = ({ motionPathId, property, children, ...props }) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;

    const currentTime = (performance.now() - startTime.current) / 1000;
    const motionState = motionEngine.evaluateMotion(motionPathId, currentTime);

    // Apply property based on motion state
    switch (property) {
      case 'opacity':
        materialRef.current.opacity = motionState.opacity;
        break;
      case 'roughness':
        materialRef.current.roughness = motionState.position.x; // Use x component
        break;
      case 'metalness':
        materialRef.current.metalness = motionState.position.y; // Use y component
        break;
      case 'emissiveIntensity':
        materialRef.current.emissiveIntensity = motionState.position.z; // Use z component
        break;
    }
  });

  return React.createElement('meshStandardMaterial', { ref: materialRef, ...props }, children);
};

/**
 * Light animation component
 */
export const AnimatedLight: React.FC<{
  motionPathId: string;
  intensityPathId?: string;
  colorPathId?: string;
  [key: string]: any;
}> = ({ motionPathId, intensityPathId, colorPathId, ...props }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  useFrame(() => {
    if (!lightRef.current) return;

    const currentTime = (performance.now() - startTime.current) / 1000;
    const motionState = motionEngine.evaluate3DMotion(motionPathId, currentTime);

    // Apply light position
    lightRef.current.position.set(
      motionState.position.x,
      motionState.position.y,
      motionState.position.z
    );

    // Apply intensity animation
    if (intensityPathId) {
      const intensityState = motionEngine.evaluateMotion(intensityPathId, currentTime);
      const intensity = typeof intensityState.position === 'number' ? intensityState.position : intensityState.position.x;
      lightRef.current.intensity = intensity;
    }

    // Apply color animation
    if (colorPathId) {
      const colorState = motionEngine.evaluateMotion(colorPathId, currentTime);
      const color = typeof colorState.position === 'object' ? colorState.position : { x: 1, y: 1, z: 1 };
      lightRef.current.color.setRGB(color.x, color.y, color.z);
    }
  });

  return React.createElement('pointLight', { ref: lightRef, ...props });
};

/**
 * Geometry animation component for vertex manipulation
 */
export const AnimatedGeometry: React.FC<{
  motionPathId: string;
  vertices: Float32Array;
  [key: string]: any;
}> = ({ motionPathId, vertices, ...props }) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const originalVertices = useMemo(() => new Float32Array(vertices), [vertices]);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  useFrame(() => {
    if (!geometryRef.current) return;

    const currentTime = (performance.now() - startTime.current) / 1000;
    const motionState = motionEngine.evaluate3DMotion(motionPathId, currentTime);

    // Apply vertex displacement based on motion
    const positions = geometryRef.current.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalVertices[i];
      const originalY = originalVertices[i + 1];
      const originalZ = originalVertices[i + 2];

      // Apply displacement based on motion state
      positions[i] = originalX + motionState.position.x * 0.1;
      positions[i + 1] = originalY + motionState.position.y * 0.1;
      positions[i + 2] = originalZ + motionState.position.z * 0.1;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return React.createElement('bufferGeometry', { ref: geometryRef, ...props });
};

/**
 * Helper to create motion paths for common 3D animations
 */
export function createMotionPaths(id: string) {
  return {
    // Circular path
    circle: (radius: number, duration: number) => {
      const keyframes = [];
      for (let i = 0; i <= 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        keyframes.push({
          time: (i / 360) * duration,
          value: {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: 0,
          },
          curve: { type: 'linear' as const },
        });
      }
      return motionEngine.createMotionPath(`${id}-circle`, keyframes, duration, { loop: true });
    },

    // Spiral path
    spiral: (radius: number, height: number, duration: number) => {
      const keyframes = [];
      for (let i = 0; i <= 360; i += 5) {
        const angle = (i * Math.PI) / 180;
        const progress = i / 360;
        keyframes.push({
          time: progress * duration,
          value: {
            x: Math.cos(angle) * radius * progress,
            y: Math.sin(angle) * radius * progress,
            z: height * progress,
          },
          curve: { type: 'ease-in-out' as const },
        });
      }
      return motionEngine.createMotionPath(`${id}-spiral`, keyframes, duration);
    },

    // Figure-8 path
    figure8: (scale: number, duration: number) => {
      const keyframes = [];
      for (let i = 0; i <= 360; i += 5) {
        const angle = (i * Math.PI) / 180;
        keyframes.push({
          time: (i / 360) * duration,
          value: {
            x: Math.sin(angle) * scale,
            y: Math.sin(angle * 2) * scale * 0.5,
            z: 0,
          },
          curve: { type: 'ease-in-out' as const },
        });
      }
      return motionEngine.createMotionPath(`${id}-figure8`, keyframes, duration, { loop: true });
    },

    // Bounce path
    bounce: (height: number, duration: number) => {
      return motionEngine.createMotionPath(
        `${id}-bounce`,
        [
          { time: 0, value: { x: 0, y: 0, z: 0 }, curve: { type: 'ease-out' as const } },
          { time: 0.5, value: { x: 0, y: height, z: 0 }, curve: { type: 'ease-in' as const } },
          { time: 1, value: { x: 0, y: 0, z: 0 }, curve: { type: 'bounce' as const } },
        ],
        duration,
        { loop: true }
      );
    },
  };
}