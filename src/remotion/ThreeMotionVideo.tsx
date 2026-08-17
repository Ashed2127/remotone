import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { z } from 'zod';
import { motionEngine } from '../lib/motion-engine';
import { 
  AnimatedMesh, 
  AnimatedGroup, 
  AnimatedCamera, 
  AnimatedLight,
  createMotionPaths 
} from '../lib/three-motion-components';
import { useCameraAnimation, CameraPresets } from '../lib/camera-animation-system';
import { useParticleSystem3D, ParticlePresets } from '../lib/3d-particle-system';
import * as THREE from 'three';

// Schema for props
export const threeMotionVideoSchema = z.object({
  // Add any configurable props here
});

type Props = z.infer<typeof threeMotionVideoSchema>;

// 3D Scene component
const ThreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Setup motion paths
  const motionPaths = createMotionPaths('demo');

  // Create camera animation
  const cameraAnimation = useCameraAnimation(
    CameraPresets.orbit(10, 5, 20)
  );

  // Create particle system
  const particleSystem = useParticleSystem3D(
    ParticlePresets.sparkles(500)
  );

  useEffect(() => {
    // Setup motion paths
    motionPaths.circle(3, 5);
    motionPaths.spiral(2, 1, 5);
    motionPaths.figure8(1.5, 5);
    
    // Light motion
    motionEngine.createMotionPath('light-path', [
      { time: 0, value: { x: -5, y: 10, z: 5 }, curve: { type: 'ease-in-out' } },
      { time: 0.5, value: { x: 5, y: 10, z: -5 }, curve: { type: 'ease-in-out' } },
      { time: 1, value: { x: -5, y: 10, z: 5 }, curve: { type: 'ease-in-out' } },
    ], 5, { loop: true });
  }, []);

  return (
    <>
      {/* Camera */}
      <perspectiveCamera
        ref={(camera) => cameraAnimation.attachCamera(camera as THREE.PerspectiveCamera)}
        position={[0, 5, 10]}
        fov={75}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <AnimatedLight
        motionPathId="light-path"
        intensity={1}
        color="#ffffff"
        position={[0, 10, 0]}
      />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Animated central object */}
      <AnimatedGroup motionPathId="demo-circle" rotationPathId="demo-circle">
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#667eea" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Orbiting smaller objects */}
        <AnimatedMesh motionPathId="demo-spiral">
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#764ba2" />
        </AnimatedMesh>
        
        <AnimatedMesh motionPathId="demo-figure8">
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#64ffda" />
        </AnimatedMesh>
      </AnimatedGroup>

      {/* Particle system */}
      {particleSystem.getObject() && (
        <primitive object={particleSystem.getObject()!} />
      )}

      {/* Background grid */}
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
    </>
  );
};

// Scene 1: 3D Intro with camera orbit
const Scene1Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0a0a0f' }}>
      <Canvas>
        <ThreeScene />
      </Canvas>
      
      {/* Overlay text */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          margin: 0,
          textShadow: '0 0 20px rgba(102, 126, 234, 0.8)',
        }}>
          3D Motion Engine
        </h1>
        <p style={{
          fontSize: '24px',
          marginTop: '16px',
          opacity: 0.8,
        }}>
          Powered by Three.js & Advanced Physics
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Particle effects showcase
const Scene2Particles: React.FC = () => {
  const particleSystem = useParticleSystem3D(
    ParticlePresets.explosion(800)
  );

  useEffect(() => {
    // Trigger explosion at scene start
    const timer = setTimeout(() => {
      particleSystem.spawn(500, new THREE.Vector3(0, 0, 0));
    }, 500);
    return () => clearTimeout(timer);
  }, [particleSystem]);

  return (
    <AbsoluteFill style={{ background: '#0f0a0a' }}>
      <Canvas>
        <perspectiveCamera position={[0, 5, 15]} fov={75} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 10, 0]} intensity={2} color="#ff4400" />
        
        {particleSystem.getObject() && (
          <primitive object={particleSystem.getObject()!} />
        )}
        
        <gridHelper args={[20, 20, 0x442222, 0x221111]} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          margin: 0,
          textShadow: '0 0 20px rgba(255, 68, 0, 0.8)',
        }}>
          Particle Physics
        </h1>
        <p style={{
          fontSize: '24px',
          marginTop: '16px',
          opacity: 0.8,
        }}>
          GPU-Accelerated Particle Systems
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Camera movement showcase
const Scene3Camera: React.FC = () => {
  const cameraAnimation = useCameraAnimation(
    CameraPresets.helix(8, 6, 2, 10)
  );

  return (
    <AbsoluteFill style={{ background: '#0a0f0a' }}>
      <Canvas>
        <perspectiveCamera
          ref={(camera) => cameraAnimation.attachCamera(camera as THREE.PerspectiveCamera)}
          position={[0, 3, 10]}
          fov={75}
        />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        
        {/* Central object */}
        <mesh>
          <torusKnotGeometry args={[2, 0.6, 128, 32]} />
          <meshStandardMaterial 
            color="#64ffda" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#0a3a2a"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Floating objects */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[
            Math.cos(i * Math.PI / 4) * 4,
            Math.sin(i * Math.PI / 4) * 2,
            Math.sin(i * Math.PI / 4) * 4
          ]}>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#667eea" />
          </mesh>
        ))}
        
        <gridHelper args={[20, 20, 0x224422, 0x112211]} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          margin: 0,
          textShadow: '0 0 20px rgba(100, 255, 218, 0.8)',
        }}>
          Cinematic Camera
        </h1>
        <p style={{
          fontSize: '24px',
          marginTop: '16px',
          opacity: 0.8,
        }}>
          Advanced Camera Animation System
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Main Component
export const ThreeMotionVideo: React.FC<Props> = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Scene 1: 3D Intro (0-5 seconds) */}
      <Sequence from={0} durationInFrames={5 * fps}>
        <Scene1Intro />
      </Sequence>

      {/* Scene 2: Particle Effects (5-10 seconds) */}
      <Sequence from={5 * fps} durationInFrames={5 * fps}>
        <Scene2Particles />
      </Sequence>

      {/* Scene 3: Camera Movement (10-15 seconds) */}
      <Sequence from={10 * fps} durationInFrames={5 * fps}>
        <Scene3Camera />
      </Sequence>
    </AbsoluteFill>
  );
};