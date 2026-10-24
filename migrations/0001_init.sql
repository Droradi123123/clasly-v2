-- RealAI lead capture on Cloudflare D1 (SQLite).
-- The database is reachable only through the Worker binding `DB`; there is no public API,
-- so no row-level security is needed. Apply with: npx wrangler d1 migrations apply realai-leads --remote

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  source TEXT NOT NULL CHECK (source IN ('whatsapp', 'form', 'agent')),
  page TEXT,
  audience_type TEXT CHECK (audience_type IN ('academia', 'company', 'executive')),
  format TEXT,
  group_size TEXT,
  timeframe TEXT,
  topic TEXT,
  message TEXT,
  name TEXT,
  organization TEXT,
  contact TEXT,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'won', 'lost')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);

CREATE TABLE IF NOT EXISTS agent_sessions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  prompt TEXT NOT NULL,
  outline TEXT,
  page TEXT,
  cache_hit INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT,
  converted INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS agent_sessions_created_at_idx ON agent_sessions (created_at DESC);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event TEXT NOT NULL,
  page TEXT,
  label TEXT,
  referrer TEXT,
  session_id TEXT
);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_event_idx ON events (event);
