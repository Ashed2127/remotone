import { componentRegistry } from '../registry';
import { Clip, ClipSchema } from './Clip';
import { Transition, TransitionSchema } from './Transition';
import { TextOverlay as Text, TextSchema } from './Text';
import { AudioCue, AudioSchema } from './Audio';

// Register all components
componentRegistry.register('clip', {
  component: Clip,
  schema: ClipSchema,
  defaultProps: {
    scale: 1,
    opacity: 1,
    effects: [],
  },
});

componentRegistry.register('transition', {
  component: Transition,
  schema: TransitionSchema,
  defaultProps: {
    duration: 1,
  },
});

componentRegistry.register('text', {
  component: Text,
  schema: TextSchema,
  defaultProps: {
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    animation: 'none',
  },
});

componentRegistry.register('audio', {
  component: AudioCue,
  schema: AudioSchema,
  defaultProps: {
    volume: 1,
    fadeIn: 0,
    fadeOut: 0,
    loop: false,
  },
});

export { Clip, Transition, Text, AudioCue };
