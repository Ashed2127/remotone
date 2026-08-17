import {Composition} from 'remotion';
import {DevinMarketingVideo} from './DevinMarketingVideo';
import {AuraMotionVideo} from './AuraMotionVideo';
import {DevinHyperMotionVideo} from './DevinHyperMotionVideo';
import {DevinInActionVideo} from './DevinInActionVideo';
import {AppkitMotionVideo} from './AppkitMotionVideo';
import {SaveOpenAIVideo} from './SaveOpenAIVideo';
import {ChatGPTPromoVideo} from './ChatGPTPromoVideo';
import {ChatGPTLaunchVideo} from './ChatGPTLaunchVideo';
import {ChatGPTCinematicLaunch} from './ChatGPTCinematicLaunch';
import EnhancedVideo from './EnhancedVideo';
import {ThreeMotionVideo} from './ThreeMotionVideo';
import RemotoneTestVideo from './RemotoneTestVideo';
import IntegrationTutorialVideo from './IntegrationTutorialVideo';
import ProfessionalIntegrationTutorial from './ProfessionalIntegrationTutorial';
import ProfessionalVideoEditorDemo from './ProfessionalVideoEditorDemo';
import ProfessionalVideoEditorDemoWithAudio from './ProfessionalVideoEditorDemoWithAudio';

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
				id="ChatGPTLaunchVideo"
				component={ChatGPTLaunchVideo}
				durationInFrames={600} // 20 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="ChatGPTCinematicLaunch"
				component={ChatGPTCinematicLaunch}
				durationInFrames={450} // 15 seconds at 30fps
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
			<Composition
				id="ThreeMotionVideo"
				component={ThreeMotionVideo}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					// Add any default props here
				}}
			/>
			<Composition
				id="RemotoneTestVideo"
				component={RemotoneTestVideo}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					title: 'Remotone Test Video',
					subtitle: 'AI-Powered Motion Design Engine',
					brandColor: '#667eea',
					secondaryColor: '#764ba2',
				}}
			/>
			<Composition
				id="IntegrationTutorialVideo"
				component={IntegrationTutorialVideo}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					productName: 'EcoBottle Pro',
					productDescription: 'A sustainable water bottle made from recycled materials',
					developerName: 'Developer',
					brandColor: '#667eea',
					secondaryColor: '#764ba2',
					codeColor: '#1e1e1e',
					textColor: '#ffffff',
				}}
			/>
			<Composition
				id="ProfessionalIntegrationTutorial"
				component={ProfessionalIntegrationTutorial}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					productName: 'EcoBottle Pro',
					productDescription: 'A sustainable water bottle made from recycled materials',
					brandColor: '#667eea',
					secondaryColor: '#764ba2',
					accentColor: '#00d4ff',
				}}
			/>
			<Composition
				id="ProfessionalVideoEditorDemo"
				component={ProfessionalVideoEditorDemo}
				durationInFrames={450} // 15 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					productName: 'Remotone',
					tagline: 'AI-Powered Motion Design Engine',
					brandColor: '#667eea',
					secondaryColor: '#764ba2',
					accentColor: '#00d4ff',
				}}
			/>
			<Composition
				id="ProfessionalVideoEditorDemoWithAudio"
				component={ProfessionalVideoEditorDemoWithAudio}
				durationInFrames={690} // 23 seconds at 30fps (extended for smooth transitions)
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					productName: 'Remotone',
					tagline: 'AI-Powered Motion Design Engine',
					brandColor: '#667eea',
					secondaryColor: '#764ba2',
					accentColor: '#00d4ff',
				}}
			/>
		</>
	);
};