import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionEngine, PhysicsConfig } from './motion-engine';

export interface ParticleConfig {
  count: number;
  lifetime: number;
  spawnRate: number;
  initialVelocity: { x: number; y: number; z: number };
  velocityVariation: { x: number; y: number; z: number };
  acceleration: { x: number; y: number; z: number };
  size: number;
  sizeVariation: number;
  color: THREE.Color;
  colorVariation: THREE.Color;
  opacity: number;
  opacityDecay: number;
  gravity?: number;
  drag?: number;
  bounce?: number;
  collision?: boolean;
  collisionRadius?: number;
}

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  opacity: number;
  active: boolean;
}

export class ParticleSystem3D {
  private particles: Particle[] = [];
  private config: ParticleConfig;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;
  private time: number = 0;
  private physicsConfig: PhysicsConfig;

  constructor(config: ParticleConfig) {
    this.config = config;
    this.physicsConfig = {
      mass: 1,
      friction: config.drag || 0.98,
      tension: 0.1,
      velocity: { x: 0, y: 0, z: 0 },
    };

    // Initialize particles
    for (let i = 0; i < config.count; i++) {
      this.particles.push(this.createParticle());
    }

    // Create geometry and material
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: config.size,
      color: config.color,
      transparent: true,
      opacity: config.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.updateGeometry();
  }

  /**
   * Create a single particle
   */
  private createParticle(): Particle {
    return {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(
        this.config.initialVelocity.x + (Math.random() - 0.5) * this.config.velocityVariation.x,
        this.config.initialVelocity.y + (Math.random() - 0.5) * this.config.velocityVariation.y,
        this.config.initialVelocity.z + (Math.random() - 0.5) * this.config.velocityVariation.z
      ),
      acceleration: new THREE.Vector3(
        this.config.acceleration.x,
        this.config.acceleration.y,
        this.config.acceleration.z
      ),
      life: 0,
      maxLife: this.config.lifetime + (Math.random() - 0.5) * this.config.lifetime * 0.2,
      size: this.config.size + (Math.random() - 0.5) * this.config.sizeVariation,
      color: this.config.color.clone().offsetHSL(
        (Math.random() - 0.5) * this.config.colorVariation.getHSL({ h: 0, s: 0, l: 0 }).h,
        (Math.random() - 0.5) * this.config.colorVariation.getHSL({ h: 0, s: 0, l: 0 }).s,
        (Math.random() - 0.5) * this.config.colorVariation.getHSL({ h: 0, s: 0, l: 0 }).l
      ),
      opacity: this.config.opacity,
      active: false,
    };
  }

  /**
   * Spawn particles
   */
  spawn(count: number, position: THREE.Vector3): void {
    let spawned = 0;
    for (const particle of this.particles) {
      if (!particle.active && spawned < count) {
        particle.position.copy(position);
        particle.velocity.set(
          this.config.initialVelocity.x + (Math.random() - 0.5) * this.config.velocityVariation.x,
          this.config.initialVelocity.y + (Math.random() - 0.5) * this.config.velocityVariation.y,
          this.config.initialVelocity.z + (Math.random() - 0.5) * this.config.velocityVariation.z
        );
        particle.life = 0;
        particle.maxLife = this.config.lifetime + (Math.random() - 0.5) * this.config.lifetime * 0.2;
        particle.opacity = this.config.opacity;
        particle.active = true;
        spawned++;
      }
    }
  }

  /**
   * Update particle physics
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    for (const particle of this.particles) {
      if (!particle.active) continue;

      // Update life
      particle.life += deltaTime;
      particle.opacity = this.config.opacity * (1 - particle.life / particle.maxLife);

      // Deactivate dead particles
      if (particle.life >= particle.maxLife) {
        particle.active = false;
        continue;
      }

      // Apply gravity
      if (this.config.gravity) {
        particle.acceleration.y -= this.config.gravity;
      }

      // Apply drag
      if (this.config.drag) {
        particle.velocity.multiplyScalar(this.config.drag);
      }

      // Update velocity with acceleration
      particle.velocity.add(particle.acceleration.clone().multiplyScalar(deltaTime));

      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));

      // Handle collision with ground
      if (this.config.collision && this.config.collisionRadius) {
        if (particle.position.y < -this.config.collisionRadius) {
          particle.position.y = -this.config.collisionRadius;
          particle.velocity.y *= -(this.config.bounce ?? 0.5);
          particle.velocity.x *= 0.8;
          particle.velocity.z *= 0.8;
        }
      }

      // Reset acceleration
      particle.acceleration.set(0, 0, 0);
    }

    this.updateGeometry();
  }

  /**
   * Update geometry based on particle states
   */
  private updateGeometry(): void {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    for (const particle of this.particles) {
      if (particle.active) {
        positions.push(particle.position.x, particle.position.y, particle.position.z);
        colors.push(particle.color.r, particle.color.g, particle.color.b);
        sizes.push(particle.size);
      }
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  /**
   * Get Three.js object
   */
  getObject(): THREE.Points {
    return this.points;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ParticleConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.material.size = this.config.size;
    this.material.color = this.config.color;
    this.material.opacity = this.config.opacity;
  }

  /**
   * Reset all particles
   */
  reset(): void {
    for (const particle of this.particles) {
      particle.active = false;
    }
    this.time = 0;
  }

  /**
   * Get active particle count
   */
  getActiveCount(): number {
    return this.particles.filter(p => p.active).length;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

/**
 * React hook for 3D particle system
 */
export function useParticleSystem3D(config: ParticleConfig) {
  const systemRef = useRef<ParticleSystem3D | null>(null);
  const spawnPointRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    systemRef.current = new ParticleSystem3D(config);
    return () => {
      systemRef.current?.dispose();
    };
  }, [config]);

  useFrame((state, delta) => {
    if (systemRef.current) {
      // Spawn new particles
      const spawnCount = Math.floor(config.spawnRate * delta);
      if (spawnCount > 0) {
        systemRef.current.spawn(spawnCount, spawnPointRef.current);
      }

      // Update physics
      systemRef.current.update(delta);
    }
  });

  return {
    getObject: () => systemRef.current?.getObject(),
    setSpawnPoint: (point: THREE.Vector3) => {
      spawnPointRef.current = point;
    },
    spawn: (count: number, position: THREE.Vector3) => {
      systemRef.current?.spawn(count, position);
    },
    reset: () => systemRef.current?.reset(),
    getActiveCount: () => systemRef.current?.getActiveCount() || 0,
    updateConfig: (newConfig: Partial<ParticleConfig>) => {
      systemRef.current?.updateConfig(newConfig);
    },
  };
}

/**
 * Preset particle configurations
 */
export const ParticlePresets = {
  /**
   * Fire particles
   */
  fire: (count: number = 1000): ParticleConfig => ({
    count,
    lifetime: 2,
    spawnRate: 50,
    initialVelocity: { x: 0, y: 5, z: 0 },
    velocityVariation: { x: 2, y: 2, z: 2 },
    acceleration: { x: 0, y: -2, z: 0 },
    size: 0.1,
    sizeVariation: 0.05,
    color: new THREE.Color(0xff4400),
    colorVariation: new THREE.Color(0x331100),
    opacity: 0.8,
    opacityDecay: 0.4,
    gravity: 3,
    drag: 0.98,
    collision: false,
  }),

  /**
   * Snow particles
   */
  snow: (count: number = 2000): ParticleConfig => ({
    count,
    lifetime: 10,
    spawnRate: 20,
    initialVelocity: { x: 0, y: -1, z: 0 },
    velocityVariation: { x: 0.5, y: 0.5, z: 0.5 },
    acceleration: { x: 0, y: -0.5, z: 0 },
    size: 0.05,
    sizeVariation: 0.03,
    color: new THREE.Color(0xffffff),
    colorVariation: new THREE.Color(0x111111),
    opacity: 0.9,
    opacityDecay: 0.1,
    gravity: 0.5,
    drag: 0.99,
    collision: true,
    collisionRadius: 10,
  }),

  /**
   * Explosion particles
   */
  explosion: (count: number = 500): ParticleConfig => ({
    count,
    lifetime: 1.5,
    spawnRate: 500,
    initialVelocity: { x: 0, y: 0, z: 0 },
    velocityVariation: { x: 15, y: 15, z: 15 },
    acceleration: { x: 0, y: -5, z: 0 },
    size: 0.15,
    sizeVariation: 0.1,
    color: new THREE.Color(0xffaa00),
    colorVariation: new THREE.Color(0x331100),
    opacity: 1,
    opacityDecay: 0.7,
    gravity: 8,
    drag: 0.95,
    collision: true,
    collisionRadius: 5,
    bounce: 0.3,
  }),

  /**
   * Magic sparkles
   */
  sparkles: (count: number = 300): ParticleConfig => ({
    count,
    lifetime: 3,
    spawnRate: 30,
    initialVelocity: { x: 0, y: 2, z: 0 },
    velocityVariation: { x: 1, y: 1, z: 1 },
    acceleration: { x: 0, y: 0, z: 0 },
    size: 0.08,
    sizeVariation: 0.04,
    color: new THREE.Color(0xaaddff),
    colorVariation: new THREE.Color(0x221133),
    opacity: 0.9,
    opacityDecay: 0.3,
    drag: 0.99,
    collision: false,
  }),

  /**
   * Smoke particles
   */
  smoke: (count: number = 800): ParticleConfig => ({
    count,
    lifetime: 4,
    spawnRate: 40,
    initialVelocity: { x: 0, y: 1, z: 0 },
    velocityVariation: { x: 0.5, y: 0.5, z: 0.5 },
    acceleration: { x: 0, y: 0.2, z: 0 },
    size: 0.2,
    sizeVariation: 0.1,
    color: new THREE.Color(0x444444),
    colorVariation: new THREE.Color(0x111111),
    opacity: 0.4,
    opacityDecay: 0.1,
    drag: 0.98,
    collision: false,
  }),

  /**
   * confetti particles
   */
  confetti: (count: number = 400): ParticleConfig => ({
    count,
    lifetime: 5,
    spawnRate: 80,
    initialVelocity: { x: 0, y: 8, z: 0 },
    velocityVariation: { x: 4, y: 2, z: 4 },
    acceleration: { x: 0, y: -4, z: 0 },
    size: 0.12,
    sizeVariation: 0.06,
    color: new THREE.Color(0xff3366),
    colorVariation: new THREE.Color(0x33ccff),
    opacity: 0.95,
    opacityDecay: 0.2,
    gravity: 6,
    drag: 0.99,
    collision: true,
    collisionRadius: 8,
    bounce: 0.4,
  }),
};