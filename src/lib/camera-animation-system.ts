import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionEngine, MotionState } from './motion-engine';

export interface CameraWaypoint {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  fov?: number;
  time: number;
}

export interface CameraAnimationConfig {
  waypoints: CameraWaypoint[];
  duration: number;
  loop?: boolean;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'smooth';
  enableDolly?: boolean;
  enableShake?: boolean;
  shakeIntensity?: number;
}

export class CameraAnimationSystem {
  private animationConfig: CameraAnimationConfig;
  private positionPathId: string = '';
  private lookAtPathId: string = '';
  private fovPathId: string = '';
  private currentTime: number = 0;
  private camera: THREE.PerspectiveCamera | null = null;

  constructor(config: CameraAnimationConfig) {
    this.animationConfig = config;
    this.setupAnimationPaths();
  }

  /**
   * Setup motion paths for camera animation
   */
  private setupAnimationPaths(): void {
    const { waypoints, duration, easing } = this.animationConfig;
    
    // Create position path
    const positionKeyframes = waypoints.map(wp => ({
      time: wp.time / duration,
      value: wp.position,
      curve: { type: easing || 'ease-in-out' } as const,
    }));
    
    this.positionPathId = `camera-position-${Date.now()}`;
    motionEngine.createMotionPath(this.positionPathId, positionKeyframes, duration, {
      loop: this.animationConfig.loop || false,
    });

    // Create look-at path
    const lookAtKeyframes = waypoints.map(wp => ({
      time: wp.time / duration,
      value: wp.lookAt,
      curve: { type: easing || 'ease-in-out' } as const,
    }));
    
    this.lookAtPathId = `camera-lookat-${Date.now()}`;
    motionEngine.createMotionPath(this.lookAtPathId, lookAtKeyframes, duration, {
      loop: this.animationConfig.loop || false,
    });

    // Create FOV path if specified
    if (waypoints.some(wp => wp.fov !== undefined)) {
      const fovKeyframes = waypoints.map(wp => ({
        time: wp.time / duration,
        value: wp.fov || 75,
        curve: { type: 'ease-in-out' } as const,
      }));
      
      this.fovPathId = `camera-fov-${Date.now()}`;
      motionEngine.createMotionPath(this.fovPathId, fovKeyframes, duration, {
        loop: this.animationConfig.loop || false,
      });
    }
  }

  /**
   * Attach camera to animation system
   */
  attachCamera(camera: THREE.PerspectiveCamera): void {
    this.camera = camera;
  }

  /**
   * Update camera animation
   */
  update(deltaTime: number): void {
    if (!this.camera) return;

    this.currentTime += deltaTime;
    
    // Handle looping
    if (this.animationConfig.loop) {
      this.currentTime = this.currentTime % this.animationConfig.duration;
    }

    // Get motion states
    const positionState = motionEngine.evaluateMotion(this.positionPathId, this.currentTime);
    const lookAtState = motionEngine.evaluateMotion(this.lookAtPathId, this.currentTime);

    // Apply position with camera shake if enabled
    let position = positionState.position as { x: number; y: number; z: number };
    
    if (this.animationConfig.enableShake) {
      const shakeIntensity = this.animationConfig.shakeIntensity || 0.1;
      position = {
        x: position.x + (Math.random() - 0.5) * shakeIntensity,
        y: position.y + (Math.random() - 0.5) * shakeIntensity,
        z: position.z + (Math.random() - 0.5) * shakeIntensity,
      };
    }

    this.camera.position.set(position.x, position.y, position.z);

    // Apply look-at
    const lookAt = lookAtState.position as { x: number; y: number; z: number };
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

    // Apply FOV animation if available
    if (this.fovPathId) {
      const fovState = motionEngine.evaluateMotion(this.fovPathId, this.currentTime);
      const fov = typeof fovState.position === 'number' ? fovState.position : 75;
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Reset animation to beginning
   */
  reset(): void {
    this.currentTime = 0;
  }

  /**
   * Set current time
   */
  setTime(time: number): void {
    this.currentTime = Math.max(0, Math.min(time, this.animationConfig.duration));
  }

  /**
   * Get current progress (0-1)
   */
  getProgress(): number {
    return this.currentTime / this.animationConfig.duration;
  }

  /**
   * Check if animation is complete
   */
  isComplete(): boolean {
    return !this.animationConfig.loop && this.currentTime >= this.animationConfig.duration;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    motionEngine.deleteMotionPath(this.positionPathId);
    motionEngine.deleteMotionPath(this.lookAtPathId);
    if (this.fovPathId) {
      motionEngine.deleteMotionPath(this.fovPathId);
    }
  }
}

/**
 * React hook for camera animation
 */
export function useCameraAnimation(config: CameraAnimationConfig) {
  const systemRef = useRef<CameraAnimationSystem | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    systemRef.current = new CameraAnimationSystem(config);
    return () => {
      systemRef.current?.dispose();
    };
  }, [config]);

  useFrame((state, delta) => {
    if (systemRef.current && cameraRef.current) {
      systemRef.current.update(delta);
    }
  });

  return {
    attachCamera: (camera: THREE.PerspectiveCamera) => {
      cameraRef.current = camera;
      systemRef.current?.attachCamera(camera);
    },
    reset: () => systemRef.current?.reset(),
    setTime: (time: number) => systemRef.current?.setTime(time),
    getProgress: () => systemRef.current?.getProgress() || 0,
    isComplete: () => systemRef.current?.isComplete() || false,
  };
}

/**
 * Preset camera animations
 */
export const CameraPresets = {
  /**
   * Orbit camera around target
   */
  orbit: (radius: number, height: number, duration: number): CameraAnimationConfig => ({
    waypoints: [
      { position: { x: radius, y: height, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, time: 0 },
      { position: { x: 0, y: height, z: radius }, lookAt: { x: 0, y: 0, z: 0 }, time: duration * 0.25 },
      { position: { x: -radius, y: height, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, time: duration * 0.5 },
      { position: { x: 0, y: height, z: -radius }, lookAt: { x: 0, y: 0, z: 0 }, time: duration * 0.75 },
      { position: { x: radius, y: height, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, time: duration },
    ],
    duration,
    loop: true,
    easing: 'smooth',
  }),

  /**
   * Dolly zoom (Vertigo effect)
   */
  dollyZoom: (startDistance: number, endDistance: number, duration: number): CameraAnimationConfig => ({
    waypoints: [
      { 
        position: { x: 0, y: 0, z: startDistance }, 
        lookAt: { x: 0, y: 0, z: 0 }, 
        fov: 75,
        time: 0 
      },
      { 
        position: { x: 0, y: 0, z: endDistance }, 
        lookAt: { x: 0, y: 0, z: 0 }, 
        fov: 30,
        time: duration 
      },
    ],
    duration,
    easing: 'ease-in-out',
    enableDolly: true,
  }),

  /**
   * Fly-through animation
   */
  flyThrough: (path: Array<{ x: number; y: number; z: number }>, duration: number): CameraAnimationConfig => {
    const timeStep = duration / (path.length - 1);
    const waypoints = path.map((point, index) => ({
      position: point,
      lookAt: path[Math.min(index + 1, path.length - 1)],
      time: index * timeStep,
    }));

    return {
      waypoints,
      duration,
      easing: 'smooth',
    };
  },

  /**
   * Crash zoom (dramatic zoom in)
   */
  crashZoom: (targetPosition: { x: number; y: number; z: number }, duration: number): CameraAnimationConfig => ({
    waypoints: [
      { 
        position: { x: targetPosition.x * 3, y: targetPosition.y * 3, z: targetPosition.z * 3 }, 
        lookAt: targetPosition, 
        fov: 30,
        time: 0 
      },
      { 
        position: { x: targetPosition.x * 1.2, y: targetPosition.y * 1.2, z: targetPosition.z * 1.2 }, 
        lookAt: targetPosition, 
        fov: 75,
        time: duration 
      },
    ],
    duration,
    easing: 'ease-in',
    enableShake: true,
    shakeIntensity: 0.2,
  }),

  /**
   * Pan and tilt
   */
  panTilt: (startPosition: { x: number; y: number; z: number }, endPosition: { x: number; y: number; z: number }, duration: number): CameraAnimationConfig => ({
    waypoints: [
      { 
        position: startPosition, 
        lookAt: { x: 0, y: 0, z: 0 }, 
        time: 0 
      },
      { 
        position: endPosition, 
        lookAt: { x: 0, y: 0, z: 0 }, 
        time: duration 
      },
    ],
    duration,
    easing: 'ease-in-out',
  }),

  /**
   * Helix camera movement
   */
  helix: (radius: number, height: number, rotations: number, duration: number): CameraAnimationConfig => {
    const waypoints = [];
    const steps = 60;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const angle = progress * rotations * Math.PI * 2;
      const currentHeight = -height/2 + progress * height;
      
      waypoints.push({
        position: {
          x: Math.cos(angle) * radius,
          y: currentHeight,
          z: Math.sin(angle) * radius,
        },
        lookAt: { x: 0, y: 0, z: 0 },
        time: progress * duration,
      });
    }

    return {
      waypoints,
      duration,
      easing: 'smooth',
    };
  },
};