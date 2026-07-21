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
export const devinHyperMotionVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof devinHyperMotionVideoSchema>;

// Hyper-speed particle effect
const HyperParticle: React.FC<{
	delay: number;
	duration: number;
	x: number;
	y: number;
	size: number;
	color: string;
	speed: number;
}> = ({ delay, duration, x, y, size, color, speed }) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const progress = (frame - delay) / duration;
	const clampedProgress = Math.max(0, Math.min(1, progress));
	
	const opacity = interpolate(clampedProgress, [0, 0.1, 0.7, 1], [0, 1, 1, 0]);
	const scale = interpolate(clampedProgress, [0, 0.3, 1], [0, 1.5, 0]);
	const moveX = interpolate(clampedProgress, [0, 1], [0, (Math.random() - 0.5) * speed]);
	const moveY = interpolate(clampedProgress, [0, 1], [0, (Math.random() - 0.5) * speed]);
	const rotation = interpolate(clampedProgress, [0, 1], [0, Math.random() * 360]);
	
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
				transform: `scale(${scale}) rotate(${rotation}deg)`,
				filter: 'blur(0.5px)',
				boxShadow: `0 0 ${size * 3}px ${color}`,
			}}
		/>
	);
};

// Scene 1: Hyper-intro with rapid text reveals (0-5s)
const Scene1HyperIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const textScale = spring({
		frame,
		fps,
		config: {
			damping: 50,
			stiffness: 200,
			mass: 0.3,
		},
	});
	
	const textOpacity = spring({
		frame,
		fps,
		config: {
			damping: 30,
			stiffness: 150,
		},
	});
	
	const zoom = interpolate(frame, [0, 150], [1, 1.2], {
		extrapolateRight: 'clamp',
	});
	
	const rotation = interpolate(frame, [0, 150], [0, 5], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Hyper-speed particles */}
			{[...Array(100)].map((_, i) => (
				<HyperParticle
					key={i}
					delay={i * 0.3}
					duration={150}
					x={Math.random() * 100}
					y={Math.random() * 100}
					size={Math.random() * 6 + 2}
					color={`rgba(${100 + Math.random() * 100}, ${150 + Math.random() * 100}, 255, ${0.5 + Math.random() * 0.5})`}
					speed={800}
				/>
			))}
			
			{/* Dynamic background gradients */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: `
					radial-gradient(circle at ${50 + Math.sin(frame * 0.05) * 20}% ${50 + Math.cos(frame * 0.05) * 20}%, rgba(150, 130, 255, 0.15) 0%, transparent 40%),
					radial-gradient(circle at ${50 - Math.sin(frame * 0.03) * 30}% ${50 + Math.cos(frame * 0.04) * 25}%, rgba(100, 200, 255, 0.1) 0%, transparent 35%)
				`,
				transform: `scale(${zoom}) rotate(${rotation}deg)`,
			}} />
			
			{/* Main text with hyper motion */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${textScale})`,
				textAlign: 'center',
				opacity: textOpacity,
			}}>
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '140px',
					fontWeight: 800,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '-4px',
					textShadow: '0 0 80px rgba(150, 130, 255, 0.8), 0 0 120px rgba(100, 200, 255, 0.6)',
					animation: 'glow 0.5s ease-in-out infinite alternate',
				}}>
					DEVIN
				</h1>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '42px',
					fontWeight: 600,
					color: 'rgba(255, 255, 255, 0.9)',
					margin: '24px 0 0 0',
					letterSpacing: '8px',
					textTransform: 'uppercase',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.6)',
				}}>
					AI Software Engineer
				</p>
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

// Scene 2: Rapid capability showcase (5-10s)
const Scene2Capabilities: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 40,
			stiffness: 180,
		},
	});
	
	const capabilities = [
		{ icon: '⚡', label: 'Builds Code', color: '#64ffda' },
		{ icon: '🔧', label: 'Fixes Bugs', color: '#f9a8d4' },
		{ icon: '🚀', label: 'Deploys Apps', color: '#64b5ff' },
		{ icon: '🧠', label: 'Thinks Fast', color: '#a78bfa' },
		{ icon: '🎯', label: 'Hits Goals', color: '#34d399' },
		{ icon: '💡', label: 'Solves Problems', color: '#fbbf24' },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Dynamic grid background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				backgroundImage: `
					linear-gradient(rgba(100, 150, 255, 0.05) 1px, transparent 1px),
					linear-gradient(90deg, rgba(100, 150, 255, 0.05) 1px, transparent 1px)
				`,
				backgroundSize: '30px 30px',
				animation: 'gridMove 2s linear infinite',
			}} />
			
			{/* Hyper-speed capability cards */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '24px',
				opacity,
			}}>
				{capabilities.map((cap, index) => {
					const cardDelay = index * 15;
					const cardScale = spring({
						frame: frame - cardDelay,
						fps,
						config: {
							damping: 30,
							stiffness: 200,
							mass: 0.4,
						},
					});
					
					const cardOpacity = spring({
						frame: frame - cardDelay,
						fps,
						config: {
							damping: 40,
							stiffness: 150,
						},
					});
					
					const cardRotate = interpolate(frame - cardDelay, [0, 30], [15, 0], {
						extrapolateRight: 'clamp',
					});
					
					if (frame < cardDelay) return null;
					
					return (
						<div
							key={index}
							style={{
								background: 'rgba(255, 255, 255, 0.08)',
								border: `2px solid ${cap.color}`,
								borderRadius: '20px',
								padding: '28px',
								backdropFilter: 'blur(15px)',
								opacity: cardOpacity,
								transform: `scale(${cardScale}) rotate(${cardRotate}deg)`,
								boxShadow: `0 0 40px ${cap.color}40`,
								transition: 'all 0.3s ease',
							}}
						>
							<div style={{
								fontSize: '52px',
								marginBottom: '16px',
								filter: `drop-shadow(0 0 20px ${cap.color})`,
							}}>
								{cap.icon}
							</div>
							<div style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '22px',
								fontWeight: 700,
								color: '#ffffff',
								textShadow: `0 0 20px ${cap.color}`,
							}}>
								{cap.label}
							</div>
						</div>
					);
				})}
			</div>
			
			{/* Center text */}
			<div style={{
				position: 'absolute',
				bottom: '140px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '56px',
					fontWeight: 800,
					color: '#ffffff',
					margin: 0,
					textShadow: '0 0 60px rgba(150, 130, 255, 0.8)',
					letterSpacing: '-1px',
				}}>
					Supercharged Development
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

// Scene 3: Hyper-speed workflow (10-15s)
const Scene3Workflow: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 40,
			stiffness: 180,
		},
	});
	
	const workflowSteps = [
		{ step: '1', label: 'Describe', desc: 'Tell Devin what to build' },
		{ step: '2', label: 'Create', desc: 'Watch code appear instantly' },
		{ step: '3', label: 'Ship', desc: 'Deploy to production' },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Flowing energy lines */}
			{[...Array(10)].map((_, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${i * 10}%`,
						top: `${interpolate(frame, [0, 150], [0, 100], {extrapolateRight: 'clamp'})}%`,
						width: '3px',
						height: '100%',
						background: `linear-gradient(180deg, transparent, rgba(150, 130, 255, 0.6), transparent)`,
						opacity: 0.4,
						animation: `flow ${1 + i * 0.2}s linear infinite`,
					}}
				/>
			))}
			
			{/* Workflow steps */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'flex',
				gap: '48px',
				opacity,
			}}>
				{workflowSteps.map((item, index) => {
					const stepDelay = index * 25;
					const stepScale = spring({
						frame: frame - stepDelay,
						fps,
						config: {
							damping: 30,
							stiffness: 200,
							mass: 0.3,
						},
					});
					
					const stepOpacity = spring({
						frame: frame - stepDelay,
						fps,
						config: {
							damping: 40,
							stiffness: 150,
						},
					});
					
					if (frame < stepDelay) return null;
					
					return (
						<div
							key={index}
							style={{
								textAlign: 'center',
								opacity: stepOpacity,
								transform: `scale(${stepScale})`,
							}}
						>
							<div style={{
								width: '100px',
								height: '100px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '24px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '48px',
								fontWeight: 800,
								color: '#ffffff',
								margin: '0 auto 20px',
								boxShadow: '0 0 50px rgba(150, 130, 255, 0.6)',
							}}>
								{item.step}
							</div>
							<h3 style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '32px',
								fontWeight: 700,
								color: '#ffffff',
								margin: '0 0 8px 0',
								textShadow: '0 0 30px rgba(150, 130, 255, 0.6)',
							}}>
								{item.label}
							</h3>
							<p style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '18px',
								fontWeight: 400,
								color: 'rgba(255, 255, 255, 0.7)',
								margin: 0,
							}}>
								{item.desc}
							</p>
						</div>
					);
				})}
			</div>
			
			{/* Arrow indicators */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'flex',
				gap: '100px',
				opacity,
				pointerEvents: 'none',
			}}>
				<div style={{
					fontSize: '48px',
					color: 'rgba(150, 130, 255, 0.8)',
					animation: 'pulse 1s ease-in-out infinite',
				}}>
					→
				</div>
				<div style={{
					fontSize: '48px',
					color: 'rgba(150, 130, 255, 0.8)',
					animation: 'pulse 1s ease-in-out infinite 0.5s',
				}}>
					→
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

// Scene 4: Epic finale with CTA (15-20s)
const Scene4Finale: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 40,
			stiffness: 180,
		},
	});
	
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 30,
			stiffness: 150,
			mass: 0.5,
		},
	});
	
	const glowIntensity = interpolate(frame, [0, 90], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const textFade = spring({
		frame: frame - 45,
		fps,
		config: {
			damping: 40,
			stiffness: 150,
		},
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Epic particle explosion */}
			{[...Array(150)].map((_, i) => {
				const angle = (i / 150) * Math.PI * 2;
				const distance = interpolate(frame, [0, 90], [50, 400], {
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
							width: `${Math.random() * 4 + 2}px`,
							height: `${Math.random() * 4 + 2}px`,
							background: `rgba(150, 130, 255, ${0.5 + Math.random() * 0.5})`,
							borderRadius: '50%',
							filter: 'blur(1px)',
							boxShadow: `0 0 ${10 * glowIntensity}px rgba(150, 130, 255, 0.8)`,
						}}
					/>
				);
			})}
			
			{/* Central glow */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: `${300 + glowIntensity * 200}px`,
				height: `${300 + glowIntensity * 200}px`,
				background: `radial-gradient(circle, rgba(150, 130, 255, ${0.2 + glowIntensity * 0.3}) 0%, transparent 70%)`,
				borderRadius: '50%',
				filter: 'blur(30px)',
			}} />
			
			{/* Logo and CTA */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				textAlign: 'center',
				opacity,
			}}>
				{/* Devin logo */}
				<div style={{
					width: '200px',
					height: '200px',
					margin: '0 auto 32px',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '48px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '90px',
					fontWeight: 800,
					color: '#ffffff',
					boxShadow: `0 0 ${100 * glowIntensity}px rgba(150, 130, 255, ${0.8 * glowIntensity})`,
					position: 'relative',
				}}>
					D
					{/* Glow effect */}
					<div style={{
						position: 'absolute',
						top: '-30px',
						left: '-30px',
						right: '-30px',
						bottom: '-30px',
						background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))',
						borderRadius: '64px',
						filter: 'blur(40px)',
						zIndex: -1,
					}} />
				</div>
				
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '68px',
					fontWeight: 800,
					color: '#ffffff',
					margin: '0 0 16px 0',
					letterSpacing: '-2px',
					textShadow: '0 0 60px rgba(150, 130, 255, 0.8)',
				}}>
					Build Faster
				</h1>
				
				{/* CTA text */}
				<div style={{
					marginTop: '24px',
					opacity: textFade,
				}}>
					<p style={{
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '36px',
						fontWeight: 600,
						color: 'rgba(255, 255, 255, 0.95)',
						margin: '0 0 12px 0',
						letterSpacing: '2px',
						textTransform: 'uppercase',
						textShadow: '0 0 40px rgba(150, 130, 255, 0.6)',
					}}>
						Your AI Engineering Partner
					</p>
					<p style={{
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '24px',
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.7)',
						margin: 0,
						letterSpacing: '4px',
					}}>
						Let's build something amazing
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
export const DevinHyperMotionVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Scene 1: 0-5 seconds (0-150 frames) */}
			<Sequence from={0} durationInFrames={150}>
				<Scene1HyperIntro />
			</Sequence>
			
			{/* Scene 2: 5-10 seconds (150-300 frames) */}
			<Sequence from={150} durationInFrames={150}>
				<Scene2Capabilities />
			</Sequence>
			
			{/* Scene 3: 10-15 seconds (300-450 frames) */}
			<Sequence from={300} durationInFrames={150}>
				<Scene3Workflow />
			</Sequence>
			
			{/* Scene 4: 15-20 seconds (450-600 frames) */}
			<Sequence from={450} durationInFrames={150}>
				<Scene4Finale />
			</Sequence>
		</AbsoluteFill>
	);
};
