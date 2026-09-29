-- Lingofi durable cloud database
-- Run this in the Supabase SQL Editor once.
-- IMPORTANT: The service-role key is server-only and must never be placed in Vite/client env vars.

create table if not exists public.lingofi_data (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists lingofi_data_updated_at_idx
  on public.lingofi_data (updated_at desc);

alter table public.lingofi_data enable row level security;

-- Lingofi accesses this table through the server using the Supabase service-role key.
-- No public/browser policy is intentionally created.

comment on table public.lingofi_data is
  'Lingofi durable application database. Keys include users, test_results, ielts_database, full_tests and standardized_tests.';

comment on column public.lingofi_data.key is
  'Canonical Lingofi collection name.';

comment on column public.lingofi_data.data is
  'JSONB representation of the canonical Lingofi collection. The users collection contains password hashes, never plaintext passwords.';
