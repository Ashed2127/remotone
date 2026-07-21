import {useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring} from 'remotion';
import {useState, useEffect} from 'react';

const GlitchText: React.FC<{text: string; frame: number}> = ({text, frame}) => {
	const [displayText, setDisplayText] = useState(text);
	const [glitchOffset, setGlitchOffset] = useState({x: 0, y: 0});
	
	useEffect(() => {
		if (frame % 2 === 0) {
			const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
			const glitched = text.split('').map(char => 
				Math.random() > 0.8 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
			).join('');
			setDisplayText(glitched);
			setGlitchOffset({
				x: (Math.random() - 0.5) * 10,
				y: (Math.random() - 0.5) * 5
			});
		} else {
			setDisplayText(text);
			setGlitchOffset({x: 0, y: 0});
		}
	}, [frame, text]);
	
	return (
		<span style={{
			fontFamily: 'Courier New, monospace',
			fontSize: '52px',
			color: '#fff',
			textShadow: `
				${glitchOffset.x}px ${glitchOffset.y}px 0 #ff0000,
				${-glitchOffset.x}px ${-glitchOffset.y}px 0 #00ffff,
				0 0 20px rgba(255, 255, 255, 0.5)
			`,
			transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
			fontWeight: 'bold'
		}}>
			{displayText}
		</span>
	);
};

const UserQuestions: React.FC<{vortexIntensity?: number}> = ({vortexIntensity = 0}) => {
	const frame = useCurrentFrame();
	const questions = [
		'Help me learn.',
		'Help me build.',
		'Help me create.',
		'Help me solve.',
		'Help me understand.',
		'Help me grow.',
		'Help me innovate.',
		'Help me discover.',
		'Help me dream.',
		'Help me achieve.',
	];
	
	return (
		<div style={{
			position: 'absolute',
			width: '100%',
			height: '100%',
			overflow: 'hidden',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '15px',
			filter: `blur(${vortexIntensity * 3}px) hue-rotate(${vortexIntensity * 120}deg)`,
			transform: `scale(${1 + vortexIntensity * 0.5}) rotate(${vortexIntensity * 15}deg)`
		}}>
			{questions.map((question, i) => {
				const delay = i * 12;
				const opacity = interpolate(frame - delay, [0, 12, 28], [0, 1, 0], {
					extrapolate: 'clamp',
				});
				const scale = interpolate(frame - delay, [0, 12], [0.3, 1], {
					extrapolate: 'clamp',
				});
				const y = interpolate(frame - delay, [0, 28], [120, -120], {
					extrapolate: 'clamp',
				});
				const rotate = interpolate(frame - delay, [0, 28], [Math.random() * 20 - 10, Math.random() * 20 - 10], {
					extrapolate: 'clamp',
				});
				const hue = (i * 30 + frame * 2) % 360;
				
				return (
					<div
						key={i}
						style={{
							fontFamily: 'Arial, sans-serif',
							fontSize: '36px',
							color: `hsl(${hue}, 80%, 70%)`,
							opacity,
							transform: `scale(${scale}) translateY(${y}%) rotate(${rotate}deg)`,
							position: 'absolute',
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

export const Scene5TextGlitch: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// "If we disappear today..." text
	const mainTextOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolate: 'clamp',
	});
	
	const mainTextGlitch = interpolate(frame, [25, 45], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Voice text "Who answers tomorrow?"
	const voiceOpacity = interpolate(frame, [100, 115], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Dramatic collapse transition
	const collapseProgress = interpolate(frame, [115, 120], [0, 1], {
		extrapolate: 'clamp',
	});
	
	// Vortex effect during collapse
	const vortexIntensity = interpolate(frame, [110, 120], [0, 1], {
		extrapolate: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* Main glitch text */}
			{frame < 50 && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: mainTextOpacity
				}}>
					{frame < 25 ? (
						<div style={{
							fontFamily: 'Arial, sans-serif',
							fontSize: '52px',
							color: '#fff',
							fontWeight: 'bold',
							textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
						}}>
							If we disappear today...
						</div>
					) : (
						<GlitchText text="If we disappear today..." frame={frame} />
					)}
				</div>
			)}
			
			{/* User questions flood */}
			{frame >= 25 && (
				<UserQuestions vortexIntensity={vortexIntensity} />
			)}
			
			{/* Voice text */}
			{frame >= 100 && (
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
					Who answers tomorrow?
				</div>
			)}
			
			{/* Vortex collapse transition */}
			{frame >= 110 && (
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: `radial-gradient(circle at center, 
						transparent 0%, 
						rgba(255, 0, 0, ${vortexIntensity * 0.3}) 30%, 
						rgba(0, 0, 0, ${collapseProgress * 0.95}) 100%)`,
					pointerEvents: 'none',
					opacity: collapseProgress,
					transform: `scale(${1 + vortexIntensity * 0.5}) rotate(${vortexIntensity * 180}deg)`
				}} />
			)}
		</AbsoluteFill>
	);
};