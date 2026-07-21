import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';
import {Canvas, useFrame} from '@react-three/fiber';
import {Points, PointMaterial, Sphere, Stars} from '@react-three/drei';
import * as THREE from 'three';
import {useState, useRef} from 'react';

const ParticleExplosion: React.FC = () => {
	const particlesRef = useRef<THREE.Points>(null);
	const [particles, setParticles] = useState<THREE.Vector3[]>([]);
	const [velocities, setVelocities] = useState<THREE.Vector3[]>([]);
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();
	
	// Generate particles with explosion velocities
	useFrame(() => {
		if (particles.length === 0) {
			const newParticles = Array.from({length: 20000}, () => 
				new THREE.Vector3(0, 0, 0)
			);
			const newVelocities = Array.from({length: 20000}, () => {
				const theta = Math.random() * Math.PI * 2;
				const phi = Math.random() * Math.PI;
				const speed = 0.8 + Math.random() * 3;
				return new THREE.Vector3(
					Math.sin(phi) * Math.cos(theta) * speed,
					Math.sin(phi) * Math.sin(theta) * speed,
					Math.cos(phi) * speed
				);
			});
			setParticles(newParticles);
			setVelocities(newVelocities);
		}
		
		if (particlesRef.current && particles.length > 0) {
			const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
			for (let i = 0; i < particles.length; i++) {
				// Update positions based on velocities
				positions[i * 3] += velocities[i].x * 0.15;
				positions[i * 3 + 1] += velocities[i].y * 0.15;
				positions[i * 3 + 2] += velocities[i].z * 0.15;
				
				// Add turbulence and morphing effect
				const morphFactor = Math.sin(frame * 0.15 + i * 0.001);
				positions[i * 3] += morphFactor * 0.05;
				positions[i * 3 + 1] += Math.cos(frame * 0.12 + i * 0.001) * 0.05;
				positions[i * 3 + 2] += Math.sin(frame * 0.08 + i * 0.001) * 0.05;
				
				// Spiral formation for galaxy morph
				const angle = frame * 0.02 + i * 0.0001;
				const radius = 2 + (frame * 0.01);
				positions[i * 3] += Math.cos(angle) * 0.02;
				positions[i * 3 + 1] += Math.sin(angle) * 0.02;
			}
			particlesRef.current.geometry.attributes.position.needsUpdate = true;
		}
	});
	
	return (
		<group>
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
			<Points ref={particlesRef}>
				<PointMaterial
					transparent
					color="#10a37f"
					size={0.1}
					sizeAttenuation={true}
					depthWrite={false}
					opacity={0.95}
				/>
			</Points>
		</group>
	);
};

export const Scene1CursorExplosion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Text typing animation
	const text = "What if knowledge could talk back?";
	const typingProgress = interpolate(frame, [0, 50], [0, text.length], {
		extrapolateRight: 'clamp',
	});
	const currentText = text.slice(0, Math.floor(typingProgress));
	
	// Cursor blink
	const cursorOpacity = interpolate(frame, [0, 20, 40], [1, 0, 1], {
		extrapolate: 'clamp',
	});
	
	// Explosion timing
	const explosionFrame = 55;
	const explosionProgress = spring({
		frame: frame - explosionFrame,
		fps,
		config: {damping: 20, stiffness: 300},
	});
	
	// Fade out text before explosion
	const textOpacity = interpolate(frame, [50, 55], [1, 0], {
		extrapolate: 'clamp',
	});
	
	// Show particles after explosion
	const particleOpacity = interpolate(frame, [55, 65], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Liquid morph transition - instead of white flash
	const morphProgress = interpolate(frame, [80, 90], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Camera zoom with acceleration
	const cameraZ = interpolate(frame, [70, 90], [5, 20], {
		extrapolate: 'clamp',
	});
	
	// Camera rotation for morph effect
	const cameraRotation = interpolate(frame, [80, 90], [0, Math.PI * 0.5], {
		extrapolate: 'clamp',
	});
	
	// Liquid distortion effect
	const distortionScale = interpolate(frame, [80, 90], [1, 1.5], {
		extrapolate: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* Text phase */}
			{frame < 55 && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					fontFamily: 'Courier New, monospace',
					fontSize: '42px',
					color: '#10a37f',
					opacity: textOpacity,
					whiteSpace: 'nowrap',
					textShadow: '0 0 20px rgba(16, 163, 127, 0.5)',
					fontWeight: 'bold'
				}}>
					{currentText}
					<span style={{opacity: cursorOpacity, color: '#10a37f'}}>|</span>
				</div>
			)}
			
			{/* Particle explosion with liquid morph */}
			{frame >= 55 && (
				<div style={{opacity: particleOpacity}}>
					<Canvas 
						camera={{position: [0, 0, cameraZ], fov: 90, rotation: [0, cameraRotation, 0]}}
						style={{
							filter: `blur(${morphProgress * 2}px) contrast(${1 + morphProgress * 0.5})`,
							transform: `scale(${distortionScale})`
						}}
					>
						<ParticleExplosion />
					</Canvas>
				</div>
			)}
			
			{/* Liquid morph overlay */}
			{frame >= 80 && frame <= 90 && (
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: `radial-gradient(circle at center, 
						transparent 0%, 
						rgba(16, 163, 127, ${morphProgress * 0.3}) 50%, 
						rgba(0, 0, 0, ${morphProgress * 0.8}) 100%)`,
					pointerEvents: 'none',
					opacity: morphProgress
				}} />
			)}
		</AbsoluteFill>
	);
};