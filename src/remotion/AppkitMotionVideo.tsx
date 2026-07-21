import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	Audio,
} from 'remotion';
import {z} from 'zod';
import './styles.css';

// Schema for props
export const appkitMotionVideoSchema = z.object({
	// Add any configurable props here
});

type Props = z.infer<typeof appkitMotionVideoSchema>;

// Dark grid background component
const DarkGridBackground: React.FC = () => {
	return (
		<AbsoluteFill style={{
			background: '#0a0a0a',
			backgroundImage: `
				radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)
			`,
			backgroundSize: '20px 20px',
		}} />
	);
};

// Typing animation component
const TypingText: React.FC<{text: string, delay: number, fontSize: string}> = ({text, delay, fontSize}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const startFrame = delay;
	const charsToShow = Math.floor(interpolate(frame, [startFrame, startFrame + 30], [0, text.length], {
		extrapolateRight: 'clamp',
	}));
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	return (
		<div style={{
			fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
			fontSize,
			fontWeight: 700,
			color: '#ffffff',
			opacity,
			whiteSpace: 'pre',
		}}>
			{text.substring(0, charsToShow)}
			<span style={{
				opacity: frame % 10 < 5 ? 1 : 0,
				animation: 'blink 1s step-end infinite',
			}}>|</span>
		</div>
	);
};

// Mouse cursor component
const MouseCursor: React.FC<{x: number, y: number, delay: number}> = ({x, y, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const cursorX = interpolate(frame - delay, [0, 20], [0, x], {
		extrapolateRight: 'clamp',
	});
	
	const cursorY = interpolate(frame - delay, [0, 20], [0, y], {
		extrapolateRight: 'clamp',
	});
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	return (
		<div style={{
			position: 'absolute',
			left: cursorX,
			top: cursorY,
			opacity,
			fontSize: '24px',
			filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
		}}>
			👆
		</div>
	);
};

// Sticky note component
const StickyNote: React.FC<{text: string, color: string, delay: number, x: number, y: number}> = ({text, color, delay, x, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const slideIn = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 80},
	});
	
	const rotation = interpolate(frame - delay, [0, 20], [-5, 0], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<div style={{
			position: 'absolute',
			left: x,
			top: y,
			transform: `translateX(${100 - slideIn * 100}%) rotate(${rotation}deg)`,
			background: color,
			padding: '20px',
			borderRadius: '4px',
			boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
			fontFamily: 'Comic Sans MS, cursive, sans-serif',
			fontSize: '18px',
			color: '#333',
			maxWidth: '300px',
			transformOrigin: 'top left',
		}}>
			{text}
		</div>
	);
};

// Dropdown menu component
const DropdownMenu: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const expandHeight = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 60},
	});
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	const tasks = [
		'Connect wallet',
		'TonConnect integration',
		'Wallet connection boilerplate',
		'Build a wallet picker modal UI from scratch',
		'Handle and parse all wallet response callbacks',
		'Deploy smart contract',
		'Implement gas estimation',
		'Handle transaction signing',
		'Build transaction history UI',
		'Implement error handling',
		'Add loading states',
		'Test on mainnet',
	];
	
	return (
		<div style={{
			position: 'absolute',
			top: '200px',
			left: '100px',
			background: '#2a2a2a',
			borderRadius: '8px',
			boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
			opacity,
			overflow: 'hidden',
		}}>
			<div style={{
				background: '#3a3a3a',
				padding: '12px 16px',
				fontFamily: 'Inter, sans-serif',
				fontSize: '14px',
				fontWeight: 600,
				color: '#fff',
				borderBottom: '1px solid #4a4a4a',
			}}>
				Build our dApp
			</div>
			<div style={{
				height: `${expandHeight * 300}px`,
				overflow: 'hidden',
				padding: '8px',
			}}>
				{tasks.map((task, index) => (
					<div key={index} style={{
						padding: '8px 12px',
						fontFamily: 'Inter, sans-serif',
						fontSize: '13px',
						color: '#ccc',
						borderBottom: '1px solid #3a3a3a',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
					}}>
						<div style={{
							width: '4px',
							height: '4px',
							background: '#666',
							borderRadius: '50%',
						}} />
						{task}
					</div>
				))}
			</div>
		</div>
	);
};

// Code editor component
const CodeEditor: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	const slideIn = interpolate(frame - delay, [0, 30], [-500, 0], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<div style={{
			position: 'absolute',
			top: '150px',
			left: '50%',
			transform: `translateX(-50%) translateX(${slideIn}px)`,
			width: '800px',
			height: '400px',
			background: '#1e1e1e',
			borderRadius: '12px',
			boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
			opacity,
			overflow: 'hidden',
		}}>
			{/* Window header */}
			<div style={{
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '12px 16px',
				display: 'flex',
				alignItems: 'center',
				gap: '8px',
			}}>
				<div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57'}} />
				<div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e'}} />
				<div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#28c840'}} />
				<span style={{
					marginLeft: '16px',
					color: 'white',
					fontSize: '12px',
					fontFamily: 'monospace',
				}}>
					tonapp — Vshower Stewdeo Cold
				</span>
			</div>
			
			{/* Code content */}
			<div style={{
				padding: '20px',
				fontFamily: 'monospace',
				fontSize: '14px',
				color: '#d4d4d4',
				lineHeight: 1.6,
			}}>
				<div style={{color: '#c792ea'}}>import TonConnect from '@tonconnect/sdk'</div>
				<div style={{marginTop: '12px'}} />
				<div style={{color: '#c792ea'}}>const connector = new TonConnect()</div>
				<div style={{marginTop: '12px'}} />
				<div style={{color: '#c792ea'}}>await connector.connect()</div>
			</div>
		</div>
	);
};

// Error state component
const ErrorState: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	const errors = [
		'Nonce mismatch',
		'Address lookup failed',
		'Request timed out',
		'No provider found',
	];
	
	return (
		<div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			opacity,
		}}>
			{errors.map((error, index) => {
				const errorDelay = index * 5;
				const errorOpacity = spring({
					frame: frame - delay - errorDelay,
					fps,
					config: {damping: 200, stiffness: 100},
				});
				
				return (
					<div key={index} style={{
						background: 'rgba(255, 82, 82, 0.2)',
						border: '1px solid #ff5252',
						padding: '12px 24px',
						borderRadius: '6px',
						margin: '8px',
						fontFamily: 'Inter, sans-serif',
						fontSize: '16px',
						fontWeight: 600,
						color: '#ff5252',
						opacity: errorOpacity,
					}}>
						{error}
					</div>
				);
			})}
		</div>
	);
};

// Capsule buttons component
const CapsuleButtons: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	const buttons = [
		{ label: 'Install AppKit', color: '#667eea' },
		{ label: 'Connect a wallet', color: '#764ba2' },
		{ label: 'Show balances', color: '#64ffda' },
	];
	
	return (
		<div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			display: 'flex',
			flexDirection: 'column',
			gap: '16px',
			opacity,
		}}>
			{buttons.map((button, index) => {
				const buttonDelay = index * 10;
				const buttonScale = spring({
					frame: frame - delay - buttonDelay,
					fps,
					config: {damping: 200, stiffness: 80},
				});
				
				return (
					<div key={index} style={{
						background: button.color,
						padding: '16px 32px',
						borderRadius: '50px',
						fontFamily: 'Inter, sans-serif',
						fontSize: '18px',
						fontWeight: 600,
						color: '#fff',
						textAlign: 'center',
						transform: `scale(${buttonScale})`,
						boxShadow: `0 8px 24px ${button.color}80`,
					}}>
						{button.label}
					</div>
				);
			})}
		</div>
	);
};

// Mobile wallet UI component
const MobileWalletUI: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	const slideIn = interpolate(frame - delay, [0, 30], [300, 0], {
		extrapolateRight: 'clamp',
	});
	
	return (
		<div style={{
			position: 'absolute',
			right: '100px',
			top: '50%',
			transform: `translateY(-50%) translateX(${slideIn}px)`,
			width: '280px',
			height: '500px',
			background: '#1a1a2e',
			borderRadius: '32px',
			boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
			opacity,
			overflow: 'hidden',
			border: '2px solid #333',
		}}>
			{/* Phone notch */}
			<div style={{
				width: '120px',
				height: '24px',
				background: '#000',
				borderRadius: '0 0 16px 16px',
				margin: '0 auto',
			}} />
			
			{/* Wallet header */}
			<div style={{
				padding: '24px',
				textAlign: 'center',
			}}>
				<div style={{
					fontFamily: 'Inter, sans-serif',
					fontSize: '14px',
					color: '#888',
					marginBottom: '8px',
				}}>
					Total Balance
				</div>
				<div style={{
					fontFamily: 'Inter, sans-serif',
					fontSize: '32px',
					fontWeight: 700,
					color: '#fff',
				}}>
					1,234.56 TON
				</div>
			</div>
			
			{/* Wallet actions */}
			<div style={{
				padding: '0 16px',
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '12px',
			}}>
				<div style={{
					background: '#2a2a3e',
					padding: '16px',
					borderRadius: '12px',
					textAlign: 'center',
				}}>
					<div style={{fontSize: '24px', marginBottom: '8px'}}>💰</div>
					<div style={{
						fontFamily: 'Inter, sans-serif',
						fontSize: '12px',
						color: '#fff',
					}}>
						Send
					</div>
				</div>
				<div style={{
					background: '#2a2a3e',
					padding: '16px',
					borderRadius: '12px',
					textAlign: 'center',
				}}>
					<div style={{fontSize: '24px', marginBottom: '8px'}}>📥</div>
					<div style={{
						fontFamily: 'Inter, sans-serif',
						fontSize: '12px',
						color: '#fff',
					}}>
						Receive
					</div>
				</div>
			</div>
		</div>
	);
};

// Feature list component
const FeatureList: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	const features = [
		{ name: 'Show balances', status: 'LIVE' },
		{ name: 'Connect a wallet', status: 'LIVE' },
		{ name: 'Display NFT ownership', status: 'LIVE' },
		{ name: 'Send & receive TON', status: 'DEPLOY' },
		{ name: 'Sponsor gas for your users', status: 'DEPLOY' },
	];
	
	return (
		<div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			opacity,
		}}>
			{features.map((feature, index) => {
				const featureDelay = index * 8;
				const featureOpacity = spring({
					frame: frame - delay - featureDelay,
					fps,
					config: {damping: 200, stiffness: 100},
				});
				
				const statusColor = feature.status === 'LIVE' ? '#ff6b9d' : '#64ffda';
				
				return (
					<div key={index} style={{
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						padding: '12px 24px',
						background: 'rgba(255,255,255,0.05)',
						borderRadius: '8px',
						margin: '8px 0',
						opacity: featureOpacity,
					}}>
						<span style={{
							background: statusColor,
							padding: '4px 12px',
							borderRadius: '4px',
							fontFamily: 'Inter, sans-serif',
							fontSize: '12px',
							fontWeight: 700,
							color: '#000',
						}}>
							{feature.status}
						</span>
						<span style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '16px',
							color: '#fff',
						}}>
							{feature.name}
						</span>
					</div>
				);
			})}
		</div>
	);
};

// Scene 1: Week 1 intro
const Scene1Week1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	return (
		<AbsoluteFill>
			<DarkGridBackground />
			
			{/* Week 1 title */}
			<div style={{
				position: 'absolute',
				top: '100px',
				left: '100px',
			}}>
				<TypingText text="Week 1" delay={0} fontSize="48px" />
			</div>
			
			{/* Mouse cursor */}
			<MouseCursor x={400} y={200} delay={30} />
			
			{/* Yellow sticky note */}
			<StickyNote 
				text="hey mark. Instructions are here @JohnCodunayo" 
				color="#ffe066" 
				delay={60} 
				x={500} 
				y={300} 
			/>
			
			{/* Dropdown menu */}
			<DropdownMenu delay={120} />
		</AbsoluteFill>
	);
};

// Scene 2: Code editor
const Scene2CodeEditor: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	return (
		<AbsoluteFill>
			<DarkGridBackground />
			
			{/* Week 2 title */}
			<div style={{
				position: 'absolute',
				top: '100px',
				left: '100px',
			}}>
				<TypingText text="Week 2" delay={0} fontSize="48px" />
			</div>
			
			{/* Code editor */}
			<CodeEditor delay={30} />
			
			{/* Error state */}
			<ErrorState delay={180} />
		</AbsoluteFill>
	);
};

// Scene 3: Solution
const Scene3Solution: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	return (
		<AbsoluteFill>
			<DarkGridBackground />
			
			{/* Blue sticky note */}
			<StickyNote 
				text="use this TON AppKit @JohnCodunayo" 
				color="#64b5ff" 
				delay={0} 
				x={400} 
				y={200} 
			/>
			
			{/* Capsule buttons */}
			<CapsuleButtons delay={60} />
		</AbsoluteFill>
	);
};

// Scene 4: Mobile wallet
const Scene4MobileWallet: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	return (
		<AbsoluteFill>
			<DarkGridBackground />
			
			{/* Mobile wallet UI */}
			<MobileWalletUI delay={0} />
			
			{/* Feature list */}
			<FeatureList delay={60} />
		</AbsoluteFill>
	);
};

// Scene 5: Final title
const Scene5Final: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame,
		fps,
		config: {damping: 200, stiffness: 100},
	});
	
	return (
		<AbsoluteFill>
			<DarkGridBackground />
			
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				textAlign: 'center',
				opacity,
			}}>
				<TypingText text="Ship in Minutes Not Weeks" delay={0} fontSize="64px" />
			</div>
		</AbsoluteFill>
	);
};

// Main Component
export const AppkitMotionVideo: React.FC<Props> = () => {
	return (
		<AbsoluteFill>
			{/* Audio */}
			<Audio
				src="/audio.wav"
				startFrom={0}
				endAt={60}
				volume={1}
			/>
			
			{/* Scene 1: Week 1 intro (0-12 seconds) */}
			<Sequence from={0} durationInFrames={288}>
				<Scene1Week1 />
			</Sequence>
			
			{/* Scene 2: Code editor with errors (12-24 seconds) */}
			<Sequence from={288} durationInFrames={288}>
				<Scene2CodeEditor />
			</Sequence>
			
			{/* Scene 3: Solution with AppKit (24-36 seconds) */}
			<Sequence from={576} durationInFrames={288}>
				<Scene3Solution />
			</Sequence>
			
			{/* Scene 4: Mobile wallet (36-48 seconds) */}
			<Sequence from={864} durationInFrames={288}>
				<Scene4MobileWallet />
			</Sequence>
			
			{/* Scene 5: Final title (48-60 seconds) */}
			<Sequence from={1152} durationInFrames={288}>
				<Scene5Final />
			</Sequence>
		</AbsoluteFill>
	);
};