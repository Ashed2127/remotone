import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';
import {Canvas, useFrame} from '@react-three/fiber';
import {Sphere, Icosahedron, Torus, Points, PointMaterial} from '@react-three/drei';
import * as THREE from 'three';
import {useRef, useState} from 'react';

const GlowingSphere: React.FC = () => {
	const sphereRef = useRef<THREE.Group>(null);
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	useFrame(() => {
		if (sphereRef.current) {
			sphereRef.current.rotation.y += 0.03;
			sphereRef.current.rotation.x += 0.02;
		}
	});
	
	// Pulse effect - more dramatic
	const pulse = interpolate(frame, [0, 30, 60], [1, 1.5, 1], {
		extrapolate: 'clamp',
	});
	
	// Color shift
	const hue = interpolate(frame, [0, 60], [0.4, 0.5], {
		extrapolate: 'clamp',
	});
	
	const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
	
	return (
		<group ref={sphereRef} scale={pulse}>
			{/* Core sphere */}
			<Sphere args={[2, 32, 32]}>
				<meshBasicMaterial
					color={color}
					transparent
					opacity={0.9}
				/>
			</Sphere>
			
			{/* Wireframe overlay */}
			<Icosahedron args={[2.1, 2]}>
				<meshBasicMaterial
					color="#ffffff"
					wireframe
					transparent
					opacity={0.3}
				/>
			</Icosahedron>
			
			{/* Outer glow */}
			<Sphere args={[2.5, 32, 32]}>
				<meshBasicMaterial
					color={color}
					transparent
					opacity={0.2}
				/>
			</Sphere>
			
			{/* Orbiting ring */}
			<Torus args={[3, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, frame * 0.02]}>
				<meshBasicMaterial
					color="#4ade80"
					transparent
					opacity={0.6}
				/>
			</Torus>
		</group>
	);
};

const QuestionsCollapse: React.FC = () => {
	const frame = useCurrentFrame();
	const questions = [
		'Help me learn.',
		'Help me build.',
		'Help me create.',
		'Help me solve.',
		'Help me dream.',
	];
	
	return (
		<div style={{
			position: 'absolute',
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			{questions.map((question, i) => {
				const delay = i * 3;
				const collapseProgress = interpolate(frame - delay, [0, 25], [0, 1], {
					extrapolate: 'clamp',
				});
				
				const angle = (i / questions.length) * Math.PI * 2;
				const radius = 400 * (1 - collapseProgress);
				const x = 50 + Math.cos(angle) * radius / 10;
				const y = 50 + Math.sin(angle) * radius / 10;
				const scale = 1 - collapseProgress * 0.9;
				const opacity = 1 - collapseProgress;
				const rotate = collapseProgress * 360;
				const hue = (i * 50 + frame * 3) % 360;
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							fontFamily: 'Arial, sans-serif',
							fontSize: '28px',
							color: `hsl(${hue}, 80%, 70%)`,
							opacity,
							transform: `scale(${scale}) rotate(${rotate}deg)`,
							fontWeight: 'bold',
							textShadow: `0 0 20px hsl(${hue}, 80%, 50%)`,
							whiteSpace: 'nowrap'
						}}
					>
						{question}
					</div>
				);
			})}
		</div>
	);
};

export const Scene6LogoZoom: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Infinite zoom effect - exponential infinite zoom
	const cameraZ = interpolate(frame, [0, 30, 60, 90], [15, 5, 1, 0.1], {
		extrapolate: 'clamp',
	});
	
	// Camera rotation for spiral effect
	const cameraRotation = interpolate(frame, [60, 90], [0, Math.PI * 4], {
		extrapolate: 'clamp',
	});
	
	// Voice text "The future isn't built by AI."
	const voice1Opacity = interpolate(frame, [25, 40], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Voice text "It's built by people using it."
	const voice2Opacity = interpolate(frame, [55, 70], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Dramatic white flash transition
	const flashIntensity = interpolate(frame, [85, 87, 90], [0, 1, 0], {
		extrapolate: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<QuestionsCollapse />
			
			{frame >= 25 && (
				<Canvas 
					camera={{position: [0, 0, cameraZ], fov: 120, rotation: [0, cameraRotation, 0]}}
					style={{
						filter: `brightness(${1 + (frame >= 60 ? (frame - 60) * 0.05 : 0)})`
					}}
				>
					<GlowingSphere />
				</Canvas>
			)}
			
			{frame >= 25 && frame < 55 && (
				<div style={{
					position: 'absolute',
					bottom: '35%',
					left: '50%',
					transform: 'translateX(-50%)',
					fontFamily: 'Arial, sans-serif',
					fontSize: '38px',
					color: '#fff',
					opacity: voice1Opacity,
					textAlign: 'center',
					fontWeight: 'bold',
					textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
				}}>
					The future isn't built by AI.
				</div>
			)}
			
			{frame >= 55 && (
				<div style={{
					position: 'absolute',
					bottom: '35%',
					left: '50%',
					transform: 'translateX(-50%)',
					fontFamily: 'Arial, sans-serif',
					fontSize: '38px',
					color: '#fff',
					opacity: voice2Opacity,
					textAlign: 'center',
					fontWeight: 'bold',
					textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
				}}>
					It's built by people using it.
				</div>
			)}
			
			{/* Dramatic white flash transition */}
			{frame >= 85 && frame <= 90 && (
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: '#fff',
					opacity: flashIntensity,
					pointerEvents: 'none',
					transform: `scale(${1 + flashIntensity * 0.2})`
				}} />
			)}
		</AbsoluteFill>
	);
};