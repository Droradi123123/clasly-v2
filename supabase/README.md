# Supabase

Apply `migrations/*.sql` to the project (Supabase MCP `apply_migration`, the SQL editor, or `supabase db push`).

Tables: `leads`, `agent_sessions`, `events`. RLS is on with no public policies: the only writer is the
Cloudflare Worker using `SUPABASE_SERVICE_ROLE_KEY` (set with `wrangler secret put`). The anon key is never used by this site.
