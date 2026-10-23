-- Lead capture, agent sessions and lightweight events.
-- RLS: enabled on every table, NO policies for anon/authenticated => public cannot read or write.
-- All inserts happen from the server (Cloudflare Worker) with the service role key, which bypasses RLS.

create extension if not exists pgcrypto;

create type site_lead_source as enum ('whatsapp', 'form', 'agent');
create type site_audience_type as enum ('academia', 'company', 'executive');
create type site_lead_status as enum ('new', 'contacted', 'proposal_sent', 'won', 'lost');

create table public.site_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source site_lead_source not null,
  page text,
  audience_type site_audience_type,
  format text,
  group_size text,
  timeframe text,
  topic text,
  message text,
  name text,
  organization text,
  contact text,
  summary text,              -- short AI-written summary (need, audience, format, timing), filled in phase 2
  status site_lead_status not null default 'new',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text
);
create index site_leads_created_at_idx on public.site_leads (created_at desc);
create index site_leads_status_idx on public.site_leads (status);

create table public.site_agent_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prompt text not null,      -- anonymized: no name, contact or identifiers are collected with it
  outline text,
  page text,
  cache_hit boolean not null default false,
  ip_hash text,              -- truncated sha256, for abuse analysis only
  converted boolean not null default false
);
create index site_agent_sessions_created_at_idx on public.site_agent_sessions (created_at desc);

create table public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event text not null,
  page text,
  label text,
  referrer text,
  session_id uuid references public.site_agent_sessions (id) on delete set null
);
create index site_events_created_at_idx on public.site_events (created_at desc);
create index site_events_event_idx on public.site_events (event);

alter table public.site_leads enable row level security;
alter table public.site_agent_sessions enable row level security;
alter table public.site_events enable row level security;

-- Belt and braces: revoke everything from the public roles. Service role bypasses RLS and grants.
revoke all on public.site_leads, public.site_agent_sessions, public.site_events from anon, authenticated;

-- Topic research view: what visitors type into the hero agent, grouped by day.
create view public.site_agent_prompts_daily with (security_invoker = true) as
  select date_trunc('day', created_at) as day, count(*) as sessions, count(*) filter (where converted) as converted
  from public.site_agent_sessions group by 1 order by 1 desc;
revoke all on public.site_agent_prompts_daily from anon, authenticated;
