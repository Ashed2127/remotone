import {Composition} from 'remotion';
import {DevinMarketingVideo} from './DevinMarketingVideo';
import {AuraMotionVideo} from './AuraMotionVideo';
import {DevinHyperMotionVideo} from './DevinHyperMotionVideo';
import {DevinInActionVideo} from './DevinInActionVideo';
import {AppkitMotionVideo} from './AppkitMotionVideo';
import {SaveOpenAIVideo} from './SaveOpenAIVideo';
import {ChatGPTPromoVideo} from './ChatGPTPromoVideo';
import EnhancedVideo from './EnhancedVideo';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="DevinMarketingVideo"
				component={DevinMarketingVideo}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="AuraMotionVideo"
				component={AuraMotionVideo}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="DevinHyperMotionVideo"
				component={DevinHyperMotionVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="DevinInActionVideo"
				component={DevinInActionVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="DevinInActionVideoMobile"
				component={DevinInActionVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1080}
				height={1920} // 9:16 aspect ratio for mobile
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="AppkitMotionVideo"
				component={AppkitMotionVideo}
				durationInFrames={1440} // 60 seconds at 24fps
				fps={24}
				width={1280}
				height={720} // 16:9 aspect ratio
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="SaveOpenAIVideo"
				component={SaveOpenAIVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="ChatGPTPromoVideo"
				component={ChatGPTPromoVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="EnhancedVideo"
				component={EnhancedVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					assets: [],
					brandName: 'Your Brand',
					tagline: 'Your Tagline',
					website: 'https://yourbrand.com',
					brandColors: ['#667eea', '#764ba2'],
					mood: 'professional',
					style: 'cinematic',
					duration: 20,
					features: [],
					metrics: [],
					socialLinks: [],
				}}
			/>
		</>
	);
};