import React, { useRef, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleSystemProps {
  count: number;
  behavior: 'network' | 'explode' | 'converge' | 'flow' | 'orbit';
  color?: string;
  connections?: boolean;
  morphTargets?: Array<{ x: number; y: number; z: number }>;
}

export const AdvancedParticleSystem: React.FC<ParticleSystemProps> = ({
  count,
  behavior,
  color = '#10a37f',
  connections = false,
  morphTargets,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles
  const particles = useMemo(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 200 + Math.random() * 300;
      
      newParticles.push({
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        life: Math.random(),
        maxLife: 1,
        size: 2 + Math.random() * 3,
        color,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
    return newParticles;
  }, [count, color]);

  // Calculate particle positions based on behavior
  const getParticlePosition = (particle: Particle, index: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const time = frame / fps;

    switch (behavior) {
      case 'network':
        // Slow orbit with gentle pulsing
        const orbitAngle = (index / count) * Math.PI * 2 + time * 0.5;
        const orbitRadius = 150 + Math.sin(time * 2 + index) * 50;
        return {
          x: centerX + Math.cos(orbitAngle) * orbitRadius,
          y: centerY + Math.sin(orbitAngle) * orbitRadius,
          z: particle.z + Math.sin(time + index) * 20,
        };

      case 'explode':
        // Explosive outward motion
        const explodeProgress = Math.min(time / 2, 1);
        const explodeAngle = (index / count) * Math.PI * 2;
        const explodeRadius = explodeProgress * 400;
        return {
          x: centerX + Math.cos(explodeAngle) * explodeRadius,
          y: centerY + Math.sin(explodeAngle) * explodeRadius,
          z: particle.z * (1 + explodeProgress * 2),
        };

      case 'converge':
        // Converge to center
        const convergeProgress = Math.min(time / 2, 1);
        const startAngle = (index / count) * Math.PI * 2;
        const startRadius = 400 * (1 - convergeProgress);
        return {
          x: centerX + Math.cos(startAngle) * startRadius,
          y: centerY + Math.sin(startAngle) * startRadius,
          z: particle.z * (1 - convergeProgress),
        };

      case 'flow':
        // Flowing stream pattern
        const flowAngle = (index / count) * Math.PI * 2 + time;
        const flowRadius = 100 + Math.sin(time * 3 + index * 0.1) * 80;
        return {
          x: centerX + Math.cos(flowAngle) * flowRadius,
          y: centerY + Math.sin(flowAngle) * flowRadius + Math.sin(time * 2) * 50,
          z: particle.z,
        };

      case 'orbit':
        // Fast orbital motion
        const orbitSpeed = 2;
        const orbitA = (index / count) * Math.PI * 2 + time * orbitSpeed;
        const orbitR = 120 + (index % 3) * 40;
        return {
          x: centerX + Math.cos(orbitA) * orbitR,
          y: centerY + Math.sin(orbitA) * orbitR,
          z: Math.sin(time * orbitSpeed + index) * 50,
        };

      default:
        return { x: centerX, y: centerY, z: 0 };
    }
  };

  // Calculate connections between nearby particles
  const renderConnections = () => {
    if (!connections) return null;

    const lines: React.ReactNode[] = [];
    const threshold = 100;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const pos1 = getParticlePosition(particles[i], i);
        const pos2 = getParticlePosition(particles[j], j);
        
        const distance = Math.sqrt(
          Math.pow(pos1.x - pos2.x, 2) +
          Math.pow(pos1.y - pos2.y, 2) +
          Math.pow(pos1.z - pos2.z, 2)
        );

        if (distance < threshold) {
          const opacity = (1 - distance / threshold) * 0.3;
          lines.push(
            <line
              key={`${i}-${j}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={color}
              strokeWidth="0.5"
              strokeOpacity={opacity}
            />
          );
        }
      }
    }

    return lines;
  };

  return (
    <AbsoluteFill>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {renderConnections()}
        {particles.map((particle, index) => {
          const pos = getParticlePosition(particle, index);
          const scale = 1 + Math.sin(frame * 0.1 + index) * 0.2;
          
          return (
            <circle
              key={particle.id}
              cx={pos.x}
              cy={pos.y}
              r={particle.size * scale}
              fill={particle.color}
              opacity={particle.opacity}
              style={{
                filter: `blur(${particle.size * 0.5}px)`,
              }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};