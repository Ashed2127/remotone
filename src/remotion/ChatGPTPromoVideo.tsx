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
import './chatgpt-styles.css';

// Schema for props
export const chatGPTPromoVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof chatGPTPromoVideoSchema>;

// Scene 1: Black screen with typing text (0:00-0:03)
const Scene1Intro: React.FC = () => {
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
	
	const textOpacity = interpolate(frame, [0, 30, 60], [0, 1, 1], {
		extrapolateRight: 'clamp',
	});
	
	const cursorBlink = Math.sin(frame / 5) > 0 ? 1 : 0;
	const cursorVisible = frame >= 30;
	
	const typingProgress = interpolate(frame, [30, 90], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const fullText = '"Can we build this?"';
	const typedText = fullText.slice(0, Math.floor(typingProgress * fullText.length));
	
	return (
		<AbsoluteFill style={{
			background: '#000000',
		}}>
			{/* Main text */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				textAlign: 'center',
				opacity: textOpacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '32px',
					fontWeight: 300,
					color: 'rgba(255, 255, 255, 0.7)',
					margin: '0 0 40px 0',
					letterSpacing: '1px',
				}}>
					Every breakthrough starts with a question.
				</p>
				
				{/* Typing text */}
				<div style={{
					fontFamily: 'SF Mono, Monaco, monospace',
					fontSize: '28px',
					fontWeight: 400,
					color: '#ffffff',
					margin: 0,
					minHeight: '40px',
				}}>
					{typedText}
					{cursorVisible && (
						<span style={{
							opacity: cursorBlink,
							color: '#10a37f',
						}}>
							|
						</span>
					)}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Scene 2: Blueprint to product transformation (0:03-0:06)
const Scene2Blueprint: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const progress = interpolate(frame, [0, 90], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});
	
	// Blueprint line animation
	const lineLength = interpolate(frame, [0, 30], [0, 100], {
		extrapolateRight: 'clamp',
	});
	
	// Transformation stages
	const blueprintOpacity = interpolate(frame, [0, 30, 60], [1, 0.8, 0], {
		extrapolateRight: 'clamp',
	});
	
	const wireframeOpacity = interpolate(frame, [20, 50, 70], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	
	const designOpacity = interpolate(frame, [40, 70, 80], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	
	const codeOpacity = interpolate(frame, [60, 85, 90], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	
	const productOpacity = interpolate(frame, [70, 90], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: '#0a0a0f',
		}}>
			{/* Blueprint lines */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				opacity: blueprintOpacity,
			}}>
				<svg width="400" height="300" viewBox="0 0 400 300">
					<line 
						x1="0" y1="150" 
						x2={`${lineLength * 4}`} y2="150" 
						stroke="#3b82f6" 
						strokeWidth="2"
						strokeDasharray="5,5"
					/>
					<line 
						x1="200" y1="0" 
						x2="200" y2={`${lineLength * 3}`} 
						stroke="#3b82f6" 
						strokeWidth="2"
						strokeDasharray="5,5"
					/>
					<rect 
						x="100" y="50" 
						width="200" height="200" 
						fill="none" 
						stroke="#3b82f6" 
						strokeWidth="1"
						opacity={lineLength / 100}
					/>
				</svg>
			</div>
			
			{/* Wireframe */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				opacity: wireframeOpacity,
			}}>
				<div style={{
					width: '300px',
					height: '200px',
					border: '2px solid rgba(255, 255, 255, 0.3)',
					borderRadius: '8px',
					background: 'rgba(255, 255, 255, 0.05)',
				}}>
					<div style={{
						padding: '16px',
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
					}}>
						<div style={{
							width: '60%',
							height: '12px',
							background: 'rgba(255, 255, 255, 0.2)',
							borderRadius: '4px',
						}} />
					</div>
					<div style={{ padding: '16px' }}>
						<div style={{
							width: '40%',
							height: '8px',
							background: 'rgba(255, 255, 255, 0.15)',
							borderRadius: '4px',
							marginBottom: '8px',
						}} />
						<div style={{
							width: '80%',
							height: '8px',
							background: 'rgba(255, 255, 255, 0.15)',
							borderRadius: '4px',
						}} />
					</div>
				</div>
			</div>
			
			{/* Design */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				opacity: designOpacity,
			}}>
				<div style={{
					width: '300px',
					height: '200px',
					borderRadius: '12px',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
				}} />
			</div>
			
			{/* Code */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				opacity: codeOpacity,
				fontFamily: 'SF Mono, Monaco, monospace',
				fontSize: '14px',
				color: '#e0e0e0',
			}}>
				<div style={{ color: '#c792ea' }}>const</div>
				<div style={{ color: '#82aaff' }}> app </div>
				<div style={{ color: '#89ddff' }}>=</div>
				<div style={{ color: '#82aaff' }}> new</div>
				<div style={{ color: '#82aaff' }}> App</div>
				<div style={{ color: '#89ddff' }}>();</div>
			</div>
			
			{/* Product */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				opacity: productOpacity,
			}}>
				<div style={{
					width: '320px',
					height: '220px',
					borderRadius: '16px',
					background: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<div style={{
						fontSize: '48px',
						fontWeight: 700,
						color: '#ffffff',
					}}>
						🚀
					</div>
				</div>
			</div>
			
			{/* Voice text */}
			<div style={{
				position: 'absolute',
				bottom: '80px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '36px',
					fontWeight: 400,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '0.5px',
				}}>
					Ideas move fast.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 3: Fast-paced sequence (0:06-0:10)
const Scene3Sequence: React.FC = () => {
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
	
	const scenes = [
		{ icon: '🚀', label: 'Founder launches startup', delay: 0 },
		{ icon: '📚', label: 'Student learns new skill', delay: 30 },
		{ icon: '💻', label: 'Developer ships feature', delay: 60 },
		{ icon: '🎨', label: 'Artist creates original work', delay: 90 },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Connecting line */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: 0,
				right: 0,
				height: '2px',
				background: 'linear-gradient(90deg, transparent, #10a37f, transparent)',
				opacity: 0.5,
			}} />
			
			{/* Scene cards */}
			{scenes.map((scene, index) => {
				const sceneFrame = frame - scene.delay;
				const sceneOpacity = sceneFrame >= 0 && sceneFrame <= 30 ? 
					interpolate(sceneFrame, [0, 10, 20, 30], [0, 1, 1, 0]) : 0;
				
				const sceneX = interpolate(sceneFrame, [0, 30], [-200, 200], {
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: `translate(-50%, -50%) translateX(${sceneX}px)`,
							opacity: sceneOpacity,
							textAlign: 'center',
						}}
					>
						<div style={{
							fontSize: '64px',
							marginBottom: '16px',
						}}>
							{scene.icon}
						</div>
						<p style={{
							fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
							fontSize: '24px',
							fontWeight: 400,
							color: '#ffffff',
							margin: 0,
						}}>
							{scene.label}
						</p>
					</div>
				);
			})}
			
			{/* Voice text */}
			<div style={{
				position: 'absolute',
				bottom: '80px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '32px',
					fontWeight: 400,
					color: '#ffffff',
					margin: 0,
					lineHeight: 1.4,
				}}>
					The people building tomorrow<br />move even faster.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 4: Network of projects (0:10-0:14)
const Scene4Network: React.FC = () => {
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
	
	const scale = interpolate(frame, [0, 60], [0.5, 1], {
		extrapolateRight: 'clamp',
	});
	
	// Generate floating projects
	const projects = Array.from({ length: 20 }, (_, i) => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: 20 + Math.random() * 40,
		delay: Math.random() * 30,
		icon: ['📱', '💻', '📊', '🎬', '🏢'][Math.floor(Math.random() * 5)],
	}));
	
	return (
		<AbsoluteFill style={{
			background: '#0a0a0f',
		}}>
			{/* Floating projects */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				width: '100%',
				height: '100%',
			}}>
				{projects.map((project, index) => {
					const projectFrame = frame - project.delay;
					const projectOpacity = projectFrame >= 0 ? 
						interpolate(projectFrame, [0, 20], [0, 1]) : 0;
					
					return (
						<div
							key={index}
							style={{
								position: 'absolute',
								left: `${project.x}%`,
								top: `${project.y}%`,
								fontSize: `${project.size}px`,
								opacity: projectOpacity,
								transform: 'translate(-50%, -50%)',
							}}
						>
							{project.icon}
						</div>
					);
				})}
				
				{/* Connection lines */}
				<svg 
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						opacity: 0.3,
					}}
				>
					{projects.slice(0, 10).map((project, i) => (
						<line
							key={i}
							x1={`${project.x}%`}
							y1={`${project.y}%`}
							x2={`${projects[(i + 1) % projects.length].x}%`}
							y2={`${projects[(i + 1) % projects.length].y}%`}
							stroke="#10a37f"
							strokeWidth="1"
						/>
					))}
				</svg>
			</div>
			
			{/* Voice text */}
			<div style={{
				position: 'absolute',
				bottom: '80px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '36px',
					fontWeight: 400,
					color: '#ffffff',
					margin: 0,
				}}>
					Millions of creations. One common beginning.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 5: Convergence to ChatGPT symbol (0:14-0:17)
const Scene5Convergence: React.FC = () => {
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
	
	const convergenceProgress = interpolate(frame, [0, 60], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const symbolScale = interpolate(frame, [30, 90], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const symbolOpacity = interpolate(frame, [30, 60], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: '#0a0a0f',
		}}>
			{/* Converging elements */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '400px',
				height: '400px',
			}}>
				{Array.from({ length: 8 }, (_, i) => {
					const angle = (i / 8) * Math.PI * 2;
					const radius = 200 * (1 - convergenceProgress);
					const x = Math.cos(angle) * radius;
					const y = Math.sin(angle) * radius;
					
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
								fontSize: '24px',
								opacity: 1 - convergenceProgress,
							}}
						>
							⭐
						</div>
					);
				})}
			</div>
			
			{/* ChatGPT symbol */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${symbolScale})`,
				opacity: symbolOpacity,
			}}>
				<div style={{
					width: '120px',
					height: '120px',
					background: '#10a37f',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '48px',
					fontWeight: 700,
					color: '#ffffff',
					boxShadow: '0 0 60px rgba(16, 163, 127, 0.5)',
				}}>
					AI
				</div>
			</div>
			
			{/* Voice text */}
			<div style={{
				position: 'absolute',
				bottom: '80px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '32px',
					fontWeight: 400,
					color: '#ffffff',
					margin: 0,
				}}>
					A place where curiosity becomes action.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 6: Final logo and text (0:17-0:20)
const Scene6Final: React.FC = () => {
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
	
	const text1Opacity = interpolate(frame, [0, 30, 60], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	
	const text2Opacity = interpolate(frame, [30, 60, 90], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	
	const text3Opacity = interpolate(frame, [60, 90], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: '#ffffff',
		}}>
			{/* Logo */}
			<div style={{
				position: 'absolute',
				top: '30%',
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: logoOpacity,
			}}>
				<div style={{
					width: '80px',
					height: '80px',
					background: '#10a37f',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '32px',
					fontWeight: 700,
					color: '#ffffff',
				}}>
					AI
				</div>
			</div>
			
			{/* Text transitions */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				textAlign: 'center',
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 600,
					color: '#000000',
					margin: 0,
					opacity: text1Opacity,
				}}>
					Learn Faster.
				</p>
				
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 600,
					color: '#000000',
					margin: 0,
					opacity: text2Opacity,
				}}>
					Build Smarter.
				</p>
				
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 600,
					color: '#000000',
					margin: 0,
					opacity: text3Opacity,
				}}>
					Create More.
				</p>
			</div>
			
			{/* Final CHATGPT text */}
			<div style={{
				position: 'absolute',
				bottom: '25%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity,
			}}>
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '64px',
					fontWeight: 700,
					color: '#000000',
					margin: 0,
					letterSpacing: '-1px',
				}}>
					CHATGPT
				</h1>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '18px',
					fontWeight: 400,
					color: '#666666',
					margin: '16px 0 0 0',
				}}>
					The tool behind the next generation of builders.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Main Component
export const ChatGPTPromoVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Scene 1: 0:00-0:03 (0-90 frames) */}
			<Sequence from={0} durationInFrames={90}>
				<Scene1Intro />
			</Sequence>
			
			{/* Scene 2: 0:03-0:06 (90-180 frames) */}
			<Sequence from={90} durationInFrames={90}>
				<Scene2Blueprint />
			</Sequence>
			
			{/* Scene 3: 0:06-0:10 (180-300 frames) */}
			<Sequence from={180} durationInFrames={120}>
				<Scene3Sequence />
			</Sequence>
			
			{/* Scene 4: 0:10-0:14 (300-420 frames) */}
			<Sequence from={300} durationInFrames={120}>
				<Scene4Network />
			</Sequence>
			
			{/* Scene 5: 0:14-0:17 (420-510 frames) */}
			<Sequence from={420} durationInFrames={90}>
				<Scene5Convergence />
			</Sequence>
			
			{/* Scene 6: 0:17-0:20 (510-600 frames) */}
			<Sequence from={510} durationInFrames={90}>
				<Scene6Final />
			</Sequence>
			
			{/* Enhanced Audio with Tone.js */}
			{/* 0:00-0:03: Soft piano + ambient */}
			<AudioCue 
				id="scene1-audio"
				type="audio"
				startTime={0}
				duration={3}
				assetId="scene1-ambient"
				volume={0.4}
				fadeIn={0.5}
				fadeOut={0.3}
				soundType="ambient"
				melody={['C3', 'E3', 'G3', 'B3', 'C4']}
			/>
			
			{/* 0:03-0:10: Electronic pulse + interface sounds */}
			<AudioCue 
				id="scene2-audio"
				type="audio"
				startTime={3}
				duration={7}
				assetId="scene2-electronic"
				volume={0.5}
				fadeIn={0.3}
				fadeOut={0.3}
				soundType="synth"
				note="A4"
			/>
			
			{/* 0:10-0:14: Cinematic bass + orchestra */}
			<AudioCue 
				id="scene3-audio"
				type="audio"
				startTime={10}
				duration={4}
				assetId="scene3-cinematic"
				volume={0.6}
				fadeIn={0.5}
				fadeOut={0.3}
				soundType="ambient"
				melody={['A2', 'C3', 'E3', 'G3', 'A3']}
			/>
			
			{/* 0:14-0:17: Rising synth sweep */}
			<AudioCue 
				id="scene4-audio"
				type="audio"
				startTime={14}
				duration={3}
				assetId="scene4-sweep"
				volume={0.7}
				fadeIn={0.5}
				fadeOut={0.8}
				soundType="synth"
				melody={['C4', 'E4', 'G4', 'B4', 'C5', 'E5', 'G5', 'C6']}
			/>
			
			{/* 0:17-0:20: Orchestral resolution */}
			<AudioCue 
				id="scene5-audio"
				type="audio"
				startTime={17}
				duration={3}
				assetId="scene5-resolution"
				volume={0.5}
				fadeIn={0.3}
				fadeOut={2}
				soundType="ambient"
				melody={['C3', 'E3', 'G3', 'C4']}
			/>
		</AbsoluteFill>
	);
};