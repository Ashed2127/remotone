import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
} from 'remotion';
import {z} from 'zod';
import truefeedImage from '../../truefeed.jpg';
import codeIcon from '../../public/icons/code.png';
import booksIcon from '../../public/icons/books.png';
import designsIcon from '../../public/icons/designs.png';
import businessesIcon from '../../public/icons/businesses.png';
import conversationsIcon from '../../public/icons/conversations.png';
import softwareIcon from '../../public/icons/software.png';
import productsIcon from '../../public/icons/products.png';
import researchIcon from '../../public/icons/research.png';
import artIcon from '../../public/icons/art.png';
import startupsIcon from '../../public/icons/startups.png';
import appsIcon from '../../public/icons/apps.png';
import musicIcon from '../../public/icons/music.png';
import storiesIcon from '../../public/icons/stories.png';

// Schema for props
export const chatGPTLaunchVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof chatGPTLaunchVideoSchema>;

// Scene 1: Complete darkness to particle network (0-4s)
const Scene1ParticleNetwork: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Smooth fade in with easing
	const opacity = interpolate(frame, [0, 30], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Text animation with smooth easing
	const textOpacity = interpolate(frame, [30, 60, 105], [0, 1, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Scene fade out for smooth transition
	const sceneFadeOut = interpolate(frame, [90, 120], [1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Particle generation with smooth movement
	const particleCount = 150;
	const particles = Array.from({ length: particleCount }, (_, i) => {
		const angle = (i / particleCount) * Math.PI * 2;
		const radius = interpolate(frame, [0, 90], [400, 120], {
			easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
			extrapolateRight: 'clamp',
		});
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;
		const particleOpacity = interpolate(frame, [0, 30, 90], [0, 1, 0.9], {
			easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
			extrapolateRight: 'clamp',
		});
		
		return { x, y, opacity: particleOpacity };
	});
	
	return (
		<AbsoluteFill style={{
			background: 'radial-gradient(circle at center, #0a1a0f 0%, #000000 70%)',
			opacity: sceneFadeOut,
		}}>
			{/* Grid overlay for tech feel */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: `
					linear-gradient(rgba(16, 163, 127, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(16, 163, 127, 0.03) 1px, transparent 1px)
				`,
				backgroundSize: '50px 50px',
				opacity: 0.5,
			}} />
			
			{/* Floating UI elements */}
			{Array.from({ length: 6 }, (_, i) => {
				const angle = (i / 6) * Math.PI * 2 + frame * 0.01;
				const radius = 300 + Math.sin(frame * 0.02 + i) * 20;
				const x = Math.cos(angle) * radius;
				const y = Math.sin(angle) * radius;
				const uiOpacity = interpolate(frame, [0, 30], [0, 0.3], {
					easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
							width: '4px',
							height: '4px',
							background: '#10a37f',
							borderRadius: '50%',
							opacity: uiOpacity,
						}}
					/>
				);
			})}
			
			{/* Central particle with pulse effect */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '16px',
				height: '16px',
				background: '#10a37f',
				borderRadius: '50%',
				boxShadow: '0 0 40px #10a37f, 0 0 80px #10a37f, 0 0 120px rgba(16, 163, 127, 0.6)',
				opacity,
			}} />
			
			{/* Pulse rings */}
			{[1, 2, 3].map((ring) => {
				const ringScale = interpolate(frame, [ring * 20, ring * 20 + 30], [0, 2], {
					easing: (t) => --t * t * t + 1,
					extrapolateRight: 'clamp',
				});
				const ringOpacity = interpolate(frame, [ring * 20, ring * 20 + 30], [0.5, 0], {
					easing: (t) => --t * t * t + 1,
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={ring}
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '20px',
							height: '20px',
							border: '2px solid #10a37f',
							borderRadius: '50%',
							opacity: ringOpacity,
							scale: ringScale,
						}}
					/>
				);
			})}
			
			{/* Orbiting particles with smooth motion */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '100%',
				height: '100%',
			}}>
				{particles.map((particle, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%)`,
							width: '3px',
							height: '3px',
							background: '#10a37f',
							borderRadius: '50%',
							opacity: particle.opacity,
							boxShadow: '0 0 8px #10a37f',
						}}
					/>
				))}
				
				{/* Connection lines with fade effect */}
				<svg
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						opacity: 0.4,
					}}
				>
					{particles.slice(0, 30).map((particle, i) => (
						<line
							key={i}
							x1="50%"
							y1="50%"
							x2={`calc(50% + ${particle.x}px)`}
							y2={`calc(50% + ${particle.y}px)`}
							stroke="#10a37f"
							strokeWidth="0.5"
							strokeOpacity="0.6"
						/>
					))}
				</svg>
			</div>
			
			{/* Text with smooth fade */}
			<div style={{
				position: 'absolute',
				bottom: '15%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity: textOpacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '42px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '1px',
					lineHeight: 1.3,
				}}>
					Every question begins<br />with curiosity.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 2: Network expansion with idea transformation (4-8s)
const Scene2IdeaTransformation: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Smooth fade in and out
	const sceneFadeIn = interpolate(frame, [0, 30], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const sceneFadeOut = interpolate(frame, [90, 120], [1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const opacity = sceneFadeIn * sceneFadeOut;
	
	// Text animation with smooth easing
	const textOpacity = interpolate(frame, [30, 60, 90], [0, 1, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Idea categories with morphing
	const ideas = [
		{ label: 'code', icon: codeIcon, color: '#61dafb' },
		{ label: 'books', icon: booksIcon, color: '#f59e0b' },
		{ label: 'designs', icon: designsIcon, color: '#ec4899' },
		{ label: 'businesses', icon: businessesIcon, color: '#8b5cf6' },
		{ label: 'conversations', icon: conversationsIcon, color: '#10b981' },
	];
	
	return (
		<AbsoluteFill style={{
			background: 'radial-gradient(circle at center, #0d1a15 0%, #000000 80%)',
		}}>
			{/* Animated grid background */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: `
					linear-gradient(rgba(16, 163, 127, 0.05) 1px, transparent 1px),
					linear-gradient(90deg, rgba(16, 163, 127, 0.05) 1px, transparent 1px)
				`,
				backgroundSize: '60px 60px',
				opacity: 0.6,
			}} />
			
			{/* Data flow lines */}
			<svg
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					opacity: 0.2,
				}}
			>
				{Array.from({ length: 8 }, (_, i) => {
					const y = (i / 8) * 100;
					const lineOpacity = interpolate(frame, [i * 10, i * 10 + 20], [0, 1], {
						easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
						extrapolateRight: 'clamp',
					});
					
					return (
						<line
							key={i}
							x1="0"
							y1={`${y}%`}
							x2="100%"
							y2={`${y}%`}
							stroke="#10a37f"
							strokeWidth="1"
							opacity={lineOpacity}
						/>
					);
				})}
			</svg>
			
			{/* Expanding network */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '100%',
				height: '100%',
			}}>
				{ideas.map((idea, index) => {
					const delay = index * 18;
					const ideaFrame = frame - delay;
					const ideaOpacity = ideaFrame >= 0 ? 
						interpolate(ideaFrame, [0, 24, 90], [0, 1, 0.9], {
							easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
						}) : 0;
					
					const angle = (index / ideas.length) * Math.PI * 2;
					const radius = interpolate(ideaFrame, [0, 72], [60, 280], {
						easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
						extrapolateRight: 'clamp',
					});
					const x = Math.cos(angle) * radius;
					const y = Math.sin(angle) * radius;
					
					return (
						<div
							key={index}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
								textAlign: 'center',
								opacity: ideaOpacity,
							}}
						>
							<div style={{
								width: '80px',
								height: '80px',
								marginBottom: '12px',
								borderRadius: '16px',
								background: 'rgba(255, 255, 255, 0.1)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
							}}>
								<img 
									src={idea.icon} 
									alt={idea.label}
									style={{
										width: '50px',
										height: '50px',
										objectFit: 'contain',
										filter: 'brightness(0) invert(1)',
									}}
								/>
							</div>
							<p style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '16px',
								fontWeight: 500,
								color: '#ffffff',
								margin: 0,
								textTransform: 'uppercase',
								letterSpacing: '2px',
							}}>
								{idea.label}
							</p>
						</div>
					);
				})}
				
				{/* Central intelligence */}
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '90px',
					height: '90px',
					background: '#10a37f',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '28px',
					fontWeight: 700,
					color: '#ffffff',
					boxShadow: '0 0 80px rgba(16, 163, 127, 0.7)',
					opacity,
				}}>
					AI
				</div>
			</div>
			
			{/* Text */}
			<div style={{
				position: 'absolute',
				bottom: '15%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity: textOpacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '1px',
				}}>
					Curiosity became creation.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 3: Acceleration with humanity building (8-13s)
const Scene3Acceleration: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Smooth fade in and out
	const sceneFadeIn = interpolate(frame, [0, 30], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const sceneFadeOut = interpolate(frame, [120, 150], [1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const opacity = sceneFadeIn * sceneFadeOut;
	
	// Fast-paced elements
	const elements = [
		{ label: 'software', icon: softwareIcon },
		{ label: 'products', icon: productsIcon },
		{ label: 'research', icon: researchIcon },
		{ label: 'art', icon: artIcon },
		{ label: 'startups', icon: startupsIcon },
		{ label: 'apps', icon: appsIcon },
		{ label: 'music', icon: musicIcon },
		{ label: 'stories', icon: storiesIcon },
	];
	
	// Text animations with smooth easing
	const text1Opacity = interpolate(frame, [0, 30, 75], [0, 1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const text2Opacity = interpolate(frame, [60, 90, 150], [0, 1, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'radial-gradient(circle at center, #0f1a18 0%, #000000 75%)',
		}}>
			{/* Dynamic grid with perspective */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: `
					linear-gradient(rgba(16, 163, 127, 0.08) 1px, transparent 1px),
					linear-gradient(90deg, rgba(16, 163, 127, 0.08) 1px, transparent 1px)
				`,
				backgroundSize: '40px 40px',
				opacity: 0.7,
				transform: 'perspective(500px) rotateX(60deg)',
				transformOrigin: 'center center',
			}} />
			
			{/* Floating data particles */}
			{Array.from({ length: 20 }, (_, i) => {
				const startX = Math.random() * 100;
				const startY = Math.random() * 100;
				const endX = startX + (Math.random() - 0.5) * 20;
				const endY = startY + (Math.random() - 0.5) * 20;
				const particleProgress = interpolate(frame, [i * 5, i * 5 + 60], [0, 1], {
					easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
					extrapolateRight: 'clamp',
				});
				const currentX = interpolate(particleProgress, [0, 1], [startX, endX]);
				const currentY = interpolate(particleProgress, [0, 1], [startY, endY]);
				const particleOpacity = interpolate(frame, [i * 5, i * 5 + 20, i * 5 + 50], [0, 1, 0], {
					easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${currentX}%`,
							top: `${currentY}%`,
							width: '3px',
							height: '3px',
							background: '#10a37f',
							borderRadius: '50%',
							opacity: particleOpacity,
							boxShadow: '0 0 6px #10a37f',
						}}
					/>
				);
			})}
			
			{/* Rapid-fire elements */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '100%',
				height: '100%',
			}}>
				{elements.map((element, index) => {
					const delay = index * 15;
					const elementFrame = frame - delay;
					const elementOpacity = elementFrame >= 0 && elementFrame <= 30 ? 
						interpolate(elementFrame, [0, 8, 22, 30], [0, 1, 1, 0], {
							easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
						}) : 0;
					
					const scale = interpolate(elementFrame, [0, 15], [0.6, 1.1], {
						easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
						extrapolateRight: 'clamp',
					});
					
					const posX = (index % 4) * 25 - 37.5;
					const posY = Math.floor(index / 4) * 40 - 20;
					
					return (
						<div
							key={index}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: `translate(${posX}%, ${posY}%) translate(-50%, -50%) scale(${scale})`,
								textAlign: 'center',
								opacity: elementOpacity,
							}}
						>
							<div style={{
								width: '120px',
								height: '120px',
								marginBottom: '16px',
								borderRadius: '20px',
								background: 'linear-gradient(135deg, rgba(16, 163, 127, 0.2) 0%, rgba(16, 163, 127, 0.1) 100%)',
								backdropFilter: 'blur(20px)',
								border: '2px solid rgba(16, 163, 127, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 12px 40px rgba(16, 163, 127, 0.2)',
							}}>
								<img 
									src={element.icon} 
									alt={element.label}
									style={{
										width: '70px',
										height: '70px',
										objectFit: 'contain',
										filter: 'brightness(0) invert(1)',
									}}
								/>
							</div>
							<p style={{
								fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
								fontSize: '18px',
								fontWeight: 600,
								color: '#ffffff',
								margin: 0,
								textTransform: 'uppercase',
								letterSpacing: '1.5px',
							}}>
								{element.label}
							</p>
						</div>
					);
				})}
			</div>
			
			{/* Connecting lines */}
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
				{elements.slice(0, 6).map((_, i) => (
					<line
						key={i}
						x1="50%"
						y1="50%"
						x2={`${25 + (i % 3) * 25}%`}
						y2={`${30 + Math.floor(i / 3) * 40}%`}
						stroke="#10a37f"
						strokeWidth="1"
					/>
				))}
			</svg>
			
			{/* Text */}
			<div style={{
				position: 'absolute',
				bottom: '15%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '52px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '1px',
					opacity: text1Opacity,
				}}>
					Millions of ideas.
				</p>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '52px',
					fontWeight: 300,
					color: '#ffffff',
					margin: '16px 0 0 0',
					letterSpacing: '1px',
					opacity: text2Opacity,
				}}>
					One conversation away.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 4: Energy buildup to logo formation (13-17s)
const Scene4LogoFormation: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Smooth fade in and out
	const sceneFadeIn = interpolate(frame, [0, 30], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const sceneFadeOut = interpolate(frame, [90, 120], [1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const opacity = sceneFadeIn * sceneFadeOut;
	
	// Energy collapse
	const collapseProgress = interpolate(frame, [0, 72], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Logo formation
	const logoScale = interpolate(frame, [36, 90], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const logoOpacity = interpolate(frame, [36, 72], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Text sequence with smooth easing
	const text1Opacity = interpolate(frame, [0, 30, 60], [0, 1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const text2Opacity = interpolate(frame, [36, 66, 96], [0, 1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const text3Opacity = interpolate(frame, [72, 102], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Converging particles
	const particles = Array.from({ length: 60 }, (_, i) => {
		const angle = (i / 60) * Math.PI * 2;
		const radius = 350 * (1 - collapseProgress);
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;
		
		return { x, y };
	});
	
	return (
		<AbsoluteFill style={{
			background: 'radial-gradient(circle at center, #0c1a12 0%, #000000 85%)',
		}}>
			{/* Spiral grid effect */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: `
					linear-gradient(rgba(16, 163, 127, 0.06) 1px, transparent 1px),
					linear-gradient(90deg, rgba(16, 163, 127, 0.06) 1px, transparent 1px)
				`,
				backgroundSize: '80px 80px',
				opacity: 0.8,
				transform: `rotate(${frame * 0.5}deg)`,
				transformOrigin: 'center center',
			}} />
			
			{/* Energy vortex */}
			{Array.from({ length: 5 }, (_, i) => {
				const vortexScale = interpolate(frame, [i * 12, i * 12 + 48], [2, 0], {
					easing: (t) => t * t,
					extrapolateRight: 'clamp',
				});
				const vortexOpacity = interpolate(frame, [i * 12, i * 12 + 48], [0.4, 0], {
					easing: (t) => t * t,
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '400px',
							height: '400px',
							border: '3px solid #10a37f',
							borderRadius: '50%',
							opacity: vortexOpacity,
							scale: vortexScale,
							boxShadow: '0 0 30px rgba(16, 163, 127, 0.3)',
						}}
					/>
				);
			})}
			
			{/* Converging particles */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}}>
				{particles.map((particle, i) => {
					const particleScale = interpolate(frame, [0, 72], [1, 0.5], {
						easing: (t) => t * t,
						extrapolateRight: 'clamp',
					});
					
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%) scale(${particleScale})`,
								width: '6px',
								height: '6px',
								background: '#10a37f',
								borderRadius: '50%',
								opacity: 1 - collapseProgress,
								boxShadow: '0 0 15px #10a37f',
							}}
						/>
					);
				})}
			</div>
			
			{/* Forming logo - truefeed image */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${logoScale})`,
				opacity: logoOpacity,
			}}>
				<div style={{
					width: '200px',
					height: '200px',
					borderRadius: '20px',
					overflow: 'hidden',
					boxShadow: '0 0 100px rgba(16, 163, 127, 0.8)',
					border: '3px solid rgba(16, 163, 127, 0.3)',
				}}>
					<img 
						src={truefeedImage} 
						alt="Truefeed Logo"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				</div>
			</div>
			
			{/* Text sequence */}
			<div style={{
				position: 'absolute',
				bottom: '15%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '56px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '2px',
					opacity: text1Opacity,
				}}>
					Knowledge.
				</p>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '56px',
					fontWeight: 300,
					color: '#ffffff',
					margin: '16px 0 0 0',
					letterSpacing: '2px',
					opacity: text2Opacity,
				}}>
					Creativity.
				</p>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '56px',
					fontWeight: 300,
					color: '#ffffff',
					margin: '16px 0 0 0',
					letterSpacing: '2px',
					opacity: text3Opacity,
				}}>
					Action.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Scene 5: Hero reveal with final impact (17-20s)
const Scene5HeroReveal: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	// Smooth fade in
	const sceneFadeIn = interpolate(frame, [0, 30], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Logo reveal with smooth easing
	const logoOpacity = interpolate(frame, [0, 36], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const logoScale = interpolate(frame, [0, 36], [0.7, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Text animations with smooth easing
	const truefeedOpacity = interpolate(frame, [36, 66], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	const taglineOpacity = interpolate(frame, [66, 96], [0, 1], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	// Final fade
	const finalFade = interpolate(frame, [120, 150], [1, 0], {
		easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		extrapolateRight: 'clamp',
	});
	
	return (
		<AbsoluteFill style={{
			background: 'radial-gradient(circle at center, #0a1f1a 0%, #000000 90%)',
			opacity: finalFade,
		}}>
			{/* Premium background effects */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: `
					radial-gradient(circle at 30% 20%, rgba(16, 163, 127, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 70% 80%, rgba(16, 163, 127, 0.08) 0%, transparent 50%)
				`,
			}} />
			
			{/* Animated decorative rings */}
			{[1, 2, 3].map((ring) => {
				const ringScale = interpolate(frame, [ring * 15, ring * 15 + 45], [0.8, 1.5], {
					easing: (t) => --t * t * t + 1,
					extrapolateRight: 'clamp',
				});
				const ringOpacity = interpolate(frame, [ring * 15, ring * 15 + 45], [0.6, 0], {
					easing: (t) => --t * t * t + 1,
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={ring}
						style={{
							position: 'absolute',
							top: '30%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '300px',
							height: '300px',
							border: '2px solid rgba(16, 163, 127, 0.4)',
							borderRadius: '50%',
							opacity: ringOpacity,
							scale: ringScale,
						}}
					/>
				);
			})}
			
			{/* Floating UI elements */}
			{Array.from({ length: 12 }, (_, i) => {
				const angle = (i / 12) * Math.PI * 2 + frame * 0.008;
				const radius = 200 + Math.sin(frame * 0.03 + i) * 30;
				const x = Math.cos(angle) * radius;
				const y = Math.sin(angle) * radius;
				const uiOpacity = interpolate(frame, [0, 30], [0, 0.4], {
					easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
					extrapolateRight: 'clamp',
				});
				
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							top: '30%',
							left: '50%',
							transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
							width: '3px',
							height: '3px',
							background: '#10a37f',
							borderRadius: '50%',
							opacity: uiOpacity,
							boxShadow: '0 0 8px #10a37f',
						}}
					/>
				);
			})}
			
			{/* Hero logo - truefeed image */}
			<div style={{
				position: 'absolute',
				top: '30%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${logoScale})`,
				opacity: logoOpacity,
			}}>
				<div style={{
					width: '280px',
					height: '280px',
					borderRadius: '30px',
					overflow: 'hidden',
					boxShadow: '0 0 150px rgba(16, 163, 127, 1), 0 0 300px rgba(16, 163, 127, 0.5)',
					border: '5px solid rgba(16, 163, 127, 0.5)',
					background: 'rgba(16, 163, 127, 0.1)',
					backdropFilter: 'blur(20px)',
				}}>
					<img 
						src={truefeedImage} 
						alt="Truefeed Logo"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				</div>
			</div>
			
			{/* Truefeed text */}
			<div style={{
				position: 'absolute',
				top: '55%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity: truefeedOpacity,
			}}>
				<h1 style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '80px',
					fontWeight: 700,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '-2px',
				}}>
					Truefeed
				</h1>
			</div>
			
			{/* Tagline */}
			<div style={{
				position: 'absolute',
				bottom: '20%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				opacity: taglineOpacity,
			}}>
				<p style={{
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '48px',
					fontWeight: 300,
					color: '#ffffff',
					margin: 0,
					letterSpacing: '1px',
				}}>
					Amplify Human Potential.
				</p>
			</div>
		</AbsoluteFill>
	);
};

// Main Component
export const ChatGPTLaunchVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Scene 1: 0-4s (0-120 frames) with overlap for smooth transition */}
			<Sequence from={0} durationInFrames={120}>
				<Scene1ParticleNetwork />
			</Sequence>
			
			{/* Scene 2: 3-8s (90-240 frames) - starts early for overlap */}
			<Sequence from={90} durationInFrames={150}>
				<Scene2IdeaTransformation />
			</Sequence>
			
			{/* Scene 3: 7-13s (210-390 frames) - starts early for overlap */}
			<Sequence from={210} durationInFrames={180}>
				<Scene3Acceleration />
			</Sequence>
			
			{/* Scene 4: 12-17s (360-510 frames) - starts early for overlap */}
			<Sequence from={360} durationInFrames={150}>
				<Scene4LogoFormation />
			</Sequence>
			
			{/* Scene 5: 16-20s (480-600 frames) - starts early for overlap */}
			<Sequence from={480} durationInFrames={120}>
				<Scene5HeroReveal />
			</Sequence>
		</AbsoluteFill>
	);
};