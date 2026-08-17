import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
} from 'remotion';
import {z} from 'zod';
import {AudioCue} from '../components/remotion/Audio';
import './styles.css';

// Schema for props
export const devinMarketingVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof devinMarketingVideoSchema>;

// Scene 1: Intro with "Meet Devin"
const Scene1Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
			mass: 0.5,
		},
	});
	
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 80,
			mass: 0.8,
		},
	});
	
	const textY = interpolate(frame, [0, 30], [100, 0], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Particle effects background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: `
					radial-gradient(circle at 20% 50%, rgba(120, 100, 255, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 80% 50%, rgba(100, 200, 255, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 50% 80%, rgba(150, 100, 255, 0.05) 0%, transparent 50%)
				`,
				animation: 'pulse 4s ease-in-out infinite',
			}} />
			
			{/* Glowing particles */}
			{[...Array(20)].map((_, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						width: `${Math.random() * 4 + 2}px`,
						height: `${Math.random() * 4 + 2}px`,
						background: `rgba(150, 130, 255, ${Math.random() * 0.5 + 0.2})`,
						borderRadius: '50%',
						filter: 'blur(1px)',
						animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
						animationDelay: `${Math.random() * 2}s`,
					}}
				/>
			))}
			
			{/* Main text */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				textAlign: 'center',
				opacity,
			}}>
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '120px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '-2px',
					textShadow: '0 0 60px rgba(150, 130, 255, 0.5)',
					transform: `translateY(${textY}px)`,
				}}>
					Meet Devin
				</h1>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 300,
					color: 'rgba(255, 255, 255, 0.8)',
					margin: '20px 0 0 0',
					letterSpacing: '2px',
					textTransform: 'uppercase',
				}}>
					The AI Software Engineer
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

// Scene 2: AI Workspace Interface
const Scene2Workspace: React.FC = () => {
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
	
	const slideIn = interpolate(frame, [0, 30], [100, 0], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: '#0d0d12',
		}}>
			{/* IDE-like interface */}
			<div style={{
				position: 'absolute',
				top: '80px',
				left: '80px',
				right: '80px',
				bottom: '80px',
				background: 'linear-gradient(180deg, #1a1a24 0%, #12121a 100%)',
				borderRadius: '12px',
				border: '1px solid rgba(255, 255, 255, 0.1)',
				boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
				opacity,
				transform: `translateX(${slideIn}px)`,
				overflow: 'hidden',
			}}>
				{/* Window controls */}
				<div style={{
					height: '40px',
					background: 'rgba(255, 255, 255, 0.05)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
					display: 'flex',
					alignItems: 'center',
					padding: '0 16px',
					gap: '8px',
				}}>
					<div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57'}} />
					<div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e'}} />
					<div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#28c840'}} />
					<span style={{
						marginLeft: '16px',
						color: 'rgba(255, 255, 255, 0.6)',
						fontSize: '14px',
						fontFamily: 'monospace',
					}}>
						devin-ai-engineer.ts
					</span>
				</div>
				
				{/* Code content */}
				<div style={{
					padding: '24px',
					fontFamily: 'monospace',
					fontSize: '16px',
					color: '#e0e0e0',
					lineHeight: 1.6,
				}}>
					<div style={{color: '#c792ea', display: 'inline'}}>import</div>
					<div style={{color: '#82aaff', display: 'inline'}}> Devin </div>
					<div style={{color: '#c792ea', display: 'inline'}}>from</div>
					<div style={{color: '#c3e88d', display: 'inline'}}>&apos;@devin/ai&apos;</div>
					
					<div style={{marginTop: '16px'}}>
						<div style={{color: '#c792ea', display: 'inline'}}>const</div>
						<div style={{color: '#82aaff', display: 'inline'}}> engineer </div>
						<div style={{color: '#89ddff', display: 'inline'}}>=</div>
						<div style={{color: '#82aaff', display: 'inline'}}> new</div>
						<div style={{color: '#82aaff', display: 'inline'}}> Devin</div>
						<div style={{color: '#89ddff', display: 'inline'}}>(</div>
					</div>
					
					<div style={{marginLeft: '24px'}}>
						<div style={{color: '#f07178', display: 'inline'}}>autonomous</div>
						<div style={{color: '#89ddff', display: 'inline'}}>:</div>
						<div style={{color: '#ff7878', display: 'inline'}}> true</div>
						<div style={{color: '#89ddff', display: 'inline'}}>,</div>
					</div>
					
					<div style={{marginLeft: '24px'}}>
						<div style={{color: '#f07178', display: 'inline'}}>capabilities</div>
						<div style={{color: '#89ddff', display: 'inline'}}>:</div>
						<div style={{color: '#89ddff', display: 'inline'}}>[</div>
					</div>
					
					<div style={{marginLeft: '48px'}}>
						<div style={{color: '#c3e88d', display: 'inline'}}>&apos;build&apos;</div>
						<div style={{color: '#89ddff', display: 'inline'}}>,</div>
					</div>
					
					<div style={{marginLeft: '48px'}}>
						<div style={{color: '#c3e88d', display: 'inline'}}>&apos;test&apos;</div>
						<div style={{color: '#89ddff', display: 'inline'}}>,</div>
					</div>
					
					<div style={{marginLeft: '48px'}}>
						<div style={{color: '#c3e88d', display: 'inline'}}>&apos;deploy&apos;</div>
						<div style={{color: '#89ddff', display: 'inline'}}>,</div>
					</div>
					
					<div style={{marginLeft: '24px'}}>
						<div style={{color: '#89ddff', display: 'inline'}}>]</div>
						<div style={{color: '#89ddff', display: 'inline'}}>RCB</div>
						<div style={{color: '#89ddff', display: 'inline'}}>)</div>
					</div>
					
					{/* Animated typing cursor */}
					<div style={{
						display: 'inline-block',
						width: '2px',
						height: '20px',
						background: '#64ffda',
						animation: 'blink 1s step-end infinite',
						marginLeft: '4px',
					}} />
				</div>
				
				{/* Terminal panel */}
				<div style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '150px',
					background: '#0a0a0f',
					borderTop: '1px solid rgba(255, 255, 255, 0.1)',
					padding: '16px',
					fontFamily: 'monospace',
					fontSize: '14px',
				}}>
					<div style={{color: '#64ffda', marginBottom: '8px'}}>
						$ devin build --autonomous
					</div>
					<div style={{color: 'rgba(255, 255, 255, 0.7)'}}>
						Building project... <span style={{color: '#64ffda'}}>✓</span>
					</div>
					<div style={{color: 'rgba(255, 255, 255, 0.7)'}}>
						Running tests... <span style={{color: '#64ffda'}}>✓</span>
					</div>
					<div style={{color: 'rgba(255, 255, 255, 0.7)'}}>
						Deploying to production... <span style={{color: '#f9a8d4'}}>⏳</span>
					</div>
				</div>
			</div>
			
			{/* Overlay text */}
			<div style={{
				position: 'absolute',
				bottom: '150px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '42px',
					fontWeight: 600,
					color: '#ffffff',
					margin: 0,
					textShadow: '0 0 40px rgba(100, 200, 255, 0.3)',
				}}>
					From idea to production
				</h2>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '28px',
					fontWeight: 300,
					color: 'rgba(255, 255, 255, 0.7)',
					margin: '12px 0 0 0',
				}}>
					Devin builds, tests, and ships software
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 3: Multiple Development Tasks
const Scene3Tasks: React.FC = () => {
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
	
	const tasks = [
		{ icon: '⚡', label: 'Writing Code', delay: 0 },
		{ icon: '🔧', label: 'Fixing Bugs', delay: 10 },
		{ icon: '🚀', label: 'Deploying Apps', delay: 20 },
		{ icon: '📊', label: 'Analyzing Results', delay: 30 },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Grid background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				backgroundImage: `
					linear-gradient(rgba(100, 150, 255, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(100, 150, 255, 0.03) 1px, transparent 1px)
				`,
				backgroundSize: '50px 50px',
			}} />
			
			{/* Task cards */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '40px',
				opacity,
			}}>
				{tasks.map((task, index) => {
					const cardDelay = task.delay;
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
					
					return (
						<div
							key={index}
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								borderRadius: '16px',
								padding: '32px',
								backdropFilter: 'blur(10px)',
								opacity: cardOpacity,
								transform: `scale(${cardScale})`,
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
							}}
						>
							<div style={{
								fontSize: '48px',
								marginBottom: '16px',
							}}>
								{task.icon}
							</div>
							<div style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '24px',
								fontWeight: 500,
								color: '#ffffff',
							}}>
								{task.label}
							</div>
							<div style={{
								marginTop: '12px',
								height: '4px',
								background: 'rgba(100, 200, 255, 0.2)',
								borderRadius: '2px',
								overflow: 'hidden',
							}}>
								<div style={{
									width: `${interpolate(frame - cardDelay, [0, 30], [0, 100], {
										extrapolateRight: 'clamp',
									})}%`,
									height: '100%',
									background: 'linear-gradient(90deg, #64ffda, #64b5ff)',
									borderRadius: '2px',
								}} />
							</div>
						</div>
					);
				})}
			</div>
			
			{/* Center text */}
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
					fontSize: '48px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					textShadow: '0 0 60px rgba(150, 130, 255, 0.5)',
				}}>
					Your autonomous engineering partner
				</h2>
			</div>
		</AbsoluteFill>
	);
};

// Scene 4: Final Hero Shot
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
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Animated background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: `
					radial-gradient(circle at 50% 50%, rgba(150, 130, 255, ${0.1 * glowIntensity}) 0%, transparent 50%),
					radial-gradient(circle at 30% 70%, rgba(100, 200, 255, ${0.08 * glowIntensity}) 0%, transparent 40%),
					radial-gradient(circle at 70% 30%, rgba(200, 100, 255, ${0.08 * glowIntensity}) 0%, transparent 40%)
				`,
			}} />
			
			{/* Logo */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				textAlign: 'center',
				opacity,
			}}>
				{/* Devin logo representation */}
				<div style={{
					width: '200px',
					height: '200px',
					margin: '0 auto 32px',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '48px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '80px',
					fontWeight: 700,
					color: '#ffffff',
					boxShadow: `0 0 ${60 * glowIntensity}px rgba(150, 130, 255, ${0.5 * glowIntensity})`,
					position: 'relative',
				}}>
					D
					{/* Glow effect */}
					<div style={{
						position: 'absolute',
						top: '-20px',
						left: '-20px',
						right: '-20px',
						bottom: '-20px',
						background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
						borderRadius: '64px',
						filter: 'blur(20px)',
						zIndex: -1,
					}} />
				</div>
				
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '72px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '-1px',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.3)',
				}}>
					Build faster with AI
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

// Smooth transition component for crossfading between scenes
const SceneTransition: React.FC<{
	children: React.ReactNode;
	transitionType: 'fade' | 'slide' | 'zoom' | 'blur';
	fromScene?: React.ReactNode;
}> = ({ children, transitionType, fromScene }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	
	// Smooth easing function
	const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	
	// Transition timing - 9 frames for smooth transition (0.3 seconds at 30fps)
	const transitionDuration = 9;
	const progress = Math.min(frame / transitionDuration, 1);
	const easedProgress = easeInOutCubic(progress);
	
	const getIncomingStyle = () => {
		switch (transitionType) {
			case 'fade':
				return {
					opacity: interpolate(easedProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
				};
			case 'slide':
				return {
					transform: `translateX(${interpolate(easedProgress, [0, 1], [100, 0], { extrapolateRight: 'clamp' })}%)`,
				};
			case 'zoom':
				return {
					transform: `scale(${interpolate(easedProgress, [0, 1], [0.85, 1], { extrapolateRight: 'clamp' })})`,
					opacity: interpolate(easedProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
				};
			case 'blur':
				return {
					filter: `blur(${interpolate(easedProgress, [0, 1], [10, 0], { extrapolateRight: 'clamp' })}px)`,
					opacity: interpolate(easedProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
				};
			default:
				return {};
		}
	};
	
	const getOutgoingStyle = () => {
		switch (transitionType) {
			case 'fade':
				return {
					opacity: interpolate(easedProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' }),
				};
			case 'slide':
				return {
					transform: `translateX(${interpolate(easedProgress, [0, 1], [0, -100], { extrapolateRight: 'clamp' })}%)`,
				};
			case 'zoom':
				return {
					transform: `scale(${interpolate(easedProgress, [0, 1], [1, 1.15], { extrapolateRight: 'clamp' })})`,
					opacity: interpolate(easedProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' }),
				};
			case 'blur':
				return {
					filter: `blur(${interpolate(easedProgress, [0, 1], [0, 10], { extrapolateRight: 'clamp' })}px)`,
					opacity: interpolate(easedProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' }),
				};
			default:
				return {};
		}
	};
	
	return (
		<AbsoluteFill>
			{fromScene && (
				<AbsoluteFill style={getOutgoingStyle()}>
					{fromScene}
				</AbsoluteFill>
			)}
			<AbsoluteFill style={getIncomingStyle()}>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// Main Component
export const DevinMarketingVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Enhanced Audio with Tone.js */}
			<AudioCue 
				id="intro-audio"
				type="audio"
				startTime={0}
				duration={3}
				assetId="ambient-intro"
				volume={0.3}
				fadeIn={0.5}
				fadeOut={0.5}
				soundType="ambient"
				melody={['C3', 'E3', 'G3', 'B3', 'C4', 'E4', 'G4', 'B4']}
			/>
			
			<AudioCue 
				id="workspace-audio"
				type="audio"
				startTime={3}
				duration={4}
				assetId="synth-workspace"
				volume={0.4}
				fadeIn={0.3}
				fadeOut={0.3}
				soundType="synth"
				note="C4"
			/>
			
			<AudioCue 
				id="tasks-audio"
				type="audio"
				startTime={7}
				duration={4}
				assetId="percussion-tasks"
				volume={0.5}
				fadeIn={0.2}
				fadeOut={0.2}
				soundType="percussion"
			/>
			
			<AudioCue 
				id="hero-audio"
				type="audio"
				startTime={11}
				duration={4}
				assetId="ambient-hero"
				volume={0.6}
				fadeIn={1}
				fadeOut={1}
				soundType="ambient"
				melody={['A3', 'C4', 'E4', 'G4', 'A4', 'C5', 'E5', 'G5']}
			/>
			
			{/* Scene 1: 0-3 seconds (0-90 frames) */}
			<Sequence from={0} durationInFrames={90}>
				<Scene1Intro />
			</Sequence>
			
			{/* Transition 1→2: 2.7-3 seconds (81-90 frames) */}
			<Sequence from={81} durationInFrames={9}>
				<SceneTransition transitionType="fade" fromScene={<Scene1Intro />}>
					<Scene2Workspace />
				</SceneTransition>
			</Sequence>
			
			{/* Scene 2: 3-7 seconds (90-210 frames) */}
			<Sequence from={90} durationInFrames={120}>
				<Scene2Workspace />
			</Sequence>
			
			{/* Transition 2→3: 6.7-7 seconds (201-210 frames) */}
			<Sequence from={201} durationInFrames={9}>
				<SceneTransition transitionType="slide" fromScene={<Scene2Workspace />}>
					<Scene3Tasks />
				</SceneTransition>
			</Sequence>
			
			{/* Scene 3: 7-11 seconds (210-330 frames) */}
			<Sequence from={210} durationInFrames={120}>
				<Scene3Tasks />
			</Sequence>
			
			{/* Transition 3→4: 10.7-11 seconds (321-330 frames) */}
			<Sequence from={321} durationInFrames={9}>
				<SceneTransition transitionType="zoom" fromScene={<Scene3Tasks />}>
					<Scene4Hero />
				</SceneTransition>
			</Sequence>
			
			{/* Scene 4: 11-15 seconds (330-450 frames) */}
			<Sequence from={330} durationInFrames={120}>
				<Scene4Hero />
			</Sequence>
		</AbsoluteFill>
	);
};