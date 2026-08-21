/**
 * Event Bus Implementation
 * 
 * Provides event-driven architecture support for CQRS pattern and AI agent traceability.
 * Uses Redis for distributed event streaming.
 */

import Redis from 'ioredis';
import { DomainEvent, EventCategories, EventCategory } from './event-types';

export interface EventHandler {
  eventType: string;
  handler: (event: DomainEvent) => Promise<void> | void;
}

export interface EventSubscription {
  id: string;
  categories: EventCategory[];
  eventTypes: string[];
  handler: EventHandler['handler'];
}

export class EventBus {
  private redis: Redis;
  private subscribers: Map<string, EventSubscription> = new Map();
  private localHandlers: Map<string, EventHandler[]> = new Map();
  private streamName: string = 'remotone:events';

  constructor(redis: Redis) {
    this.redis = redis;
  }

  /**
   * Publish an event to the event bus
   */
  async publish(event: DomainEvent): Promise<void> {
    try {
      // Add to Redis stream for distributed processing
      await this.redis.xadd(
        this.streamName,
        '*',
        'eventType', event.eventType,
        'eventId', event.eventId,
        'timestamp', event.timestamp,
        'data', JSON.stringify(event)
      );

      // Also process locally for immediate handlers
      await this.processLocalHandlers(event);
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  /**
   * Subscribe to specific event types
   */
  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => Promise<void> | void
  ): string {
    const subscriptionId = crypto.randomUUID();
    
    if (!this.localHandlers.has(eventType)) {
      this.localHandlers.set(eventType, []);
    }
    
    this.localHandlers.get(eventType)!.push({ eventType, handler });
    
    return subscriptionId;
  }

  /**
   * Subscribe to an entire category of events
   */
  subscribeToCategory(
    category: EventCategory,
    handler: (event: DomainEvent) => Promise<void> | void
  ): string {
    const subscriptionId = crypto.randomUUID();
    const eventTypes = EventCategories[category];
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      categories: [category],
      eventTypes,
      handler
    };
    
    this.subscribers.set(subscriptionId, subscription);
    
    // Subscribe to each event type in the category
    eventTypes.forEach(eventType => {
      this.subscribe(eventType, handler);
    });
    
    return subscriptionId;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscribers.get(subscriptionId);
    if (subscription) {
      subscription.eventTypes.forEach(eventType => {
        const handlers = this.localHandlers.get(eventType);
        if (handlers) {
          const index = handlers.findIndex(h => h.eventType === eventType);
          if (index !== -1) {
            handlers.splice(index, 1);
          }
        }
      });
      this.subscribers.delete(subscriptionId);
    }
  }

  /**
   * Process local event handlers
   */
  private async processLocalHandlers(event: DomainEvent): Promise<void> {
    const handlers = this.localHandlers.get(event.eventType);
    if (handlers) {
      await Promise.all(
        handlers.map(async ({ handler }) => {
          try {
            await handler(event);
          } catch (error) {
            console.error(`Error in handler for ${event.eventType}:`, error);
          }
        })
      );
    }
  }

  /**
   * Start consuming events from Redis stream
   */
  async startConsumer(consumerGroup: string = 'remotone-workers', consumerName: string = 'worker-1'): Promise<void> {
    try {
      // Create consumer group if it doesn't exist
      try {
        await this.redis.xgroup('CREATE', this.streamName, consumerGroup, '0', 'MKSTREAM');
      } catch (error: any) {
        if (error.message.includes('BUSYGROUP')) {
          // Group already exists, that's fine
        } else {
          throw error;
        }
      }

      // Start consuming
      while (true) {
        try {
          const events = await this.redis.xreadgroup(
            'GROUP',
            consumerGroup,
            consumerName,
            'COUNT',
            10,
            'BLOCK',
            5000,
            'STREAMS',
            this.streamName,
            '>'
          );

          if (events) {
            for (const [stream, entries] of events) {
              for (const [id, fields] of entries) {
                try {
                  const eventData = JSON.parse(fields.data as string);
                  await this.processLocalHandlers(eventData);
                  await this.redis.xack(this.streamName, consumerGroup, id);
                } catch (error) {
                  console.error('Error processing event from stream:', error);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error in consumer loop:', error);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Failed to start consumer:', error);
      throw error;
    }
  }

  /**
   * Read events from the stream (for replay/debugging)
   */
  async readEvents(count: number = 10, fromId: string = '0-0'): Promise<DomainEvent[]> {
    try {
      const result = await this.redis.xrevrange(
        this.streamName,
        '+',
        fromId,
        'COUNT',
        count
      );

      if (!result) return [];

      return result.map(([id, fields]) => {
        const eventData = JSON.parse(fields.data as string);
        return eventData as DomainEvent;
      });
    } catch (error) {
      console.error('Failed to read events:', error);
      return [];
    }
  }

  /**
   * Get event history for a specific correlation ID
   */
  async getEventHistory(correlationId: string): Promise<DomainEvent[]> {
    try {
      const allEvents = await this.readEvents(1000);
      return allEvents.filter(event => event.correlationId === correlationId);
    } catch (error) {
      console.error('Failed to get event history:', error);
      return [];
    }
  }

  /**
   * Clear old events from the stream
   */
  async trimEvents(maxLength: number = 10000): Promise<void> {
    try {
      await this.redis.xtrim(this.streamName, 'MAXLEN', '~', maxLength);
    } catch (error) {
      console.error('Failed to trim events:', error);
    }
  }
}

/**
 * Singleton instance for the application
 */
let eventBusInstance: EventBus | null = null;

export function getEventBus(redis: Redis): EventBus {
  if (!eventBusInstance) {
    eventBusInstance = new EventBus(redis);
  }
  return eventBusInstance;
}

/**
 * Helper function to create events with proper structure
 */
export function createEvent<T extends DomainEvent>(
  eventType: any,
  data: any,
  correlationId?: string,
  causationId?: string,
  userId?: string
): T {
  return {
    eventId: crypto.randomUUID(),
    eventType: eventType,
    timestamp: new Date().toISOString(),
    correlationId,
    causationId,
    userId,
    data,
    metadata: {}
  } as T;
}