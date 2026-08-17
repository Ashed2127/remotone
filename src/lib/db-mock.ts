// Mock database for testing without external services
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const storage = {
  organizations: new Map<string, any>(),
  users: new Map<string, any>(),
  projects: new Map<string, any>(),
  timelines: new Map<string, any>(),
  assets: new Map<string, any>(),
  renderJobs: new Map<string, any>(),
  usageRecords: new Map<string, any>(),
};

// Mock pool
export const pool = {
  query: async (text: string, params?: any[]) => {
    console.log('Mock DB Query:', text, params);
    
    // Simple query parser for basic operations
    if (text.includes('INSERT INTO organizations')) {
      const id = uuidv4();
      const org = { id, name: params?.[1], clerk_org_id: params?.[0] || null };
      storage.organizations.set(id, org);
      return { rows: [org] };
    }
    
    if (text.includes('INSERT INTO users')) {
      const id = uuidv4();
      const user = { id, clerk_user_id: params?.[0], email: params?.[1], org_id: params?.[2] || null };
      storage.users.set(id, user);
      return { rows: [user] };
    }
    
    if (text.includes('INSERT INTO projects')) {
      const id = uuidv4();
      const project = { id, org_id: params?.[0], user_id: params?.[1], name: params?.[2] };
      storage.projects.set(id, project);
      return { rows: [project] };
    }
    
    if (text.includes('INSERT INTO timelines')) {
      const id = uuidv4();
      const timeline = { id, project_id: params?.[0], org_id: params?.[1], version: params?.[2], timeline_data: params?.[3] };
      storage.timelines.set(id, timeline);
      return { rows: [timeline] };
    }
    
    if (text.includes('INSERT INTO render_jobs')) {
      const id = params?.[0];
      const job = { 
        id, 
        org_id: params?.[1], 
        project_id: params?.[2], 
        timeline_id: params?.[3], 
        user_id: params?.[4],
        status: 'pending',
        output_format: params?.[5],
        output_resolution: params?.[6]
      };
      storage.renderJobs.set(id, job);
      return { rows: [job] };
    }
    
    if (text.includes('SELECT * FROM timelines WHERE id =')) {
      const timeline = storage.timelines.get(params?.[0]);
      console.log('Mock DB: Looking for timeline', params?.[0], 'found:', !!timeline);
      return { rows: timeline ? [timeline] : [] };
    }
    
    if (text.includes('SELECT timeline_data FROM timelines WHERE id =')) {
      const timeline = storage.timelines.get(params?.[0]);
      console.log('Mock DB: Looking for timeline_data', params?.[0], 'found:', !!timeline);
      if (timeline) {
        return { rows: [{ timeline_data: timeline.timeline_data }] };
      }
      return { rows: [] };
    }
    
    if (text.includes('SELECT * FROM render_jobs WHERE id =')) {
      const job = storage.renderJobs.get(params?.[0]);
      return { rows: job ? [job] : [] };
    }
    
    if (text.includes('SELECT * FROM render_jobs WHERE org_id =')) {
      const jobs = Array.from(storage.renderJobs.values()).filter(j => j.org_id === params?.[0]);
      return { rows: jobs };
    }
    
    if (text.includes('UPDATE render_jobs')) {
      const job = storage.renderJobs.get(params?.[params?.length - 1]);
      if (job) {
        // Handle complex UPDATE with dynamic fields
        Object.assign(job, { status: params?.[0], progress: params?.[1] });
        // Handle additional fields if present
        if (params && params.length > 2) {
          const additionalFields: Record<string, any> = {};
          // The parameters are dynamic based on what fields are being updated
          // This is a simplified version - in reality you'd need to parse the SQL
          if (text.includes('output_path')) {
            additionalFields['output_path'] = params?.[2];
          }
          if (text.includes('output_duration')) {
            additionalFields['output_duration'] = params?.[3];
          }
          if (text.includes('output_size')) {
            additionalFields['output_size'] = params?.[4];
          }
          if (text.includes('error_message')) {
            additionalFields['error_message'] = params?.[5];
          }
          Object.assign(job, additionalFields);
        }
        storage.renderJobs.set(job.id, job);
      }
      return { rows: [] };
    }
    
    if (text.includes('SELECT COALESCE(MAX(version)')) {
      const timelines = Array.from(storage.timelines.values()).filter(t => t.project_id === params?.[0]);
      const maxVersion = timelines.length > 0 ? Math.max(...timelines.map(t => t.version)) : 0;
      return { rows: [{ next_version: maxVersion + 1 }] };
    }
    
    // Default empty response
    return { rows: [] };
  },
  end: async () => {
    console.log('Mock DB connection closed');
  }
};

// Mock Redis
export const redis = {
  set: async (key: string, value: string) => {
    console.log('Mock Redis SET:', key, value);
    return 'OK';
  },
  get: async (key: string) => {
    console.log('Mock Redis GET:', key);
    return null;
  },
  del: async (key: string) => {
    console.log('Mock Redis DEL:', key);
    return 1;
  },
  disconnect: async () => {
    console.log('Mock Redis disconnected');
  },
  // Add methods needed by bullmq
  duplicate: () => redis,
  on: (event: string, callback: Function) => {
    console.log('Mock Redis on:', event);
  }
};

// Helper to get storage data for testing
export function getStorage() {
  return storage;
}

// Helper to clear storage for testing
export function clearStorage() {
  storage.organizations.clear();
  storage.users.clear();
  storage.projects.clear();
  storage.timelines.clear();
  storage.assets.clear();
  storage.renderJobs.clear();
  storage.usageRecords.clear();
}
