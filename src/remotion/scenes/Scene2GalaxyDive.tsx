import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';
import {Canvas, useFrame} from '@react-three/fiber';
import {Points, PointMaterial, Stars, Sphere} from '@react-three/drei';
import * as THREE from 'three';
import {useState, useRef} from 'react';

const GalaxyField: React.FC<{neuralFormation?: number}> = ({neuralFormation = 0}) => {
	const galaxyRef = useRef<THREE.Points>(null);
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();
	
	// Generate spiral galaxy
	const [galaxyGeometry] = useState(() => {
		const geometry = new THREE.BufferGeometry();
		const count = 20000;
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		
		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const radius = Math.random() * 10;
			const spinAngle = radius * 0.5;
			const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
			
			const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
			const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
			const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
			
			positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
			positions[i3 + 1] = randomY;
			positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
			
			// Color gradient from center to edge
			const mixedColor = new THREE.Color();
			mixedColor.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
			
			colors[i3] = mixedColor.r;
			colors[i3 + 1] = mixedColor.g;
			colors[i3 + 2] = mixedColor.b;
		}
		
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		
		return geometry;
	});
	
	useFrame(() => {
		if (galaxyRef.current) {
			galaxyRef.current.rotation.y += 0.002 + (neuralFormation * 0.01);
			galaxyRef.current.rotation.x += 0.001 + (neuralFormation * 0.005);
		}
	});
	
	return (
		<group>
			<Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
			<Points ref={galaxyRef} geometry={galaxyGeometry}>
				<PointMaterial
					transparent
					vertexColors
					size={0.03}
					sizeAttenuation={true}
					depthWrite={false}
					opacity={0.8}
				/>
			</Points>
		</group>
	);
};

const CodeRiver: React.FC<{warpSpeed?: number}> = ({warpSpeed = 0}) => {
	const frame = useCurrentFrame();
	const codeSymbols = ['</>', '{}', '[]', '()', '∑', '∫', 'π', '∞', '♪', '♫', '√', '≈', '≠', '≤', '≥'];
	
	return (
		<div style={{
			position: 'absolute',
			width: '100%',
			height: '100%',
			overflow: 'hidden',
			opacity: interpolate(frame, [20, 35], [0, 1], {extrapolate: 'clamp'}),
			filter: `blur(${warpSpeed * 5}px) hue-rotate(${warpSpeed * 180}deg)`
		}}>
			{Array.from({length: 80}).map((_, i) => {
				const delay = i * 1.5;
				const x = (i / 80) * 100;
				const y = interpolate(frame - delay, [0, 40], [120, -30], {extrapolate: 'clamp'});
				const symbol = codeSymbols[i % codeSymbols.length];
				const scale = interpolate(frame - delay, [0, 10, 30], [0, 1, 0.5], {extrapolate: 'clamp'});
				const stretch = 1 + warpSpeed * 2;
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							fontFamily: 'Courier New, monospace',
							fontSize: `${28 * scale}px`,
							color: `hsl(${(i * 15 + frame) % 360}, 80%, 70%)`,
							opacity: interpolate(frame - delay, [0, 8, 25, 40], [0, 1, 1, 0], {extrapolate: 'clamp'}),
							textShadow: `0 0 ${10 * scale}px hsl(${(i * 15 + frame) % 360}, 80%, 50%)`,
							transform: `scale(${scale * stretch}) rotate(${Math.sin(frame * 0.1 + i) * 10}deg) skewX(${warpSpeed * 30}deg)`
						}}
					>
						{symbol}
					</div>
				);
			})}
		</div>
	);
};

export const Scene2GalaxyDive: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Infinite zoom effect - exponential zoom
	const cameraZ = interpolate(frame, [0, 30, 60, 90], [15, 8, 3, -10], {
		extrapolate: 'clamp',
	});
	
	// Camera rotation for spiral effect
	const cameraRotation = interpolate(frame, [0, 90], [0, Math.PI * 2], {
		extrapolate: 'clamp',
	});
	
	// Camera FOV for dramatic effect
	const cameraFov = interpolate(frame, [0, 45, 90], [90, 120, 150], {
		extrapolate: 'clamp',
	});
	
	// Voice text "One idea..."
	const voiceOpacity = interpolate(frame, [40, 55], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Neural network formation effect
	const neuralFormation = interpolate(frame, [60, 90], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Warp speed effect at end
	const warpSpeed = interpolate(frame, [75, 90], [0, 1], {
		extrapolate: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Canvas 
				camera={{position: [0, 0, cameraZ], fov: cameraFov, rotation: [0, cameraRotation, 0]}}
				style={{
					filter: `brightness(${1 + warpSpeed * 2}) saturate(${1 + warpSpeed})`
				}}
			>
				<GalaxyField neuralFormation={neuralFormation} />
			</Canvas>
			
			<CodeRiver warpSpeed={warpSpeed} />
			
			{frame >= 40 && (
				<div style={{
					position: 'absolute',
					bottom: '25%',
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
					One idea...
				</div>
			)}
			
			{/* Warp tunnel effect */}
			{frame >= 75 && (
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: `radial-gradient(circle at center, 
						transparent 0%, 
						rgba(139, 92, 246, ${warpSpeed * 0.5}) 30%, 
						rgba(0, 0, 0, ${warpSpeed * 0.9}) 100%)`,
					pointerEvents: 'none',
					opacity: warpSpeed
				}} />
			)}
		</AbsoluteFill>
	);
};