import {Composition, Sequence, useCurrentFrame, useVideoConfig, AbsoluteFill, Audio} from 'remotion';
import {Scene1CursorExplosion} from './scenes/Scene1CursorExplosion';
import {Scene2GalaxyDive} from './scenes/Scene2GalaxyDive';
import {Scene3NeuralNetwork} from './scenes/Scene3NeuralNetwork';
import {Scene4WorldBrain} from './scenes/Scene4WorldBrain';
import {Scene5TextGlitch} from './scenes/Scene5TextGlitch';
import {Scene6LogoZoom} from './scenes/Scene6LogoZoom';
import {Scene7FinalLogo} from './scenes/Scene7FinalLogo';

export const SaveOpenAIVideo: React.FC = () => {
	const {fps} = useVideoConfig();
	
	// 20 seconds at 30fps = 600 frames total
	// Scene 1: 0:00-0:03 = 90 frames
	// Scene 2: 0:03-0:06 = 90 frames  
	// Scene 3: 0:06-0:09 = 90 frames
	// Scene 4: 0:09-0:12 = 90 frames
	// Scene 5: 0:12-0:16 = 120 frames
	// Scene 6: 0:16-0:19 = 90 frames
	// Scene 7: 0:19-0:20 = 30 frames
	
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence from={0} durationInFrames={90}>
				<Scene1CursorExplosion />
			</Sequence>
			
			<Sequence from={90} durationInFrames={90}>
				<Scene2GalaxyDive />
			</Sequence>
			
			<Sequence from={180} durationInFrames={90}>
				<Scene3NeuralNetwork />
			</Sequence>
			
			<Sequence from={270} durationInFrames={90}>
				<Scene4WorldBrain />
			</Sequence>
			
			<Sequence from={360} durationInFrames={120}>
				<Scene5TextGlitch />
			</Sequence>
			
			<Sequence from={480} durationInFrames={90}>
				<Scene6LogoZoom />
			</Sequence>
			
			<Sequence from={570} durationInFrames={30}>
				<Scene7FinalLogo />
			</Sequence>
		</AbsoluteFill>
	);
};