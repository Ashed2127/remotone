Build an AI-driven video generation SaaS with the following architecture. Implement in this order — each stage depends on the one before it.

**Architecture:** Modular monolith for the core app, with an isolated async worker pool for rendering only (rendering is CPU/GPU-heavy and long-running; everything else shares data and doesn't need to be split out).

## Build Order

1. **Database Persistence Layer** — Postgres. Tables for users/orgs, projects, timelines (JSONB column, versioned), assets (metadata only), render jobs. Row-level `org_id` scoping for multi-tenancy. Redis for job/queue state.

2. **Timeline JSON Schema** — the canonical format every other module reads/writes. Define in TypeScript with Zod (generate JSON Schema from it, single source of truth). Include a `schemaVersion` field. Every node (clip, transition, audio cue) gets a stable `id`.

3. **Component Registry** — registry mapping `componentType` → render implementation, used by both live preview and final render. Use Remotion so the same React components serve preview and export (avoids preview/export mismatch). Each component declares its own prop schema validated against the Timeline JSON Schema.

4. **AI Scene Planning Engine** — takes a user prompt, calls Claude via the Messages API with structured/forced-JSON output to produce a Timeline JSON document. Validate output against the schema; on failure, feed the error back to the model for one repair retry before surfacing to the user. Support scoped edits (e.g. "make this clip longer") as partial regeneration, not full re-generation.

5. **Tone.js Audio Generation Pipeline** — interprets audio-cue nodes into scheduled audio. Flag: Tone.js is a browser/Web Audio API library — spike whether it runs reliably headless server-side (e.g. via a Web Audio polyfill) before committing; fallback is Tone.js for live preview only + a separate server-side audio renderer for final export.

6. **Asset Management System** — S3-compatible storage + CDN for binaries, Postgres for metadata only. Upload pipeline: validation, scanning, transcoding to normalize codecs/resolution. Timeline JSON references assets by stable ID, never raw URL.

7. **Background Rendering Queue** — Redis + BullMQ (or SQS if AWS-native) for job queue with retry/backoff and progress reporting to the frontend (WebSocket or webhook). Workers scale independently from the main app. Use Remotion server-side rendering for final output. Idempotent job design.

8. **Authentication and SaaS Billing** — auth via Clerk/Auth0 (don't hand-roll). Stripe for subscription billing + metered usage, metered by render jobs ("render credits" model). Usage table keyed to render job IDs, reported to Stripe on job completion.

## Decisions to confirm with me before or during build (don't guess on these):
- Timeline versioning: full snapshot per save vs. event-sourced diffs?
- Nested composition support (scenes-within-scenes) at MVP or later?
- Metering granularity: per render job, per second of output, or per compute-minute?
- AI-generated assets: same upload pipeline as user uploads, or a separate fast path?

## Non-negotiables
- Schema-first: lock DB schema, Timeline JSON Schema, and Component Registry before starting the AI planner, audio pipeline, or rendering queue.
- Validate all AI-generated Timeline JSON against the schema before it touches storage or rendering — never trust LLM output directly.
- Preview and final render must produce visually identical output — treat any divergence as a bug, not a known limitation.
