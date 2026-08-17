# Remotone

An AI-driven video generation SaaS platform built with Next.js, Remotion, and various animation libraries.

## Project Overview

Remotone is a modular monolith application for generating marketing videos using AI. It combines React-based video composition with Remotion for both live preview and final rendering, ensuring identical output between preview and export.

## Tech Stack

- **Framework**: Next.js 16.2.10 with React 19.2.7
- **Language**: TypeScript 6.0.3
- **Video Rendering**: Remotion 4.0.490
- **Styling**: Tailwind CSS 4.3.3, Bootstrap 5.3.8
- **Animation**: Framer Motion, GSAP, Anime.js, React Spring
- **3D Graphics**: Three.js, React Three Fiber, Drei, Postprocessing
- **Database**: PostgreSQL 15 (via Docker)
- **Cache/Queue**: Redis 7 (via Docker)
- **Storage**: AWS S3 (LocalStack for development)
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI**: Anthropic Claude SDK
- **Audio**: Tone.js, Howler.js

## Project Structure

```
remotone/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── render/           # Video rendering endpoints
│   │   │   │   ├── [id]/         # Render job status
│   │   │   │   └── status/       # Status checking
│   │   │   ├── timeline/         # Timeline generation
│   │   │   │   └── generate/     # AI-powered timeline creation
│   │   │   └── videos/           # Video management
│   │   │       ├── [id]/         # Individual video operations
│   │   │       └── latest/       # Latest videos endpoint
│   │   ├── dashboard/            # Dashboard page
│   │   ├── video/                # Video editor/viewer page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   │
│   ├── components/               # React components
│   │   ├── registry.ts           # Component registry for video rendering
│   │   └── remotion/             # Remotion-specific components
│   │       ├── index.ts          # Remotion component exports
│   │       ├── AdvancedParticleSystem.tsx
│   │       ├── Transition.tsx    # Transition effects
│   │       ├── Text.tsx          # Text components
│   │       ├── CinematicAudio.tsx
│   │       ├── CinematicTransitions.tsx
│   │       ├── Clip.tsx          # Video clip components
│   │       └── Audio.tsx         # Audio components
│   │
│   ├── remotion/                 # Remotion video compositions
│   │   ├── index.ts              # Remotion entry point
│   │   ├── Root.tsx              # Root composition
│   │   ├── scenes/               # Reusable scenes
│   │   ├── DevinMarketingVideo.tsx
│   │   ├── AuraMotionVideo.tsx
│   │   ├── DevinHyperMotionVideo.tsx
│   │   ├── DevinInActionVideo.tsx
│   │   ├── DevinInActionVideoMobile.tsx
│   │   ├── AppkitMotionVideo.tsx
│   │   ├── SaveOpenAIVideo.tsx
│   │   ├── ChatGPTPromoVideo.tsx
│   │   ├── ChatGPTLaunchVideo.tsx
│   │   ├── ChatGPTCinematicLaunch.tsx
│   │   ├── EnhancedVideo.tsx
│   │   ├── ThreeMotionVideo.tsx
│   │   ├── styles.css            # Global styles
│   │   ├── chatgpt-styles.css    # ChatGPT specific styles
│   │   └── README.md             # Remotion documentation
│   │
│   ├── lib/                      # Utility libraries
│   ├── types/                    # TypeScript type definitions
│   │   ├── three-jsx.d.ts        # Three.js JSX types
│   │   └── timeline.ts           # Timeline type definitions
│   │
│   ├── scripts/                  # Utility scripts
│   │   ├── init-db.ts            # Database initialization
│   │   └── worker.ts             # Background worker for rendering
│   │
│   └── public/                   # Static assets
│
├── .devin/                       # Devin CLI configuration
├── .next/                        # Next.js build output
├── node_modules/                 # Dependencies
├── sample-video/                 # Sample video files
├── scripts/                      # Additional scripts
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables
├── .gitignore                    # Git ignore rules
├── docker-compose.yml            # Docker services configuration
├── next.config.js                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript definitions
├── package.json                  # Project dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── remotion.config.ts            # Remotion configuration
├── schema.sql                    # Database schema
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── remotone.md                   # Project architecture documentation
```

## Available Scripts

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run init-db` - Initialize database schema

### Background Processing
- `npm run worker` - Start background worker for rendering

### Video Rendering (Remotion)
- `npm run video:studio` - Open Remotion studio
- `npm run video:render` - Render Devin marketing video
- `npm run video:preview` - Preview Devin marketing video
- `npm run video:auramotion:render` - Render Aura motion video
- `npm run video:auramotion:preview` - Preview Aura motion video
- `npm run video:hypermotion:render` - Render Devin hypermotion video
- `npm run video:hypermotion:preview` - Preview Devin hypermotion video
- `npm run video:inaction:render` - Render Devin in-action video
- `npm run video:inaction:preview` - Preview Devin in-action video
- `npm run video:inaction:mobile:render` - Render mobile version
- `npm run video:inaction:mobile:preview` - Preview mobile version
- `npm run video:appkit:render` - Render AppKit motion video
- `npm run video:appkit:preview` - Preview AppKit motion video
- `npm run video:saveopenai:render` - Render Save OpenAI video
- `npm run video:saveopenai:preview` - Preview Save OpenAI video
- `npm run video:chatgpt:render` - Render ChatGPT promo video
- `npm run video:chatgpt:preview` - Preview ChatGPT promo video
- `npm run video:chatgpt:launch:render` - Render ChatGPT launch video
- `npm run video:chatgpt:launch:preview` - Preview ChatGPT launch video
- `npm run video:chatgpt:cinematic:render` - Render ChatGPT cinematic launch
- `npm run video:chatgpt:cinematic:preview` - Preview ChatGPT cinematic launch
- `npm run video:enhanced:render` - Render enhanced video
- `npm run video:enhanced:preview` - Preview enhanced video
- `npm run video:3dmotion:render` - Render 3D motion video
- `npm run video:3dmotion:preview` - Preview 3D motion video

## Infrastructure

### Docker Services
The project uses Docker Compose to run essential services:

- **PostgreSQL**: Database for persistent data (port 5432)
- **Redis**: Cache and job queue (port 6379)
- **LocalStack**: AWS S3-compatible storage for development (port 4566)

Start services:
```bash
docker-compose up -d
```

Stop services:
```bash
docker-compose down
```

## Architecture

The project follows a modular monolith architecture with:

1. **Database Persistence Layer**: PostgreSQL for users, projects, timelines, assets, and render jobs
2. **Timeline JSON Schema**: TypeScript with Zod validation for video timeline structure
3. **Component Registry**: Maps component types to render implementations using Remotion
4. **AI Scene Planning Engine**: Uses Claude API to generate video timelines from prompts
5. **Audio Generation Pipeline**: Tone.js for audio interpretation and generation
6. **Asset Management System**: S3-compatible storage with CDN support
7. **Background Rendering Queue**: Redis + BullMQ for async video rendering
8. **Authentication & Billing**: Clerk for auth, Stripe for subscriptions and usage metering

## Key Features

- **AI-Powered Video Generation**: Transform text prompts into video timelines
- **Real-time Preview**: Live preview using Remotion
- **Multiple Video Templates**: Pre-built templates for various use cases
- **3D Graphics**: Three.js integration for advanced visual effects
- **Audio Integration**: Tone.js for dynamic audio generation
- **Scalable Rendering**: Background worker pool for CPU/GPU-intensive rendering
- **Multi-tenancy**: Organization-based data isolation

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Start Docker services:
```bash
docker-compose up -d
```

4. Initialize database:
```bash
npm run init-db
```

5. Start development server:
```bash
npm run dev
```

## Video Compositions

The project includes multiple video composition templates:

- **DevinMarketingVideo**: Main marketing video for Devin
- **AuraMotionVideo**: Aura-themed motion graphics
- **DevinHyperMotionVideo**: High-motion Devin promotional video
- **DevinInActionVideo**: Devin in-action demonstration
- **DevinInActionVideoMobile**: Mobile-optimized version
- **AppkitMotionVideo**: AppKit promotional video
- **SaveOpenAIVideo**: Save OpenAI campaign video
- **ChatGPTPromoVideo**: ChatGPT promotional content
- **ChatGPTLaunchVideo**: ChatGPT launch video
- **ChatGPTCinematicLaunch**: Cinematic ChatGPT launch
- **EnhancedVideo**: Enhanced effects video
- **ThreeMotionVideo**: 3D motion graphics video

## AI Agent Integration

Remotone is designed to be easily integrated with AI agents, allowing developers to use it as a motion design engine for automated video generation.

### Quick Start for AI Agents

```typescript
import { createRemotoneAgent } from './sdk/agent-sdk';

const agent = createRemotoneAgent({
  baseUrl: 'http://localhost:3000'
});

// Generate a video from a text prompt
const result = await agent.generateVideo({
  prompt: 'Create a 30-second promotional video for a new coffee brand',
  specifications: {
    duration: 30,
    style: 'professional',
    resolution: '1080p'
  },
  options: {
    autoRender: true
  }
});
```

### AI Agent Features

- **Simple API**: Clean, intuitive interface designed for AI agents
- **Natural Language Processing**: Generate videos from text descriptions
- **Brand Integration**: Apply brand guidelines automatically
- **Asset Management**: Integrate custom images, videos, and audio
- **Error Handling**: Comprehensive error messages with actionable suggestions
- **Progress Monitoring**: Real-time render job progress tracking
- **Webhook Support**: Notifications when rendering completes
- **Rate Limiting**: Built-in rate limiting and retry logic

### Agent SDK

The Remotone Agent SDK provides:

- `generateVideo()` - Generate videos from prompts
- `generateProductVideo()` - Specialized product promotion videos
- `generateSocialVideo()` - Platform-optimized social media videos
- `generateTutorialVideo()` - Step-by-step tutorial videos
- `waitForRender()` - Monitor render progress
- `getCapabilities()` - Query system capabilities

### Documentation

For detailed AI agent integration documentation, see <ref_file file="/home/ashed/Desktop/remotone/docs/AI_AGENT_INTEGRATION.md" />.

### API Endpoints for Agents

- `POST /api/agent/generate` - Generate video timelines
- `GET /api/agent/capabilities` - Get system capabilities
- `GET /api/render?id={jobId}` - Check render status

## Documentation

For detailed architecture information, see <ref_file file="/home/ashed/Desktop/remotone/remotone.md" />.

For AI agent integration guide, see <ref_file file="/home/ashed/Desktop/remotone/docs/AI_AGENT_INTEGRATION.md" />.

## License

ISC
