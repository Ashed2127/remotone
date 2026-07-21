import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
} from 'remotion';
import {z} from 'zod';
import './styles.css';

// Schema for props
export const auraMotionVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof auraMotionVideoSchema>;

// Particle component for cinematic effects
const Particle: React.FC<{
	delay: number;
	duration: number;
	x: number;
	y: number;
	size: number;
	color: string;
}> = ({ delay, duration, x, y, size, color }) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const progress = (frame - delay) / duration;
	const clampedProgress = Math.max(0, Math.min(1, progress));
	
	const opacity = interpolate(clampedProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
	const scale = interpolate(clampedProgress, [0, 0.5, 1], [0, 1, 0.5]);
	const moveX = interpolate(clampedProgress, [0, 1], [0, (Math.random() - 0.5) * 200]);
	const moveY = interpolate(clampedProgress, [0, 1], [0, (Math.random() - 0.5) * 200]);
	
	if (frame < delay || frame > delay + duration) return null;
	
	return (
		<div
			style={{
				position: 'absolute',
				left: `${x + moveX}%`,
				top: `${y + moveY}%`,
				width: `${size}px`,
				height: `${size}px`,
				background: color,
				borderRadius: '50%',
				opacity,
				transform: `scale(${scale})`,
				filter: 'blur(1px)',
				boxShadow: `0 0 ${size * 2}px ${color}`,
			}}
		/>
	);
};

// Scene 1: Birth of technology (0-3s)
const Scene1Birth: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const textOpacity = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
			mass: 0.5,
		},
	});
	
	const particleCount = Math.floor(interpolate(frame, [0, 90], [1, 150], {
		extrapolateRight: 'clamp',
	}));
	
	const pulseIntensity = interpolate(
		frame,
		[0, 45, 90],
		[0, 1, 0.5],
		{extrapolateRight: 'clamp'}
	);
	
	return (
		<AbsoluteFill style={{
			background: '#000000',
		}}>
			{/* Cinematic particle universe */}
			{[...Array(150)].map((_, i) => (
				<Particle
					key={i}
					delay={i * 0.5}
					duration={90}
					x={Math.random() * 100}
					y={Math.random() * 100}
					size={Math.random() * 3 + 1}
					color={`rgba(${100 + Math.random() * 100}, ${150 + Math.random() * 100}, 255, ${0.3 + Math.random() * 0.4})`}
				/>
			))}
			
			{/* Central glowing core */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: `${200 + pulseIntensity * 100}px`,
				height: `${200 + pulseIntensity * 100}px`,
				background: `radial-gradient(circle, rgba(150, 130, 255, ${0.2 + pulseIntensity * 0.3}) 0%, transparent 70%)`,
				borderRadius: '50%',
				filter: 'blur(20px)',
			}} />
			
			{/* Particle connections effect */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: `
					radial-gradient(circle at 50% 50%, rgba(150, 130, 255, 0.1) 0%, transparent 30%),
					radial-gradient(circle at 30% 40%, rgba(100, 200, 255, 0.05) 0%, transparent 25%),
					radial-gradient(circle at 70% 60%, rgba(200, 100, 255, 0.05) 0%, transparent 25%)
				`,
				animation: 'pulse 2s ease-in-out infinite',
			}} />
			
			{/* Text overlay */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				textAlign: 'center',
				opacity: textOpacity,
			}}>
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '64px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '4px',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.5)',
					lineHeight: 1.4,
				}}>
					Every idea starts
				</h1>
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '64px',
					fontWeight: 300,
					color: '#ffffff',
					margin: '16px 0 0 0',
					letterSpacing: '4px',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.5)',
					lineHeight: 1.4,
				}}>
					as a thought.
				</h1>
			</div>
			
			{/* Cinematic bars */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
			<div style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
		</AbsoluteFill>
	);
};

// Scene 2: Digital transformation (3-7s)
const Scene2Transform: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});
	
	const morphProgress = interpolate(frame, [0, 120], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const textOpacity = spring({
		frame: frame - 30,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Flowing code patterns */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				opacity: 0.3,
				background: `
					repeating-linear-gradient(
						0deg,
						transparent,
						transparent 2px,
						rgba(100, 200, 255, 0.03) 2px,
						rgba(100, 200, 255, 0.03) 4px
					)
				`,
				animation: 'matrix 20s linear infinite',
			}} />
			
			{/* Neural network visualization */}
			{[...Array(30)].map((_, i) => {
				const angle = (i / 30) * Math.PI * 2;
				const radius = 200 + morphProgress * 100;
				const x = 50 + Math.cos(angle) * (radius / 10);
				const y = 50 + Math.sin(angle) * (radius / 10);
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							width: '8px',
							height: '8px',
							background: `rgba(150, 130, 255, ${0.5 + morphProgress * 0.3})`,
							borderRadius: '50%',
							filter: 'blur(2px)',
							boxShadow: `0 0 20px rgba(150, 130, 255, 0.5)`,
							transform: `scale(${1 + morphProgress * 0.5})`,
						}}
					/>
				);
			})}
			
			{/* Flowing data streams */}
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${20 + i * 15}%`,
						top: `${interpolate(frame, [0, 120], [100, 0], {extrapolateRight: 'clamp'})}%`,
						width: '2px',
						height: '100%',
						background: `linear-gradient(180deg, transparent, rgba(100, 200, 255, 0.5), transparent)`,
						opacity: 0.5,
						animation: `flow ${3 + i * 0.5}s ease-in-out infinite`,
					}}
				/>
			))}
			
			{/* UI elements forming */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${0.5 + morphProgress * 0.5})`,
				opacity,
				width: '400px',
				height: '300px',
				border: '1px solid rgba(150, 130, 255, 0.3)',
				borderRadius: '16px',
				background: 'rgba(20, 20, 30, 0.8)',
				backdropFilter: 'blur(10px)',
				boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
			}}>
				{/* UI header */}
				<div style={{
					height: '40px',
					background: 'rgba(150, 130, 255, 0.1)',
					borderBottom: '1px solid rgba(150, 130, 255, 0.2)',
					borderRadius: '16px 16px 0 0',
					display: 'flex',
					alignItems: 'center',
					padding: '0 16px',
					gap: '8px',
				}}>
					<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57'}} />
					<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e'}} />
					<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#28c840'}} />
				</div>
				
				{/* UI content */}
				<div style={{
					padding: '24px',
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
				}}>
					<div style={{
						height: '8px',
						background: 'rgba(150, 130, 255, 0.3)',
						borderRadius: '4px',
						width: `${60 + morphProgress * 40}%`,
					}} />
					<div style={{
						height: '8px',
						background: 'rgba(100, 200, 255, 0.3)',
						borderRadius: '4px',
						width: `${80 + morphProgress * 20}%`,
					}} />
					<div style={{
						height: '8px',
						background: 'rgba(200, 100, 255, 0.3)',
						borderRadius: '4px',
						width: `${50 + morphProgress * 30}%`,
					}} />
				</div>
			</div>
			
			{/* Text overlay */}
			<div style={{
				position: 'absolute',
				bottom: '150px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity: textOpacity,
			}}>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '2px',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.5)',
					lineHeight: 1.4,
				}}>
					But imagination needs
				</h2>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 300,
					color: '#ffffff',
					margin: '16px 0 0 0',
					letterSpacing: '2px',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.5)',
					lineHeight: 1.4,
				}}>
					a way to become reality.
				</h2>
			</div>
			
			{/* Cinematic bars */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
			<div style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
		</AbsoluteFill>
	);
};

// Scene 3: Acceleration and creation (7-11s)
const Scene3Acceleration: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});
	
	const acceleration = interpolate(frame, [0, 120], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const zoom = interpolate(frame, [0, 120], [1, 1.3], {
		extrapolateRight: 'clamp',
	});
	
	const creations = [
		{ icon: '🎬', label: 'Cinematic Videos', delay: 0 },
		{ icon: '🎯', label: 'Product Animations', delay: 20 },
		{ icon: '🚀', label: 'Interactive Experiences', delay: 40 },
		{ icon: '✨', label: 'Motion Graphics', delay: 60 },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Dynamic background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: `
					radial-gradient(circle at 50% 50%, rgba(150, 130, 255, ${0.1 + acceleration * 0.2}) 0%, transparent 50%),
					radial-gradient(circle at 30% 70%, rgba(100, 200, 255, ${0.05 + acceleration * 0.1}) 0%, transparent 40%),
					radial-gradient(circle at 70% 30%, rgba(200, 100, 255, ${0.05 + acceleration * 0.1}) 0%, transparent 40%)
				`,
				transform: `scale(${zoom})`,
			}} />
			
			{/* Fast-moving particles */}
			{[...Array(50)].map((_, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						width: `${Math.random() * 4 + 2}px`,
						height: `${Math.random() * 4 + 2}px`,
						background: `rgba(150, 130, 255, ${0.3 + Math.random() * 0.4})`,
						borderRadius: '50%',
						filter: 'blur(1px)',
						transform: `translateX(${interpolate(frame, [0, 120], [0, (Math.random() - 0.5) * 500], {extrapolateRight: 'clamp'})}px)`,
					}}
				/>
			))}
			
			{/* Creation cards */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '32px',
				opacity,
			}}>
				{creations.map((creation, index) => {
					const cardDelay = creation.delay;
					const cardOpacity = spring({
						frame: frame - cardDelay,
						fps,
						config: {
							damping: 200,
							stiffness: 100,
						},
					});
					
					const cardScale = spring({
						frame: frame - cardDelay,
						fps,
						config: {
							damping: 200,
							stiffness: 80,
						},
					});
					
					if (frame < cardDelay) return null;
					
					return (
						<div
							key={index}
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								borderRadius: '16px',
								padding: '24px',
								backdropFilter: 'blur(10px)',
								opacity: cardOpacity,
								transform: `scale(${cardScale})`,
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
							}}
						>
							<div style={{
								fontSize: '36px',
								marginBottom: '12px',
							}}>
								{creation.icon}
							</div>
							<div style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '18px',
								fontWeight: 500,
								color: '#ffffff',
							}}>
								{creation.label}
							</div>
						</div>
					);
				})}
			</div>
			
			{/* Text overlay */}
			<div style={{
				position: 'absolute',
				bottom: '120px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '52px',
					fontWeight: 600,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '1px',
					textShadow: '0 0 60px rgba(150, 130, 255, 0.5)',
				}}>
					We turn ideas into experiences.
				</h2>
			</div>
			
			{/* Cinematic bars */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
			<div style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
		</AbsoluteFill>
	);
};

// Scene 4: Final hero reveal (11-15s)
const Scene4Hero: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});
	
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 60,
			mass: 1,
		},
	});
	
	const glowIntensity = interpolate(frame, [0, 60], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const textFade = spring({
		frame: frame - 60,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Epic background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: `
					radial-gradient(circle at 50% 50%, rgba(150, 130, 255, ${0.15 + glowIntensity * 0.2}) 0%, transparent 50%),
					radial-gradient(circle at 30% 70%, rgba(100, 200, 255, ${0.1 + glowIntensity * 0.15}) 0%, transparent 40%),
					radial-gradient(circle at 70% 30%, rgba(200, 100, 255, ${0.1 + glowIntensity * 0.15}) 0%, transparent 40%)
				`,
			}} />
			
			{/* Converging particles */}
			{[...Array(100)].map((_, i) => {
				const angle = (i / 100) * Math.PI * 2;
				const distance = interpolate(frame, [0, 60], [300, 50], {
					extrapolateRight: 'clamp',
				});
				const x = 50 + Math.cos(angle) * (distance / 10);
				const y = 50 + Math.sin(angle) * (distance / 10);
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							width: '4px',
							height: '4px',
							background: `rgba(150, 130, 255, ${0.5 + glowIntensity * 0.3})`,
							borderRadius: '50%',
							filter: 'blur(1px)',
							boxShadow: `0 0 10px rgba(150, 130, 255, 0.5)`,
						}}
					/>
				);
			})}
			
			{/* Logo and text */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				textAlign: 'center',
				opacity,
			}}>
				{/* AuraMotion logo */}
				<div style={{
					width: '180px',
					height: '180px',
					margin: '0 auto 32px',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '40px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '72px',
					fontWeight: 700,
					color: '#ffffff',
					boxShadow: `0 0 ${80 * glowIntensity}px rgba(150, 130, 255, ${0.6 * glowIntensity})`,
					position: 'relative',
				}}>
					A
					{/* Glow effect */}
					<div style={{
						position: 'absolute',
						top: '-30px',
						left: '-30px',
						right: '-30px',
						bottom: '-30px',
						background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4))',
						borderRadius: '56px',
						filter: 'blur(30px)',
						zIndex: -1,
					}} />
				</div>
				
				{/* Main text */}
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '72px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '-1px',
					textShadow: '0 0 60px rgba(150, 130, 255, 0.5)',
				}}>
					AuraMotion
				</h1>
				
				{/* Tagline */}
				<div style={{
					marginTop: '24px',
					opacity: textFade,
				}}>
					<p style={{
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '32px',
						fontWeight: 300,
						color: 'rgba(255, 255, 255, 0.9)',
						margin: 0,
						letterSpacing: '4px',
						textTransform: 'uppercase',
					}}>
						A new way to create.
					</p>
					<p style={{
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '24px',
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.7)',
						margin: '16px 0 0 0',
						letterSpacing: '2px',
					}}>
						Create. Animate. Inspire.
					</p>
				</div>
			</div>
			
			{/* Cinematic bars */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
			<div style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: '60px',
				background: '#000',
			}} />
		</AbsoluteFill>
	);
};

// Main Component
export const AuraMotionVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Scene 1: 0-3 seconds (0-90 frames) */}
			<Sequence from={0} durationInFrames={90}>
				<Scene1Birth />
			</Sequence>
			
			{/* Scene 2: 3-7 seconds (90-210 frames) */}
			<Sequence from={90} durationInFrames={120}>
				<Scene2Transform />
			</Sequence>
			
			{/* Scene 3: 7-11 seconds (210-330 frames) */}
			<Sequence from={210} durationInFrames={120}>
				<Scene3Acceleration />
			</Sequence>
			
			{/* Scene 4: 11-15 seconds (330-450 frames) */}
			<Sequence from={330} durationInFrames={120}>
				<Scene4Hero />
			</Sequence>
		</AbsoluteFill>
	);
};