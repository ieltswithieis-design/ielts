-- Lingofi durable application database mirror.
-- Run this once in the Supabase SQL editor, then set SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY on the server. The application keeps its JSON
-- structure but stores each canonical collection in durable Postgres JSONB.
create table if not exists public.lingofi_data (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.lingofi_data enable row level security;
-- The server uses the service-role key; no browser policy is required.
