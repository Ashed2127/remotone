/**
 * Functional Core for Timeline Operations
 * 
 * Pure functions for timeline business logic. These functions are:
 * - Deterministic (same input = same output)
 * - Side-effect free
 * - Easy to test
 * - Easy for AI agents to understand and reason about
 */

import { z } from 'zod';
import { Timeline, TimelineNode, validateTimeline } from '@/types/timeline';

// ============================================================================
// TIMELINE VALIDATION
// ============================================================================

/**
 * Pure function to validate timeline structure
 */
export function validateTimelineStructure(timeline: unknown): { isValid: boolean; errors: string[] } {
  try {
    validateTimeline(timeline);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    return {
      isValid: false,
      errors: ['Unknown validation error']
    };
  }
}

/**
 * Pure function to check if timeline duration is within limits
 */
export function validateTimelineDuration(timeline: Timeline, maxDuration: number = 300): { isValid: boolean; error?: string } {
  if (timeline.duration <= 0) {
    return { isValid: false, error: 'Duration must be positive' };
  }
  
  if (timeline.duration > maxDuration) {
    return { isValid: false, error: `Duration exceeds maximum of ${maxDuration} seconds` };
  }
  
  return { isValid: true };
}

/**
 * Pure function to check if all nodes fit within timeline duration
 */
export function validateNodeTiming(timeline: Timeline): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const node of timeline.nodes) {
    const endTime = node.startTime + node.duration;
    
    if (node.startTime < 0) {
      errors.push(`Node ${node.id} has negative start time`);
    }
    
    if (node.duration <= 0) {
      errors.push(`Node ${node.id} has non-positive duration`);
    }
    
    if (endTime > timeline.duration) {
      errors.push(`Node ${node.id} extends beyond timeline duration (${endTime} > ${timeline.duration})`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Pure function to check for node overlaps
 */
export function detectNodeOverlaps(timeline: Timeline): { hasOverlaps: boolean; overlaps: Array<{ node1: string; node2: string; overlapAmount: number }> } {
  const overlaps: Array<{ node1: string; node2: string; overlapAmount: number }> = [];
  
  for (let i = 0; i < timeline.nodes.length; i++) {
    for (let j = i + 1; j < timeline.nodes.length; j++) {
      const node1 = timeline.nodes[i];
      const node2 = timeline.nodes[j];
      
      const node1End = node1.startTime + node1.duration;
      const node2End = node2.startTime + node2.duration;
      
      // Check for overlap
      if (node1.startTime < node2End && node2.startTime < node1End) {
        const overlapStart = Math.max(node1.startTime, node2.startTime);
        const overlapEnd = Math.min(node1End, node2End);
        const overlapAmount = overlapEnd - overlapStart;
        
        overlaps.push({
          node1: node1.id,
          node2: node2.id,
          overlapAmount
        });
      }
    }
  }
  
  return {
    hasOverlaps: overlaps.length > 0,
    overlaps
  };
}

// ============================================================================
// TIMELINE CALCULATIONS
// ============================================================================

/**
 * Pure function to calculate total timeline duration
 */
export function calculateTimelineDuration(nodes: TimelineNode[]): number {
  if (nodes.length === 0) return 0;
  
  return nodes.reduce((max, node) => {
    const endTime = node.startTime + node.duration;
    return Math.max(max, endTime);
  }, 0);
}

/**
 * Pure function to calculate node density (nodes per second)
 */
export function calculateNodeDensity(timeline: Timeline): number {
  if (timeline.duration === 0) return 0;
  return timeline.nodes.length / timeline.duration;
}

/**
 * Pure function to get nodes at a specific time
 */
export function getNodesAtTime(timeline: Timeline, time: number): TimelineNode[] {
  return timeline.nodes.filter(node => 
    time >= node.startTime && time < node.startTime + node.duration
  );
}

/**
 * Pure function to get nodes in a time range
 */
export function getNodesInRange(timeline: Timeline, startTime: number, endTime: number): TimelineNode[] {
  return timeline.nodes.filter(node => {
    const nodeStart = node.startTime;
    const nodeEnd = node.startTime + node.duration;
    return nodeStart < endTime && nodeEnd > startTime;
  });
}

// ============================================================================
// TIMELINE TRANSFORMATIONS
// ============================================================================

/**
 * Pure function to scale timeline duration
 */
export function scaleTimelineDuration(timeline: Timeline, scaleFactor: number): Timeline {
  if (scaleFactor <= 0) {
    throw new Error('Scale factor must be positive');
  }
  
  return {
    ...timeline,
    duration: timeline.duration * scaleFactor,
    nodes: timeline.nodes.map(node => ({
      ...node,
      startTime: node.startTime * scaleFactor,
      duration: node.duration * scaleFactor
    }))
  };
}

/**
 * Pure function to shift all nodes in time
 */
export function shiftTimelineNodes(timeline: Timeline, timeOffset: number): Timeline {
  return {
    ...timeline,
    nodes: timeline.nodes.map(node => ({
      ...node,
      startTime: node.startTime + timeOffset
    }))
  };
}

/**
 * Pure function to remove a node from timeline
 */
export function removeNode(timeline: Timeline, nodeId: string): Timeline {
  return {
    ...timeline,
    nodes: timeline.nodes.filter(node => node.id !== nodeId)
  };
}

/**
 * Pure function to add a node to timeline
 */
export function addNode(timeline: Timeline, node: TimelineNode): Timeline {
  return {
    ...timeline,
    nodes: [...timeline.nodes, node]
  };
}

/**
 * Pure function to update a node in timeline
 */
export function updateNode(timeline: Timeline, nodeId: string, updates: Partial<TimelineNode>): Timeline {
  return {
    ...timeline,
    nodes: timeline.nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    )
  };
}

/**
 * Pure function to reorder nodes
 */
export function reorderNodes(timeline: Timeline, nodeOrder: string[]): Timeline {
  const nodeMap = new Map(timeline.nodes.map(node => [node.id, node]));
  
  return {
    ...timeline,
    nodes: nodeOrder
      .map(id => nodeMap.get(id))
      .filter((node): node is TimelineNode => node !== undefined)
  };
}

// ============================================================================
// TIMELINE ANALYSIS
// ============================================================================

/**
 * Pure function to analyze timeline composition
 */
export function analyzeTimelineComposition(timeline: Timeline): {
  nodeTypes: Record<string, number>;
  totalNodes: number;
  averageNodeDuration: number;
  longestNode: { id: string; duration: number } | null;
  shortestNode: { id: string; duration: number } | null;
} {
  const nodeTypes: Record<string, number> = {};
  let totalDuration = 0;
  let longestNode: { id: string; duration: number } | null = null;
  let shortestNode: { id: string; duration: number } | null = null;
  
  for (const node of timeline.nodes) {
    // Count node types
    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    
    // Track duration stats
    totalDuration += node.duration;
    
    if (!longestNode || node.duration > longestNode.duration) {
      longestNode = { id: node.id, duration: node.duration };
    }
    
    if (!shortestNode || node.duration < shortestNode.duration) {
      shortestNode = { id: node.id, duration: node.duration };
    }
  }
  
  return {
    nodeTypes,
    totalNodes: timeline.nodes.length,
    averageNodeDuration: timeline.nodes.length > 0 ? totalDuration / timeline.nodes.length : 0,
    longestNode,
    shortestNode
  };
}

/**
 * Pure function to get timeline complexity score
 */
export function calculateTimelineComplexity(timeline: Timeline): {
  score: number;
  factors: {
    nodeCount: number;
    nodeTypeVariety: number;
    overlapComplexity: number;
    timingComplexity: number;
  };
} {
  const composition = analyzeTimelineComposition(timeline);
  const overlapDetection = detectNodeOverlaps(timeline);
  
  // Normalize factors to 0-1 range
  const nodeCount = Math.min(timeline.nodes.length / 50, 1); // Assume 50 nodes is complex
  const nodeTypeVariety = Object.keys(composition.nodeTypes).length / 4; // Assume 4 types is max
  const overlapComplexity = Math.min(overlapDetection.overlaps.length / 10, 1); // Assume 10 overlaps is complex
  const timingComplexity = calculateNodeDensity(timeline) / 5; // Assume 5 nodes per second is complex
  
  const score = (nodeCount + nodeTypeVariety + overlapComplexity + timingComplexity) / 4;
  
  return {
    score: Math.min(score, 1),
    factors: {
      nodeCount,
      nodeTypeVariety,
      overlapComplexity,
      timingComplexity
    }
  };
}

/**
 * Pure function to suggest timeline optimizations
 */
export function suggestTimelineOptimizations(timeline: Timeline): string[] {
  const suggestions: string[] = [];
  const composition = analyzeTimelineComposition(timeline);
  const overlapDetection = detectNodeOverlaps(timeline);
  const complexity = calculateTimelineComplexity(timeline);
  
  // Check for overlaps
  if (overlapDetection.hasOverlaps) {
    suggestions.push(`Found ${overlapDetection.overlaps.length} node overlaps. Consider adjusting timing.`);
  }
  
  // Check for high complexity
  if (complexity.score > 0.7) {
    suggestions.push('Timeline has high complexity. Consider simplifying node structure.');
  }
  
  // Check for node type imbalance
  const typeCounts = Object.values(composition.nodeTypes);
  if (typeCounts.length > 0) {
    const maxCount = Math.max(...typeCounts);
    const minCount = Math.min(...typeCounts);
    if (maxCount > minCount * 5) {
      suggestions.push('Timeline has imbalanced node types. Consider adding variety.');
    }
  }
  
  // Check for very short nodes
  if (composition.shortestNode && composition.shortestNode.duration < 0.5) {
    suggestions.push('Timeline contains very short nodes (< 0.5s). Consider combining or extending them.');
  }
  
  // Check for very long nodes
  if (composition.longestNode && composition.longestNode.duration > 30) {
    suggestions.push('Timeline contains very long nodes (> 30s). Consider breaking them into smaller segments.');
  }
  
  return suggestions;
}

// ============================================================================
// TIMELINE EXPORT/IMPORT
// ============================================================================

/**
 * Pure function to export timeline to compact format
 */
export function exportTimelineCompact(timeline: Timeline): string {
  return JSON.stringify(timeline);
}

/**
 * Pure function to import timeline from compact format
 */
export function importTimelineCompact(data: string): Timeline {
  try {
    const parsed = JSON.parse(data);
    return validateTimeline(parsed);
  } catch (error) {
    throw new Error('Invalid timeline data');
  }
}

/**
 * Pure function to convert timeline to human-readable summary
 */
export function timelineToSummary(timeline: Timeline): string {
  const composition = analyzeTimelineComposition(timeline);
  const complexity = calculateTimelineComplexity(timeline);
  
  const parts = [
    `Timeline: ${timeline.duration}s at ${timeline.fps}fps`,
    `Resolution: ${timeline.resolution.width}x${timeline.resolution.height}`,
    `Nodes: ${composition.totalNodes} (${Object.entries(composition.nodeTypes).map(([type, count]) => `${type}: ${count}`).join(', ')})`,
    `Complexity: ${(complexity.score * 100).toFixed(0)}%`
  ];
  
  return parts.join('\n');
}