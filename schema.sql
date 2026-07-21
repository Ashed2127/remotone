-- Organizations (multi-tenancy)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  clerk_org_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timelines (versioned with full snapshots)
CREATE TABLE IF NOT EXISTS timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  timeline_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(project_id, version)
);

-- Assets (metadata only, binaries in S3)
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  asset_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'audio', 'font'
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path VARCHAR(500) NOT NULL, -- S3 path
  cdn_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'ready', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Render Jobs
CREATE TABLE IF NOT EXISTS render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  timeline_id UUID NOT NULL REFERENCES timelines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  priority INTEGER DEFAULT 5,
  output_format VARCHAR(50) DEFAULT 'mp4',
  output_resolution VARCHAR(50) DEFAULT '1080p',
  output_duration DECIMAL(10, 2),
  output_size BIGINT,
  output_path VARCHAR(500),
  error_message TEXT,
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage Tracking (for Stripe metering)
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  render_job_id UUID NOT NULL REFERENCES render_jobs(id) ON DELETE CASCADE,
  stripe_invoice_item_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit VARCHAR(50) DEFAULT 'render_job',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_timelines_project_id ON timelines(project_id);
CREATE INDEX IF NOT EXISTS idx_timelines_org_id ON timelines(org_id);
CREATE INDEX IF NOT EXISTS idx_assets_org_id ON assets(org_id);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_org_id ON render_jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_project_id ON render_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);
CREATE INDEX IF NOT EXISTS idx_usage_records_org_id ON usage_records(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_render_job_id ON usage_records(render_job_id);

-- Row-level security policies (for multi-tenancy)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own org's data
CREATE POLICY org_isolation ON organizations
  FOR ALL
  USING (id IN (SELECT org_id FROM users WHERE clerk_user_id = current_setting('app.current_user_id')::text));

CREATE POLICY projects_org_isolation ON projects
  FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE clerk_user_id = current_setting('app.current_user_id')::text));

CREATE POLICY timelines_org_isolation ON timelines
  FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE clerk_user_id = current_setting('app.current_user_id')::text));

CREATE POLICY assets_org_isolation ON assets
  FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE clerk_user_id = current_setting('app.current_user_id')::text));

CREATE POLICY render_jobs_org_isolation ON render_jobs
  FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE clerk_user_id = current_setting('app.current_user_id')::text));

CREATE POLICY usage_records_org_isolation ON usage_records
  FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE clerk_user_id = current_setting('app.current_user_id')::text));
