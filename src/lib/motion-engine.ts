import { z } from 'zod';

export interface MotionCurve {
  type: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic' | 'custom' | 'cubic-bezier' | 'smooth';
  parameters?: Record<string, number>;
}

export interface MotionKeyframe {
  time: number; // 0-1 normalized
  value: number | { x: number; y: number; z: number };
  curve: MotionCurve;
}

export interface MotionPath {
  keyframes: MotionKeyframe[];
  duration: number;
  loop: boolean;
  yoyo: boolean;
}

export interface MotionState {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  quaternion?: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  opacity: number;
}

export interface PhysicsConfig {
  mass: number;
  friction: number;
  tension: number;
  velocity: { x: number; y: number; z: number };
}

export class MotionEngine {
  private motionPaths = new Map<string, MotionPath>();
  private activeMotions = new Map<string, MotionState>();

  /**
   * Create a smooth motion path with easing
   */
  createMotionPath(
    id: string,
    keyframes: MotionKeyframe[],
    duration: number,
    options: { loop?: boolean; yoyo?: boolean } = {}
  ): MotionPath {
    const path: MotionPath = {
      keyframes: this.optimizeKeyframes(keyframes),
      duration,
      loop: options.loop || false,
      yoyo: options.yoyo || false,
    };

    this.motionPaths.set(id, path);
    return path;
  }

  /**
   * Optimize keyframes by removing redundant ones
   */
  private optimizeKeyframes(keyframes: MotionKeyframe[]): MotionKeyframe[] {
    if (keyframes.length <= 2) return keyframes;

    const optimized: MotionKeyframe[] = [keyframes[0]];
    
    for (let i = 1; i < keyframes.length - 1; i++) {
      const prev = keyframes[i - 1];
      const current = keyframes[i];
      const next = keyframes[i + 1];

      // Skip if linear interpolation would produce similar result
      if (this.isRedundantKeyframe(prev, current, next)) {
        continue;
      }
      
      optimized.push(current);
    }
    
    optimized.push(keyframes[keyframes.length - 1]);
    return optimized;
  }

  /**
   * Check if keyframe is redundant
   */
  private isRedundantKeyframe(
    prev: MotionKeyframe,
    current: MotionKeyframe,
    next: MotionKeyframe
  ): boolean {
    const prevVal = typeof prev.value === 'number' ? prev.value : prev.value.x;
    const currVal = typeof current.value === 'number' ? current.value : current.value.x;
    const nextVal = typeof next.value === 'number' ? next.value : next.value.x;

    const linearInterp = prevVal + (nextVal - prevVal) * 
      ((current.time - prev.time) / (next.time - prev.time));

    return Math.abs(linearInterp - currVal) < 0.01;
  }

  /**
   * Evaluate motion at a given time
   */
  evaluateMotion(pathId: string, time: number): MotionState {
    const path = this.motionPaths.get(pathId);
    if (!path) {
      return this.getDefaultState();
    }

    // Handle looping
    let normalizedTime = time;
    if (path.loop) {
      normalizedTime = time % path.duration;
    }

    // Handle yoyo
    let direction = 1;
    if (path.yoyo && Math.floor(time / path.duration) % 2 === 1) {
      direction = -1;
      normalizedTime = path.duration - normalizedTime;
    }

    // Find surrounding keyframes
    const { prev, next, progress } = this.findSurroundingKeyframes(path, normalizedTime);

    // Interpolate value
    const value = this.interpolateValue(prev, next, progress);

    return {
      position: typeof value === 'number' ? { x: value, y: value, z: value } : value,
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      opacity: typeof value === 'number' ? value : 1,
    };
  }

  /**
   * Evaluate 3D motion with quaternion rotation
   */
  evaluate3DMotion(pathId: string, time: number, rotationPathId?: string): MotionState {
    const motionState = this.evaluateMotion(pathId, time);
    
    if (rotationPathId) {
      const rotationState = this.evaluateMotion(rotationPathId, time);
      motionState.rotation = rotationState.position;
      motionState.quaternion = this.eulerToQuaternion(
        rotationState.position.x,
        rotationState.position.y,
        rotationState.position.z
      );
    }
    
    return motionState;
  }

  /**
   * Find keyframes surrounding a given time
   */
  private findSurroundingKeyframes(
    path: MotionPath,
    time: number
  ): { prev: MotionKeyframe; next: MotionKeyframe; progress: number } {
    const keyframes = path.keyframes;
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
        const prev = keyframes[i];
        const next = keyframes[i + 1];
        const progress = (time - prev.time) / (next.time - prev.time);
        return { prev, next, progress };
      }
    }

    // Fallback to first and last
    return {
      prev: keyframes[0],
      next: keyframes[keyframes.length - 1],
      progress: 1,
    };
  }

  /**
   * Interpolate between two keyframes with easing
   */
  private interpolateValue(
    prev: MotionKeyframe,
    next: MotionKeyframe,
    progress: number
  ): number | { x: number; y: number; z: number } {
    const easedProgress = this.applyEasing(progress, next.curve);

    if (typeof prev.value === 'number' && typeof next.value === 'number') {
      return prev.value + (next.value - prev.value) * easedProgress;
    }

    // Vector interpolation
    const prevVec = prev.value as { x: number; y: number; z: number };
    const nextVec = next.value as { x: number; y: number; z: number };

    return {
      x: prevVec.x + (nextVec.x - prevVec.x) * easedProgress,
      y: prevVec.y + (nextVec.y - prevVec.y) * easedProgress,
      z: prevVec.z + (nextVec.z - prevVec.z) * easedProgress,
    };
  }

  /**
   * Apply easing function to progress
   */
  private applyEasing(progress: number, curve: MotionCurve): number {
    switch (curve.type) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return progress * (2 - progress);
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        return this.bounceEasing(progress);
      case 'elastic':
        return this.elasticEasing(progress, curve.parameters?.tension || 1);
      case 'smooth':
        return this.smoothEasing(progress);
      case 'custom':
        // Custom easing could be implemented with bezier curves
        return this.cubicBezier(progress, curve.parameters);
      default:
        return progress;
    }
  }

  /**
   * Smooth easing function (hermite interpolation)
   */
  private smoothEasing(progress: number): number {
    return progress * progress * (3 - 2 * progress);
  }

  /**
   * Bounce easing function
   */
  private bounceEasing(progress: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (progress < 1 / d1) {
      return n1 * progress * progress;
    } else if (progress < 2 / d1) {
      return n1 * (progress -= 1.5 / d1) * progress + 0.75;
    } else if (progress < 2.5 / d1) {
      return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
    } else {
      return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
    }
  }

  /**
   * Elastic easing function
   */
  private elasticEasing(progress: number, tension: number = 1): number {
    const c4 = (2 * Math.PI) / 3;
    
    return progress === 0
      ? 0
      : progress === 1
      ? 1
      : -Math.pow(2, 10 * progress - 10) * Math.sin((progress * 10 - 10.75) * c4);
  }

  /**
   * Cubic bezier easing
   */
  private cubicBezier(progress: number, params?: Record<string, number>): number {
    const x1 = params?.x1 ?? 0.25;
    const y1 = params?.y1 ?? 0.1;
    const x2 = params?.x2 ?? 0.25;
    const y2 = params?.y2 ?? 1.0;

    // Simplified cubic bezier implementation
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;

    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    function sampleCurveX(t: number): number {
      return ((ax * t + bx) * t + cx) * t;
    }

    function sampleCurveY(t: number): number {
      return ((ay * t + by) * t + cy) * t;
    }

    function solveCurveX(x: number): number {
      let t = x;
      for (let i = 0; i < 8; i++) {
        const xEst = sampleCurveX(t);
        const dEst = (3 * ax * t + 2 * bx) * t + cx;
        if (Math.abs(dEst) < 1e-6) break;
        t -= (xEst - x) / dEst;
      }
      return t;
    }

    return sampleCurveY(solveCurveX(progress));
  }

  /**
   * Create spring physics animation
   */
  createSpringAnimation(
    id: string,
    from: number,
    to: number,
    config: PhysicsConfig
  ): MotionPath {
    const keyframes: MotionKeyframe[] = [];
    const duration = this.calculateSpringDuration(config);
    const steps = 60;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const value = this.simulateSpring(from, to, config, t * duration);
      keyframes.push({
        time: t,
        value,
        curve: { type: 'linear' },
      });
    }

    return this.createMotionPath(id, keyframes, duration);
  }

  /**
   * Calculate spring duration based on physics
   */
  private calculateSpringDuration(config: PhysicsConfig): number {
    const { mass, tension, friction } = config;
    const damping = friction / (2 * Math.sqrt(mass * tension));
    const undampedFrequency = Math.sqrt(tension / mass);
    
    if (damping < 1) {
      // Underdamped
      return Math.PI / (undampedFrequency * Math.sqrt(1 - damping * damping));
    } else if (damping === 1) {
      // Critically damped
      return 2 * Math.PI / undampedFrequency;
    } else {
      // Overdamped
      return 2 * Math.PI / (undampedFrequency * Math.sqrt(damping * damping - 1));
    }
  }

  /**
   * Simulate spring physics
   */
  private simulateSpring(
    from: number,
    to: number,
    config: PhysicsConfig,
    time: number
  ): number {
    const { mass, tension, friction } = config;
    const displacement = to - from;
    const damping = friction / (2 * mass);
    const angularFrequency = Math.sqrt(tension / mass);

    if (damping < angularFrequency) {
      // Underdamped
      const envelope = Math.exp(-damping * time);
      const frequency = Math.sqrt(angularFrequency * angularFrequency - damping * damping);
      return to - envelope * (displacement * Math.cos(frequency * time) + 
        (damping * displacement / frequency) * Math.sin(frequency * time));
    } else if (damping === angularFrequency) {
      // Critically damped
      const envelope = Math.exp(-damping * time);
      return to - envelope * (displacement + displacement * damping * time);
    } else {
      // Overdamped
      const envelope = Math.exp(-damping * time);
      const frequency = Math.sqrt(damping * damping - angularFrequency * angularFrequency);
      return to - envelope * (displacement * Math.cosh(frequency * time) + 
        (damping * displacement / frequency) * Math.sinh(frequency * time));
    }
  }

  /**
   * Create smooth camera path
   */
  createCameraPath(
    id: string,
    waypoints: Array<{ x: number; y: number; z: number; time: number }>,
    smoothing: number = 0.5
  ): MotionPath {
    const smoothedWaypoints = this.smoothPath(waypoints, smoothing);
    const duration = smoothedWaypoints[smoothedWaypoints.length - 1].time;

    const keyframes: MotionKeyframe[] = smoothedWaypoints.map(wp => ({
      time: wp.time / duration,
      value: { x: wp.x, y: wp.y, z: wp.z },
      curve: { type: 'ease-in-out' },
    }));

    return this.createMotionPath(id, keyframes, duration);
  }

  /**
   * Apply Catmull-Rom spline smoothing to path
   */
  private smoothPath(
    waypoints: Array<{ x: number; y: number; z: number; time: number }>,
    tension: number
  ): Array<{ x: number; y: number; z: number; time: number }> {
    if (waypoints.length < 3) return waypoints;

    const smoothed: Array<{ x: number; y: number; z: number; time: number }> = [];

    for (let i = 0; i < waypoints.length; i++) {
      const p0 = waypoints[Math.max(0, i - 1)];
      const p1 = waypoints[i];
      const p2 = waypoints[Math.min(waypoints.length - 1, i + 1)];
      const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)];

      const t = tension;

      const x = this.catmullRom(p0.x, p1.x, p2.x, p3.x, t);
      const y = this.catmullRom(p0.y, p1.y, p2.y, p3.y, t);
      const z = this.catmullRom(p0.z, p1.z, p2.z, p3.z, t);

      smoothed.push({ x, y, z, time: p1.time });
    }

    return smoothed;
  }

  /**
   * Catmull-Rom spline interpolation
   */
  private catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const v0 = (p2 - p0) * 0.5;
    const v1 = (p3 - p1) * 0.5;
    const t2 = t * t;
    const t3 = t * t2;

    return (2 * p1 - 2 * p2 + v0 + v1) * t3 +
           (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
           v0 * t +
           p1;
  }

  /**
   * Get default motion state
   */
  private getDefaultState(): MotionState {
    return {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 },
      opacity: 1,
    };
  }

  /**
   * Convert Euler angles to Quaternion
   */
  private eulerToQuaternion(x: number, y: number, z: number): { x: number; y: number; z: number; w: number } {
    const cx = Math.cos(x * 0.5);
    const cy = Math.cos(y * 0.5);
    const cz = Math.cos(z * 0.5);
    const sx = Math.sin(x * 0.5);
    const sy = Math.sin(y * 0.5);
    const sz = Math.sin(z * 0.5);

    return {
      x: sx * cy * cz - cx * sy * sz,
      y: cx * sy * cz + sx * cy * sz,
      z: cx * cy * sz - sx * sy * cz,
      w: cx * cy * cz + sx * sy * sz,
    };
  }

  /**
   * Spherical linear interpolation for quaternions
   */
  private slerp(q1: { x: number; y: number; z: number; w: number }, q2: { x: number; y: number; z: number; w: number }, t: number): { x: number; y: number; z: number; w: number } {
    let dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    
    if (dot < 0) {
      q2 = { x: -q2.x, y: -q2.y, z: -q2.z, w: -q2.w };
      dot = -dot;
    }
    
    if (dot > 0.9995) {
      return {
        x: q1.x + t * (q2.x - q1.x),
        y: q1.y + t * (q2.y - q1.y),
        z: q1.z + t * (q2.z - q1.z),
        w: q1.w + t * (q2.w - q1.w),
      };
    }
    
    const theta0 = Math.acos(dot);
    const theta = theta0 * t;
    const sinTheta = Math.sin(theta);
    const sinTheta0 = Math.sin(theta0);
    
    const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
    const s1 = sinTheta / sinTheta0;
    
    return {
      x: s0 * q1.x + s1 * q2.x,
      y: s0 * q1.y + s1 * q2.y,
      z: s0 * q1.z + s1 * q2.z,
      w: s0 * q1.w + s1 * q2.w,
    };
  }

  /**
   * Create 3D rotation path
   */
  create3DRotationPath(
    id: string,
    rotations: Array<{ x: number; y: number; z: number; time: number }>,
    duration: number,
    options: { loop?: boolean; yoyo?: boolean } = {}
  ): MotionPath {
    const keyframes: MotionKeyframe[] = rotations.map(rot => ({
      time: rot.time / duration,
      value: { x: rot.x, y: rot.y, z: rot.z },
      curve: { type: 'ease-in-out' },
    }));

    return this.createMotionPath(id, keyframes, duration, options);
  }

  /**
   * Create 3D position path with bezier curves
   */
  create3DPositionPath(
    id: string,
    positions: Array<{ x: number; y: number; z: number; time: number }>,
    duration: number,
    options: { loop?: boolean; yoyo?: boolean; smoothing?: number } = {}
  ): MotionPath {
    const smoothing = options.smoothing || 0.5;
    const smoothedPositions = this.smoothPath(positions, smoothing);
    
    const keyframes: MotionKeyframe[] = smoothedPositions.map(pos => ({
      time: pos.time / duration,
      value: { x: pos.x, y: pos.y, z: pos.z },
      curve: { type: 'ease-in-out' },
    }));

    return this.createMotionPath(id, keyframes, duration, options);
  }

  /**
   * Get motion path by ID
   */
  getMotionPath(id: string): MotionPath | undefined {
    return this.motionPaths.get(id);
  }

  /**
   * Delete motion path
   */
  deleteMotionPath(id: string): boolean {
    return this.motionPaths.delete(id);
  }

  /**
   * Clear all motion paths
   */
  clearMotionPaths(): void {
    this.motionPaths.clear();
    this.activeMotions.clear();
  }

  /**
   * Create preset motion paths for common animations
   */
  createPreset(type: 'fade-in' | 'fade-out' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out' | 'rotate'): MotionPath {
    const presets: Record<string, MotionKeyframe[]> = {
      'fade-in': [
        { time: 0, value: 0, curve: { type: 'ease-out' } },
        { time: 1, value: 1, curve: { type: 'linear' } },
      ],
      'fade-out': [
        { time: 0, value: 1, curve: { type: 'linear' } },
        { time: 1, value: 0, curve: { type: 'ease-in' } },
      ],
      'slide-up': [
        { time: 0, value: { x: 0, y: 100, z: 0 }, curve: { type: 'ease-out' } },
        { time: 1, value: { x: 0, y: 0, z: 0 }, curve: { type: 'linear' } },
      ],
      'slide-down': [
        { time: 0, value: { x: 0, y: -100, z: 0 }, curve: { type: 'ease-out' } },
        { time: 1, value: { x: 0, y: 0, z: 0 }, curve: { type: 'linear' } },
      ],
      'zoom-in': [
        { time: 0, value: 0.5, curve: { type: 'ease-out' } },
        { time: 1, value: 1, curve: { type: 'linear' } },
      ],
      'zoom-out': [
        { time: 0, value: 1, curve: { type: 'linear' } },
        { time: 1, value: 0.5, curve: { type: 'ease-in' } },
      ],
      'rotate': [
        { time: 0, value: { x: 0, y: 0, z: 0 }, curve: { type: 'ease-in-out' } },
        { time: 1, value: { x: 0, y: 0, z: 360 }, curve: { type: 'linear' } },
      ],
    };

    return this.createMotionPath(
      `preset-${type}`,
      presets[type],
      1,
      { loop: false, yoyo: false }
    );
  }
}

export const motionEngine = new MotionEngine();