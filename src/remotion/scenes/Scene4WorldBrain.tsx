import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';
import {Canvas, useFrame} from '@react-three/fiber';
import {Sphere, Icosahedron, Torus, Points, PointMaterial} from '@react-three/drei';
import * as THREE from 'three';
import {useState, useRef} from 'react';

const WorldCities: React.FC = () => {
	const frame = useCurrentFrame();
	const cities = [
		{name: 'NYC', x: 30, y: 40, size: 8},
		{name: 'LONDON', x: 45, y: 35, size: 6},
		{name: 'TOKYO', x: 80, y: 40, size: 10},
		{name: 'SAN FRANCISCO', x: 15, y: 45, size: 7},
		{name: 'BERLIN', x: 50, y: 30, size: 5},
		{name: 'SINGAPORE', x: 75, y: 55, size: 6},
		{name: 'SYDNEY', x: 85, y: 70, size: 5},
		{name: 'DUBAI', x: 60, y: 45, size: 6},
	];
	
	return (
		<div style={{
			position: 'absolute',
			width: '100%',
			height: '100%',
			background: 'radial-gradient(circle at center, #0a0a1a 0%, #000 100%)'
		}}>
			{cities.map((city, i) => {
				const lightOpacity = interpolate(frame, [0, 25, 50], [0, 1, 0.4], {
					extrapolate: 'clamp',
				});
				const pulseSize = city.size + Math.sin(frame * 0.2 + i) * 2;
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${city.x}%`,
							top: `${city.y}%`,
							width: `${pulseSize}px`,
							height: `${pulseSize}px`,
							background: '#fff',
							borderRadius: '50%',
							boxShadow: `0 0 ${30 + frame / 2}px #4ade80, 0 0 ${60 + frame}px #10a37f`,
							opacity: lightOpacity,
							animation: `pulse ${1 + i * 0.1}s infinite`
						}}
					/>
				);
			})}
			
			{/* Connection lines to center with pulse effect */}
			{cities.map((city, i) => {
				const lineOpacity = interpolate(frame, [25, 40], [0, 0.6], {
					extrapolate: 'clamp',
				});
				const pulse = Math.sin(frame * 0.3 + i) * 0.5 + 0.5;
				
				return (
					<svg
						key={i}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							opacity: lineOpacity
						}}
					>
						<defs>
							<linearGradient id={`gradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="#10a37f" stopOpacity={pulse} />
								<stop offset="100%" stopColor="#4ade80" stopOpacity={pulse * 0.5} />
							</linearGradient>
						</defs>
						<line
							x1={`${city.x}%`}
							y1={`${city.y}%`}
							x2="50%"
							y2="50%"
							stroke={`url(#gradient${i})`}
							strokeWidth={2 + pulse * 2}
							strokeDasharray="5,5"
						>
							<animate
								attributeName="strokeDashoffset"
								from="0"
								to="10"
								dur="0.5s"
								repeatCount="indefinite"
							/>
						</line>
					</svg>
				);
			})}
		</div>
	);
};

const AIBrain: React.FC = () => {
	const brainRef = useRef<THREE.Group>(null);
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Brain rotation - more complex
	useFrame(() => {
		if (brainRef.current) {
			brainRef.current.rotation.y += 0.02;
			brainRef.current.rotation.x += 0.01;
			brainRef.current.rotation.z += 0.005;
		}
	});
	
	// Shatter effect - more dramatic
	const shatterFrame = 70;
	const shatterProgress = spring({
		frame: frame - shatterFrame,
		fps,
		config: {damping: 15, stiffness: 400},
	});
	
	const brainOpacity = interpolate(frame, [40, 55, 70], [0, 1, 1], {
		extrapolate: 'clamp',
	});
	
	const brainScale = frame >= 70 ? 1 + shatterProgress * 4 : 1;
	
	// Pulse effect
	const pulse = 1 + Math.sin(frame * 0.1) * 0.1;
	
	// Energy surge before shatter
	const energySurge = interpolate(frame, [60, 70], [1, 2], {
		extrapolate: 'clamp',
	});
	
	return (
		<group ref={brainRef} scale={brainScale * pulse * energySurge}>
			{/* Outer wireframe */}
			<Icosahedron args={[2.5, 2]}>
				<meshBasicMaterial
					color="#10a37f"
					wireframe
					transparent
					opacity={brainOpacity * 0.8}
				/>
			</Icosahedron>
			
			{/* Middle layer */}
			<Icosahedron args={[2, 1]}>
				<meshBasicMaterial
					color="#4ade80"
					wireframe
					transparent
					opacity={brainOpacity * 0.6}
				/>
			</Icosahedron>
			
			{/* Inner core */}
			<Sphere args={[1.2, 32, 32]}>
				<meshBasicMaterial
					color="#10a37f"
					transparent
					opacity={brainOpacity * 0.4}
				/>
			</Sphere>
			
			{/* Orbiting rings */}
			<Torus args={[3, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
				<meshBasicMaterial
					color="#4ade80"
					transparent
					opacity={brainOpacity * 0.5}
				/>
			</Torus>
			
			<Torus args={[3.5, 0.03, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
				<meshBasicMaterial
					color="#10a37f"
					transparent
					opacity={brainOpacity * 0.3}
				/>
			</Torus>
		</group>
	);
};

const DarknessMoment: React.FC = () => {
	const frame = useCurrentFrame();
	
	const darknessOpacity = interpolate(frame, [70, 73, 76, 80], [0, 1, 1, 0], {
		extrapolate: 'clamp',
	});
	
	// Screen shake during darkness
	const shakeIntensity = interpolate(frame, [70, 73, 76], [0, 1, 0], {
		extrapolate: 'clamp',
	});
	
	return (
		<div
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: '#000',
				opacity: darknessOpacity,
				transform: `translate(${(Math.random() - 0.5) * shakeIntensity * 10}px, ${(Math.random() - 0.5) * shakeIntensity * 10}px)`
			}}
		/>
	);
};

export const Scene4WorldBrain: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Camera rotation - 360 degree effect
	const cameraRotation = interpolate(frame, [0, 80], [0, Math.PI * 2], {
		extrapolate: 'clamp',
	});
	
	// Match cut transition - instant darkness
	const matchCutFrame = 85;
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<WorldCities />
			
			{frame >= 40 && frame < matchCutFrame && (
				<Canvas camera={{position: [0, 0, 8], fov: 80}}>
					<AIBrain />
				</Canvas>
			)}
			
			<DarknessMoment />
		</AbsoluteFill>
	);
};