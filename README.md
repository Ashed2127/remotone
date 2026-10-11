# Remotone

AI-driven video generation SaaS platform built with Next.js and Remotion. Transform text prompts into professional marketing videos with real-time preview and identical final rendering.

## Tech Stack

- Next.js 16, React 19, TypeScript
- Remotion 4 for video rendering
- Tailwind CSS, Framer Motion, GSAP, Three.js
- PostgreSQL, Redis, AWS S3
- Clerk auth, Stripe payments
- Anthropic Claude AI, Tone.js audio

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start Docker services (PostgreSQL, Redis, LocalStack)
docker-compose up -d

# Initialize database
npm run init-db

# Start development server
npm run dev
```

## Usage

### Development
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Video Rendering
- `npm run video:studio` - Open Remotion studio
- `npm run video:render` - Render a video composition
- `npm run video:preview` - Preview a video composition

### Background Processing
- `npm run worker` - Start background rendering worker

## Features

- AI-powered video generation from text prompts
- Real-time preview with Remotion
- Multiple video templates
- 3D graphics with Three.js
- Dynamic audio generation with Tone.js
- Scalable background rendering
- Multi-tenant architecture

## Documentation

- [Architecture](remotone.md)
- [AI Agent Integration](docs/AI_AGENT_INTEGRATION.md)

## License

ISC
