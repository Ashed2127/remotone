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
export const devinInActionVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof devinInActionVideoSchema>;

// Typing animation component
const TypingText: React.FC<{
	text: string;
	frame: number;
	fps: number;
	speed?: number;
}> = ({ text, frame, fps, speed = 2 }) => {
	const charsToShow = Math.floor(frame / speed);
	const visibleText = text.slice(0, Math.min(charsToShow, text.length));
	
	return (
		<span style={{
			fontFamily: 'monospace',
			whiteSpace: 'pre-wrap',
		}}>
			{visibleText}
			{charsToShow < text.length && (
				<span style={{
					animation: 'blink 0.5s step-end infinite',
				}}>▌</span>
			)}
		</span>
	);
};

// Terminal component
const Terminal: React.FC<{
	frame: number;
	fps: number;
	commands: Array<{ text: string; delay: number; color?: string }>;
}> = ({ frame, fps, commands }) => {
	return (
		<div style={{
			background: '#0a0a0f',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: '12px',
			padding: '16px',
			fontFamily: 'monospace',
			fontSize: '13px',
			lineHeight: 1.5,
			boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
		}}>
			{/* Terminal header */}
			<div style={{
				display: 'flex',
				gap: '6px',
				marginBottom: '12px',
				paddingBottom: '10px',
				borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
			}}>
				<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57'}} />
				<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e'}} />
				<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#28c840'}} />
				<span style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px'}}>
					devin-terminal
				</span>
			</div>
			
			{/* Commands */}
			{commands.map((cmd, index) => {
				const cmdFrame = frame - cmd.delay;
				if (cmdFrame < 0) return null;
				
				return (
					<div key={index} style={{
						marginBottom: '6px',
						color: cmd.color || '#e0e0e0',
					}}>
						<TypingText text={cmd.text} frame={cmdFrame} fps={fps} speed={1.5} />
					</div>
				);
			})}
		</div>
	);
};

// Code editor component
const CodeEditor: React.FC<{
	frame: number;
	fps: number;
	title: string;
	code: string;
	zoom?: number;
	delay?: number;
}> = ({ frame, fps, title, code, zoom = 1, delay = 0 }) => {
	const effectiveFrame = frame - delay;
	if (effectiveFrame < 0) return null;
	
	const opacity = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 30,
			stiffness: 200,
		},
	});
	
	const scale = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 30,
			stiffness: 150,
			mass: 0.5,
		},
	});
	
	return (
		<div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%) scale(${scale * zoom})`,
			opacity,
			width: '80%',
			maxWidth: '1200px',
		}}>
			<div style={{
				background: '#1a1a24',
				border: '1px solid rgba(255, 255, 255, 0.1)',
				borderRadius: '12px',
				overflow: 'hidden',
				boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
			}}>
				{/* Editor header */}
				<div style={{
					background: 'rgba(255, 255, 255, 0.05)',
					padding: '12px 16px',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
				}}>
					<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57'}} />
					<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e'}} />
					<div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#28c840'}} />
					<span style={{marginLeft: '16px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontFamily: 'monospace'}}>
						{title}
					</span>
				</div>
				
				{/* Code content */}
				<div style={{
					padding: '24px',
					fontFamily: 'monospace',
					fontSize: '15px',
					lineHeight: 1.8,
					color: '#e0e0e0',
					whiteSpace: 'pre-wrap',
				}}>
					<TypingText text={code} frame={effectiveFrame} fps={fps} speed={3} />
				</div>
			</div>
		</div>
	);
};

// Scene 1: User asks question (0-4s)
const Scene1UserQuestion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const commands = [
		{ text: '$ devin fix my auth bug', delay: 30, color: '#64ffda' },
		{ text: '🔍 Analyzing codebase...', delay: 60, color: '#f9a8d4' },
		{ text: '📂 Found issue in login.ts', delay: 90, color: '#64b5ff' },
		{ text: '🐛 Bug: Missing token validation', delay: 120, color: '#fbbf24' },
		{ text: '✅ Fix applied successfully!', delay: 150, color: '#34d399' },
	];
	
	const zoom = interpolate(frame, [0, 30, 90, 120], [1, 1.15, 1.15, 1], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Background grid */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				backgroundImage: `
					linear-gradient(rgba(100, 150, 255, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(100, 150, 255, 0.03) 1px, transparent 1px)
				`,
				backgroundSize: '30px 30px',
			}} />
			
			{/* Floating label - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				top: '100px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				width: '90%',
			}}>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '28px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					textShadow: '0 0 30px rgba(150, 130, 255, 0.6)',
					lineHeight: 1.2,
				}}>
					Ask Devin Anything
				</h2>
			</div>
			
			{/* Terminal with zoom effect - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				top: '55%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${zoom})`,
				width: '85%',
				maxWidth: '500px',
			}}>
				<Terminal frame={frame} fps={fps} commands={commands} />
			</div>
			
			{/* Cinematic bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
		</AbsoluteFill>
	);
};

// Scene 2: Devin analyzes and edits code (4-9s)
const Scene2CodeEdit: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const code = `import { validateToken } from './utils';

export async function login(credentials) {
  const user = await authenticate(credentials);
  const token = generateJWT(user);
  
  // DEVIN: Added validation
  if (!validateToken(token)) {
    throw new Error('Invalid token');
  }
  
  return { user, token };
}`;

	const zoomSequence = interpolate(frame, [0, 30, 60, 90, 120], [1, 1.2, 1.2, 1, 1], {
		extrapolateRight: 'clamp',
	});
	
	const highlightLine = interpolate(frame, [30, 60, 90], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Background particles */}
			{[...Array(20)].map((_, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						width: `${Math.random() * 3 + 1}px`,
						height: `${Math.random() * 3 + 1}px`,
						background: `rgba(150, 130, 255, ${Math.random() * 0.5 + 0.2})`,
						borderRadius: '50%',
						filter: 'blur(1px)',
						animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
					}}
				/>
			))}
			
			{/* Code editor with zoom - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${zoomSequence})`,
				width: '90%',
				maxWidth: '400px',
			}}>
				<div style={{
					background: '#1a1a24',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					borderRadius: '12px',
					overflow: 'hidden',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
				}}>
					{/* Editor header */}
					<div style={{
						background: 'rgba(255, 255, 255, 0.05)',
						padding: '10px 14px',
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
					}}>
						<div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57'}} />
						<div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e'}} />
						<div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#28c840'}} />
						<span style={{marginLeft: '12px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontFamily: 'monospace'}}>
							login.ts
						</span>
					</div>
					
					{/* Code content */}
					<div style={{
						padding: '16px',
						fontFamily: 'monospace',
						fontSize: '12px',
						lineHeight: 1.6,
						color: '#e0e0e0',
						whiteSpace: 'pre-wrap',
					}}>
						<TypingText text={code} frame={frame} fps={fps} speed={2} />
					</div>
				</div>
			</div>
			
			{/* Highlight overlay for the fix - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				bottom: '140px',
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: highlightLine,
				pointerEvents: 'none',
				width: '80%',
				textAlign: 'center',
			}}>
				<div style={{
					background: 'rgba(100, 255, 218, 0.2)',
					border: '2px solid #64ffda',
					borderRadius: '8px',
					padding: '12px 20px',
					color: '#64ffda',
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '16px',
					fontWeight: 600,
					boxShadow: '0 0 30px rgba(100, 255, 218, 0.4)',
					display: 'inline-block',
				}}>
					✨ Devin Fix Added
				</div>
			</div>
			
			{/* Status indicator - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				bottom: '80px',
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: spring({frame, fps, config: {damping: 30, stiffness: 150}}),
			}}>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					background: 'rgba(255, 255, 255, 0.1)',
					padding: '10px 20px',
					borderRadius: '25px',
					backdropFilter: 'blur(10px)',
				}}>
					<div style={{
						width: '10px',
						height: '10px',
						background: '#64ffda',
						borderRadius: '50%',
						animation: 'pulse 1s ease-in-out infinite',
					}} />
					<span style={{
						color: '#ffffff',
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '14px',
						fontWeight: 500,
					}}>
						Editing Code...
					</span>
				</div>
			</div>
			
			{/* Cinematic bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
		</AbsoluteFill>
	);
};

// Scene 3: Running tests and deployment (9-14s)
const Scene3TestDeploy: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const commands = [
		{ text: '$ npm test', delay: 0, color: '#64ffda' },
		{ text: '✓ login.spec.ts - PASSED', delay: 30, color: '#34d399' },
		{ text: '✓ auth.spec.ts - PASSED', delay: 60, color: '#34d399' },
		{ text: '✓ token.spec.ts - PASSED', delay: 90, color: '#34d399' },
		{ text: '$ npm run deploy', delay: 120, color: '#64ffda' },
		{ text: '🚀 Deploying...', delay: 150, color: '#f9a8d4' },
		{ text: '✅ Live at app.example.com', delay: 180, color: '#34d399' },
	];
	
	const zoom = interpolate(frame, [0, 45, 135, 180], [1, 1.1, 1.1, 1], {
		extrapolateRight: 'clamp',
	});
	
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
					radial-gradient(circle at 50% 50%, rgba(100, 255, 218, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 30% 70%, rgba(150, 130, 255, 0.05) 0%, transparent 40%)
				`,
			}} />
			
			{/* Terminal with zoom - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${zoom})`,
				width: '85%',
				maxWidth: '500px',
			}}>
				<Terminal frame={frame} fps={fps} commands={commands} />
			</div>
			
			{/* Success celebration - adjusted for mobile */}
			{frame > 180 && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: spring({frame: frame - 180, fps, config: {damping: 30, stiffness: 150}}),
					textAlign: 'center',
				}}>
					<div style={{
						fontSize: '60px',
						marginBottom: '12px',
					}}>
						🎉
					</div>
					<h2 style={{
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '36px',
						fontWeight: 700,
						color: '#64ffda',
						margin: 0,
						textShadow: '0 0 40px rgba(100, 255, 218, 0.6)',
					}}>
						Ship It!
					</h2>
				</div>
			)}
			
			{/* Cinematic bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
		</AbsoluteFill>
	);
};

// Scene 4: Multiple tasks showcase (14-18s)
const Scene4MultiTask: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const tasks = [
		{ title: 'Fix Bug', icon: '🐛', status: '✅', zoom: 1.1 },
		{ title: 'Write Tests', icon: '🧪', status: '✅', zoom: 1.05 },
		{ title: 'Deploy', icon: '🚀', status: '✅', zoom: 1.0 },
		{ title: 'Monitor', icon: '📊', status: '🔄', zoom: 0.95 },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
		}}>
			{/* Background */}
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				backgroundImage: `
					linear-gradient(rgba(100, 150, 255, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(100, 150, 255, 0.03) 1px, transparent 1px)
				`,
				backgroundSize: '30px 30px',
			}} />
			
			{/* Task cards with zoom effects - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				top: '45%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '16px',
				width: '85%',
				maxWidth: '400px',
			}}>
				{tasks.map((task, index) => {
					const taskDelay = index * 20;
					const taskFrame = frame - taskDelay;
					
					if (taskFrame < 0) return null;
					
					const scale = spring({
						frame: taskFrame,
						fps,
						config: {
							damping: 30,
							stiffness: 200,
							mass: 0.4,
						},
					});
					
					const opacity = spring({
						frame: taskFrame,
						fps,
						config: {
							damping: 40,
							stiffness: 150,
						},
					});
					
					const currentZoom = interpolate(taskFrame, [0, 30], [1, task.zoom], {
						extrapolateRight: 'clamp',
					});
					
					return (
						<div
							key={index}
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								borderRadius: '12px',
								padding: '20px',
								backdropFilter: 'blur(10px)',
								opacity,
								transform: `scale(${scale * currentZoom})`,
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
								transition: 'transform 0.3s ease',
							}}
						>
							<div style={{
								fontSize: '32px',
								marginBottom: '10px',
							}}>
								{task.icon}
							</div>
							<h3 style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '16px',
								fontWeight: 600,
								color: '#ffffff',
								margin: '0 0 8px 0',
							}}>
								{task.title}
							</h3>
							<div style={{
								fontSize: '24px',
								color: task.status === '✅' ? '#64ffda' : '#f9a8d4',
							}}>
								{task.status}
							</div>
						</div>
					);
				})}
			</div>
			
			{/* Central text - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				bottom: '100px',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity: spring({frame, fps, config: {damping: 40, stiffness: 150}}),
				width: '90%',
			}}>
				<h2 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '28px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					textShadow: '0 0 40px rgba(150, 130, 255, 0.6)',
					lineHeight: 1.2,
				}}>
					Devin Handles It All
				</h2>
			</div>
			
			{/* Cinematic bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
		</AbsoluteFill>
	);
};

// Scene 5: Final CTA (18-20s)
const Scene5CTA: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 30,
			stiffness: 150,
			mass: 0.5,
		},
	});
	
	const opacity = spring({
		frame,
		fps,
		config: {
			damping: 40,
			stiffness: 150,
		},
	});
	
	const glowIntensity = interpolate(frame, [0, 60], [0, 1], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
		}}>
			{/* Particle explosion */}
			{[...Array(60)].map((_, i) => {
				const angle = (i / 60) * Math.PI * 2;
				const distance = interpolate(frame, [0, 60], [30, 200], {
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
							width: '3px',
							height: '3px',
							background: `rgba(150, 130, 255, ${0.5 + Math.random() * 0.5})`,
							borderRadius: '50%',
							filter: 'blur(1px)',
							boxShadow: `0 0 10px rgba(150, 130, 255, 0.5)`,
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
				width: `${200 + glowIntensity * 150}px`,
				height: `${200 + glowIntensity * 150}px`,
				background: `radial-gradient(circle, rgba(150, 130, 255, ${0.2 + glowIntensity * 0.3}) 0%, transparent 70%)`,
				borderRadius: '50%',
				filter: 'blur(30px)',
			}} />
			
			{/* Logo and CTA - adjusted for mobile */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				textAlign: 'center',
				opacity,
				width: '90%',
			}}>
				{/* Devin logo */}
				<div style={{
					width: '120px',
					height: '120px',
					margin: '0 auto 20px',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '30px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '56px',
					fontWeight: 800,
					color: '#ffffff',
					boxShadow: `0 0 ${60 * glowIntensity}px rgba(150, 130, 255, ${0.8 * glowIntensity})`,
				}}>
					D
				</div>
				
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '36px',
					fontWeight: 800,
					color: '#ffffff',
					margin: '0 0 12px 0',
					textShadow: '0 0 40px rgba(150, 130, 255, 0.6)',
					lineHeight: 1.2,
				}}>
					Your AI Engineer
				</h1>
				
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '20px',
					fontWeight: 400,
					color: 'rgba(255, 255, 255, 0.8)',
					margin: 0,
					letterSpacing: '1px',
				}}>
					Just Ask. Devin Builds.
				</p>
			</div>
			
			{/* Cinematic bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: '#000'}} />
		</AbsoluteFill>
	);
};

// Main Component
export const DevinInActionVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Scene 1: 0-4 seconds (0-120 frames) */}
			<Sequence from={0} durationInFrames={120}>
				<Scene1UserQuestion />
			</Sequence>
			
			{/* Scene 2: 4-9 seconds (120-270 frames) */}
			<Sequence from={120} durationInFrames={150}>
				<Scene2CodeEdit />
			</Sequence>
			
			{/* Scene 3: 9-14 seconds (270-420 frames) */}
			<Sequence from={270} durationInFrames={150}>
				<Scene3TestDeploy />
			</Sequence>
			
			{/* Scene 4: 14-18 seconds (420-540 frames) */}
			<Sequence from={420} durationInFrames={120}>
				<Scene4MultiTask />
			</Sequence>
			
			{/* Scene 5: 18-20 seconds (540-600 frames) */}
			<Sequence from={540} durationInFrames={60}>
				<Scene5CTA />
			</Sequence>
		</AbsoluteFill>
	);
};
