export default function VideoPage() {
	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
			padding: '20px',
		}}>
			<h1 style={{
				color: '#ffffff',
				fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
				fontSize: '48px',
				fontWeight: 700,
				marginBottom: '20px',
				textAlign: 'center',
			}}>
				Devin Marketing Video
			</h1>
			<p style={{
				color: 'rgba(255, 255, 255, 0.7)',
				fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
				fontSize: '18px',
				marginBottom: '40px',
				textAlign: 'center',
			}}>
				Premium 15-second AI product marketing video
			</p>
			<div style={{
				maxWidth: '100%',
				width: '1080px',
				boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
				borderRadius: '12px',
				overflow: 'hidden',
			}}>
				<video
					src="/devin-marketing-video.mp4"
					controls
					autoPlay
					loop
					style={{
						width: '100%',
						height: 'auto',
						display: 'block',
					}}
				/>
			</div>
			<div style={{
				marginTop: '40px',
				textAlign: 'center',
			}}>
				<p style={{
					color: 'rgba(255, 255, 255, 0.5)',
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					fontSize: '14px',
				}}>
					Video Specifications: 1080p • 30 FPS • 15 seconds • 16:9 aspect ratio
				</p>
			</div>
		</div>
	);
}