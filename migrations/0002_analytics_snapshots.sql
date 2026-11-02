-- Snapshots of Google Analytics 4 and Search Console reports, pulled by the Worker cron
-- (wrangler.jsonc, src/lib/analytics.ts). One row per source per run.
-- payload is the JSON report; error is set instead when the pull failed.

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  source TEXT NOT NULL CHECK (source IN ('ga4', 'gsc')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  payload TEXT,
  error TEXT
);
CREATE INDEX IF NOT EXISTS analytics_snapshots_source_idx ON analytics_snapshots (source, created_at DESC);
