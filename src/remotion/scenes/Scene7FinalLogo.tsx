import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';

export const Scene7FinalLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// White flash - more dramatic
	const flashOpacity = interpolate(frame, [0, 3, 8], [1, 1, 0], {
		extrapolate: 'clamp',
	});
	
	// Logo fade in
	const logoOpacity = interpolate(frame, [5, 12], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Logo scale with bounce effect
	const logoScale = spring({
		frame: frame - 5,
		fps,
		config: {damping: 15, stiffness: 200},
	});
	
	// Tagline fade in
	const taglineOpacity = interpolate(frame, [15, 22], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Cursor blink
	const cursorOpacity = interpolate(frame, [0, 10, 20, 30], [0, 1, 0, 1], {
		extrapolate: 'clamp',
	});
	
	// Subtle pulse effect for logo
	const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* White flash */}
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: '#fff',
					opacity: flashOpacity
				}}
			/>
			
			{/* Final logo */}
			{frame >= 5 && (
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%) scale(' + (logoScale * pulse) + ')',
						opacity: logoOpacity,
						textAlign: 'center',
						fontFamily: 'Arial, sans-serif'
					}}
				>
					{/* Logo with glow effect */}
					<div style={{
						fontSize: '84px',
						fontWeight: 'bold',
						color: '#10a37f',
						marginBottom: '25px',
						textShadow: '0 0 40px rgba(16, 163, 127, 0.8), 0 0 80px rgba(16, 163, 127, 0.4)',
						letterSpacing: '4px'
					}}>
						CHATGPT
					</div>
					
					{/* Tagline */}
					<div style={{
						fontSize: '28px',
						color: '#fff',
						marginBottom: '15px',
						opacity: taglineOpacity,
						fontWeight: '300',
						letterSpacing: '2px',
						textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
					}}>
						Think Bigger. Build Faster. Create More.
					</div>
					
					{/* Cursor animation */}
					<div style={{
						fontSize: '32px',
						color: '#10a37f',
						opacity: cursorOpacity,
						textShadow: '0 0 20px rgba(16, 163, 127, 0.8)',
						marginTop: '10px'
					}}>
						_
					</div>
				</div>
			)}
			
			{/* Subtle particle effect in background */}
			{frame >= 10 && (
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					opacity: 0.3,
					background: 'radial-gradient(circle at center, rgba(16, 163, 127, 0.1) 0%, transparent 70%)'
				}} />
			)}
		</AbsoluteFill>
	);
};