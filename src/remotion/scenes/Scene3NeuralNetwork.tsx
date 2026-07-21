import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';
import {Canvas, useFrame} from '@react-three/fiber';
import {Line, Sphere, Points, PointMaterial} from '@react-three/drei';
import * as THREE from 'three';
import {useState, useRef} from 'react';

const NeuralNetwork: React.FC<{explosionScale?: number}> = ({explosionScale = 1}) => {
	const groupRef = useRef<THREE.Group>(null);
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();
	
	// Speed ramp effect - more dramatic
	const speed = interpolate(frame, [0, 30, 60, 90], [1, 8, 12, 1], {
		extrapolate: 'clamp',
	});
	
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.z += 0.003 * speed;
			groupRef.current.rotation.y += 0.005 * speed;
			groupRef.current.rotation.x += 0.002 * speed;
		}
	});
	
	// Generate multi-layer neural network
	const layers = [8, 12, 16, 12, 8]; // Layer sizes
	const nodes = [];
	const connections = [];
	
	let nodeIndex = 0;
	layers.forEach((layerSize, layerIndex) => {
		const x = (layerIndex - (layers.length - 1) / 2) * 2;
		for (let i = 0; i < layerSize; i++) {
			const y = (i - (layerSize - 1) / 2) * 0.8;
			const z = (Math.random() - 0.5) * 1;
			nodes.push({
				position: [x, y, z] as [number, number, number],
				color: `hsl(${(nodeIndex * 15 + frame * 2) % 360}, 80%, 60%)`,
				layer: layerIndex
			});
			nodeIndex++;
		}
	});
	
	// Generate connections between layers
	for (let l = 0; l < layers.length - 1; l++) {
		const currentLayerStart = layers.slice(0, l).reduce((a, b) => a + b, 0);
		const nextLayerStart = layers.slice(0, l + 1).reduce((a, b) => a + b, 0);
		
		for (let i = 0; i < layers[l]; i++) {
			for (let j = 0; j < layers[l + 1]; j++) {
				if (Math.random() > 0.6) {
					connections.push([
						nodes[currentLayerStart + i].position,
						nodes[nextLayerStart + j].position
					]);
				}
			}
		}
	}
	
	// Pulse effect for active connections
	const pulseIntensity = Math.sin(frame * 0.2) * 0.5 + 0.5;
	
	return (
		<group ref={groupRef} scale={explosionScale}>
			{/* Connections with pulse effect */}
			{connections.map((connection, i) => {
				const isActive = (i + frame) % 10 < 5;
				return (
					<Line
						key={i}
						points={connection}
						color={isActive ? '#00ffff' : '#3b82f6'}
						lineWidth={isActive ? 2 : 1}
						transparent
						opacity={isActive ? 0.8 * pulseIntensity : 0.3}
					/>
				);
			})}
			
			{/* Nodes with glow */}
			{nodes.map((node, i) => {
				const pulse = 1 + Math.sin(frame * 0.3 + i) * 0.2;
				return (
					<group key={i}>
						<Sphere
							position={node.position}
							args={[0.08 * pulse, 16, 16]}
						>
							<meshBasicMaterial color={node.color} transparent opacity={0.9} />
						</Sphere>
						{/* Glow effect */}
						<Sphere
							position={node.position}
							args={[0.15 * pulse, 16, 16]}
						>
							<meshBasicMaterial color={node.color} transparent opacity={0.3} />
						</Sphere>
					</group>
				);
			})}
		</group>
	);
};

const TransformationFrames: React.FC = () => {
	const frame = useCurrentFrame();
	
	const transformations = [
		{emoji: '🎓', label: 'Student Learning', color: '#3b82f6', icon: '📚'},
		{emoji: '🚀', label: 'Founder Building', color: '#10b981', icon: '💡'},
		{emoji: '🔬', label: 'Doctor Researching', color: '#8b5cf6', icon: '🧬'},
		{emoji: '🎨', label: 'Artist Creating', color: '#f59e0b', icon: '🖌️'},
	];
	
	const currentIndex = Math.floor(frame / 18) % transformations.length;
	const progress = (frame % 18) / 18;
	
	return (
		<div style={{
			position: 'absolute',
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column'
		}}>
			{transformations.map((transform, i) => {
				const isActive = i === currentIndex;
				const isNext = i === (currentIndex + 1) % transformations.length;
				const isPrev = i === (currentIndex - 1 + transformations.length) % transformations.length;
				
				let scale = 0.3;
				let opacity = 0;
				let rotate = 0;
				let translateX = 0;
				let translateY = 0;
				let morphProgress = 0;
				
				if (isActive) {
					scale = 1;
					opacity = 1;
					rotate = 0;
					morphProgress = 1;
				} else if (isNext) {
					scale = 0.3 + progress * 0.7;
					opacity = progress;
					rotate = progress * 45;
					translateX = progress * 100;
					morphProgress = progress;
				} else if (isPrev) {
					scale = 1 - progress * 0.7;
					opacity = 1 - progress;
					rotate = -progress * 45;
					translateX = -progress * 100;
					morphProgress = 1 - progress;
				}
				
				// Morphing effect between emoji and icon
				const currentEmoji = morphProgress > 0.5 ? transform.icon : transform.emoji;
				const morphScale = Math.abs(Math.sin(morphProgress * Math.PI));
				
				return (
					<div
						key={i}
						style={{
							fontSize: `${140 * scale}px`,
							opacity,
							transform: `scale(${scale}) rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`,
							position: 'absolute',
							filter: `drop-shadow(0 0 ${40 * scale}px ${transform.color}) hue-rotate(${morphProgress * 30}deg)`,
							transition: 'all 0.15s ease',
							fontWeight: 'bold'
						}}
					>
						{currentEmoji}
					</div>
				);
			})}
		</div>
	);
};

export const Scene3NeuralNetwork: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Voice text "...became millions."
	const voiceOpacity = interpolate(frame, [50, 65], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Particle dissolve transition
	const dissolveProgress = interpolate(frame, [80, 90], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Camera movement with acceleration
	const cameraZ = interpolate(frame, [0, 45, 80, 90], [10, 6, 3, 15], {
		extrapolate: 'clamp',
	});
	
	// Camera rotation for dissolve effect
	const cameraRotation = interpolate(frame, [80, 90], [0, Math.PI], {
		extrapolate: 'clamp',
	});
	
	// Neural network explosion at end
	const explosionScale = interpolate(frame, [75, 90], [1, 3], {
		extrapolate: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Canvas 
				camera={{position: [0, 0, cameraZ], fov: 85, rotation: [0, cameraRotation, 0]}}
				style={{
					filter: `brightness(${1 + dissolveProgress}) contrast(${1 + dissolveProgress * 0.5})`
				}}
			>
				<NeuralNetwork explosionScale={explosionScale} />
			</Canvas>
			
			<TransformationFrames />
			
			{frame >= 50 && (
				<div style={{
					position: 'absolute',
					bottom: '20%',
					left: '50%',
					transform: 'translateX(-50%)',
					fontFamily: 'Arial, sans-serif',
					fontSize: '42px',
					color: '#fff',
					opacity: voiceOpacity,
					textAlign: 'center',
					fontWeight: 'bold',
					textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
				}}>
					...became millions.
				</div>
			)}
			
			{/* Particle dissolve effect */}
			{frame >= 80 && (
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: `radial-gradient(circle at center, 
						transparent 0%, 
						rgba(59, 130, 246, ${dissolveProgress * 0.4}) 40%, 
						rgba(0, 0, 0, ${dissolveProgress * 0.9}) 100%)`,
					pointerEvents: 'none',
					opacity: dissolveProgress
				}} />
			)}
		</AbsoluteFill>
	);
};