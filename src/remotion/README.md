# Devin Marketing Video

A premium 15-second AI product marketing video created with Remotion and Tone.js.

## Features

- **4 Scenes** covering the Devin AI Software Engineer story
- **1080p HD** output at 30fps
- **16:9 aspect ratio** for professional presentation
- **Cinematic animations** with smooth transitions
- **Futuristic design** with dark UI and glowing effects
- **Dynamic audio** using Tone.js synthesis

## Video Structure

### Scene 1 (0-3 seconds): Introduction
- Dark futuristic background with glowing particles
- "Meet Devin" text with cinematic fade-in
- "The AI Software Engineer" subtitle

### Scene 2 (3-7 seconds): AI Workspace
- IDE-like interface with code animations
- Terminal showing automated build process
- "From idea to production" messaging

### Scene 3 (7-11 seconds): Capabilities
- Grid of task cards showing AI capabilities
- Writing code, fixing bugs, deploying apps, analyzing results
- Progress animations and smooth transitions

### Scene 4 (11-15 seconds): Hero Shot
- Devin logo with premium glow effects
- "Build faster with AI" call-to-action
- Cinematic zoom-out finale

## Usage

### Preview in Studio
```bash
npm run video:studio
```
This opens the Remotion Studio where you can:
- Preview the video in real-time
- Adjust timing and animations
- See the Tone.js audio in action

### Render Final Video
```bash
npm run video:render
```
This renders the final MP4 video file as `devin-marketing-video.mp4`

### Quick Preview Render
```bash
npm run video:preview
```
Renders a preview version for quick testing

## Technical Details

- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 FPS
- **Duration**: 15 seconds (450 frames)
- **Format**: MP4 (H.264)
- **Audio**: Tone.js synthesized cinematic soundtrack

## Dependencies

- Remotion 4.0.490
- React 19.2.7
- Tone.js 15.1.22
- TypeScript 6.0.3

## Customization

You can customize the video by editing:
- `src/remotion/DevinMarketingVideo.tsx` - Main video component and scenes
- `src/remotion/styles.css` - CSS animations and styles
- `src/remotion/Root.tsx` - Video configuration (resolution, FPS, duration)

## Audio

The audio is generated using Tone.js and features:
- Soft synth pads for ambient atmosphere
- Subtle bass line for depth
- Digital sound effects for transitions
- Rising intensity throughout the video
- Premium cinematic feel

Note: Audio is available in studio preview mode. For production renders, you may want to export the audio separately and add it in post-production for more control.