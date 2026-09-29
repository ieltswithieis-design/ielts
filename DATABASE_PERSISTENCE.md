# Lingofi database persistence

The application keeps the existing JSON database structure so the current data remains intact, but it now supports a durable Supabase mirror.

## Production setup

1. Create/open the Supabase project used by Lingofi.
2. Run `supabase/migrations/20260927_lingofi_cloud_database.sql` once in the Supabase SQL editor. (The older 20260926 migration creates the same table and is not required if this newer migration has been run.)
3. Configure these **server-side** environment variables: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` to Vite/client-side environment variables.
5. Restart/redeploy the server. On startup, Lingofi hydrates its local working JSON files from the durable Supabase copy; every database edit is mirrored back to Supabase.

For deployments with a persistent disk instead of Supabase, set `LINGOFI_DATA_DIR` to the persistent mounted directory.

If the Supabase variables are absent, the existing local JSON database continues to work; the original database files are not deleted or regenerated during startup.


## Complete database import/export contract

The canonical database bundle is `lingofi-complete-test-database`. Export creates one JSON bundle containing IELTS modular tests, full IELTS mocks, and every standardized exam/package collection. Import validates the whole bundle before replacing the three canonical database files, so a failed import leaves the previous database intact.

The importer accepts any semantic version in `meta.version` while requiring the canonical bundle format. This allows future exports to remain importable without changing the stored test records.

The supplied 2026-09-26 database contains 200 IELTS Reading, Listening, Writing, and Speaking tests, 200 full IELTS mocks, and 200 packages for each PTE, SAT, GRE, GMAT, TOEFL, and ACT collection. The application reads counts dynamically; no fixed test-count is assumed by the UI.


## What is stored in Supabase

When the two server-side variables are configured, Lingofi mirrors these canonical collections into `public.lingofi_data`: `users` (login/signup records and password hashes), `test_results`, `ielts_database`, `full_tests`, and `standardized_tests`. New signups, successful logins/activity timestamps, test results, Director database edits/imports, manual deletions, and the 30-day candidate retention cleanup are written back to Supabase automatically.

The browser never receives the Supabase service-role key. The Director export remains password-free.
