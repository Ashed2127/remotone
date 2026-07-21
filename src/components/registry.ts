import { Composition } from 'remotion';
import { z } from 'zod';
import type { TimelineNode } from '@/types/timeline';

// Component interface
export interface ComponentRenderer {
  component: React.ComponentType<any>;
  schema: z.ZodType<any>;
  defaultProps: any;
}

// Component registry
class ComponentRegistry {
  private components: Map<string, ComponentRenderer> = new Map();

  register(componentType: string, renderer: ComponentRenderer) {
    this.components.set(componentType, renderer);
  }

  get(componentType: string): ComponentRenderer | undefined {
    return this.components.get(componentType);
  }

  has(componentType: string): boolean {
    return this.components.has(componentType);
  }

  getAll(): Map<string, ComponentRenderer> {
    return this.components;
  }
}

// Global registry instance
export const componentRegistry = new ComponentRegistry();

// Schema validation helpers
export function validateComponentProps(
  componentType: string,
  props: unknown
): any {
  const renderer = componentRegistry.get(componentType);
  if (!renderer) {
    throw new Error(`Unknown component type: ${componentType}`);
  }
  return renderer.schema.parse(props);
}

// Helper to get Remotion composition from timeline node
export function getCompositionForNode(node: TimelineNode) {
  const renderer = componentRegistry.get(node.type);
  if (!renderer) {
    throw new Error(`No renderer registered for node type: ${node.type}`);
  }
  return {
    component: renderer.component,
    durationInFrames: node.duration * 30, // Assuming 30fps
    props: node,
  };
}
