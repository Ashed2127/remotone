import { z } from 'zod';

// Base node schema with stable ID
const BaseNode = z.object({
  id: z.string().uuid(),
  type: z.string(),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
});

// Clip node
const ClipNode = BaseNode.extend({
  type: z.literal('clip'),
  assetId: z.string().uuid(),
  startX: z.number().optional(),
  startY: z.number().optional(),
  scale: z.number().positive().default(1),
  opacity: z.number().min(0).max(1).default(1),
  effects: z.array(z.string()).default([]),
});

// Transition node
const TransitionNode = BaseNode.extend({
  type: z.literal('transition'),
  transitionType: z.enum(['fade', 'slide', 'zoom', 'wipe']),
  duration: z.number().positive().default(1),
  fromClipId: z.string().uuid(),
  toClipId: z.string().uuid(),
});

// Text node
const TextNode = BaseNode.extend({
  type: z.literal('text'),
  content: z.string(),
  fontFamily: z.string().default('Arial'),
  fontSize: z.number().positive().default(24),
  color: z.string().default('#ffffff'),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  backgroundColor: z.string().optional(),
  animation: z.enum(['none', 'fadeIn', 'slideUp', 'typewriter']).default('none'),
});

// Audio cue node
const AudioCueNode = BaseNode.extend({
  type: z.literal('audio'),
  assetId: z.string().uuid(),
  volume: z.number().min(0).max(1).default(1),
  fadeIn: z.number().nonnegative().default(0),
  fadeOut: z.number().nonnegative().default(0),
  loop: z.boolean().default(false),
  soundType: z.enum(['synth', 'ambient', 'percussion', 'noise']).default('synth'),
  note: z.string().optional(),
  melody: z.array(z.string()).optional(),
});

// Union of all node types
const TimelineNode = z.discriminatedUnion('type', [
  ClipNode,
  TransitionNode,
  TextNode,
  AudioCueNode,
]);

// Timeline document schema
export const TimelineSchema = z.object({
  schemaVersion: z.string().default('1.0.0'),
  duration: z.number().positive(),
  fps: z.number().positive().default(30),
  resolution: z.object({
    width: z.number().positive().default(1920),
    height: z.number().positive().default(1080),
  }),
  nodes: z.array(TimelineNode),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  }).optional(),
});

// TypeScript types inferred from schema
export type TimelineNode = z.infer<typeof TimelineNode>;
export type ClipNode = z.infer<typeof ClipNode>;
export type TransitionNode = z.infer<typeof TransitionNode>;
export type TextNode = z.infer<typeof TextNode>;
export type AudioCueNode = z.infer<typeof AudioCueNode>;
export type Timeline = z.infer<typeof TimelineSchema>;

// Helper function to validate timeline
export function validateTimeline(data: unknown): Timeline {
  return TimelineSchema.parse(data);
}

// Helper function to generate JSON Schema
export function getTimelineJsonSchema() {
  return TimelineSchema;
}
