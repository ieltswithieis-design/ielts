<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a564df78-71b6-443f-9641-5d22e2588288

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Director database workflow

The live database is intentionally **Director-only**. Students and teachers do not see database controls.

1. Open Lingofi while logged out.
2. Log in with the Director/admin account when database maintenance is required.
3. Open **Director Database**.
4. Use **Export Complete Database** to download the single canonical JSON backup.
5. Give that complete JSON to an AI with this instruction:

> Modify this Lingofi database only. Preserve every existing record unless I explicitly ask you to change or delete it. Keep the complete Lingofi database structure. Return the complete JSON, not a partial extract. Validate all IELTS Reading, Listening, Writing and Speaking records, all full mocks, and all standardized-exam packages before returning the file.

6. Save the AI response as JSON and use **Import Complete Database**.
7. Import is replace-mode and is validated before the live database is changed. Always keep the previous export as a backup.

There are no database editing controls for students or teachers. Ordinary database changes are made through the exported JSON and imported back as the complete master database.

## Language rule

Changing the interface language is immediate and does not require leaving the current test. Exam content remains English: Reading passages/questions, Listening scripts/questions/audio, Writing tasks, and Speaking/interview questions. Only interface instructions, buttons, navigation, menus, and system UI text are localized.

## Session rule

The site starts logged out on a fresh page load. Authentication is session-only and is not restored from persistent local storage.

## Director leads and account credentials

- Registration requires name, email, WhatsApp number, and password.
- WhatsApp is stored exactly as entered; no phone-number pattern validation is applied.
- Candidate contact/sign-up records can be downloaded by the Director as Excel-compatible CSV or JSON; the complete Director database export also includes a password-free `studentSignups` collection for backup/reporting. Individual/all candidate accounts can be deleted.
- Plaintext passwords are never stored, displayed, or exported. The server stores a one-way password representation only.
- Director-only lead/database actions use server-side session tokens. Client-supplied email headers are not trusted for authorization.
- Students and teachers do not receive the Director Database or Director Leads controls.

## Standardized exam content quality

- Non-IELTS exam questions are stored in `database/tests/standardized_tests.json` and mirrored to `public/standardized_tests.json` for offline fallback.
- Learner-facing generated text such as `Context:`, `Original variant`, `unique item`, and `Practice variation` is removed before delivery.
- Prompts use short, clear instructions where the task format allows it.
- Every standardized question has `id`, `type`, `prompt`, `correctAnswer`, and `explanation` fields.
- Choice questions are checked so the correct answer exists in the displayed options.
- All 1,200 standardized packages are audited before release: 200 each for PTE, SAT, GRE, GMAT, TOEFL, and ACT.
- The runner supports single choice, multiple choice, written responses, spoken responses, fill-in tasks, paragraph ordering, and highlight-incorrect-word tasks.
- Listening and speaking speech uses English exam content; interface language does not translate exam questions.

## Student signup data and 30-day retention

- Candidate signup records are stored in `database/users.json` and include the signup fields collected by the portal: name, email, WhatsApp number, target IELTS band, role, creation time, last activity time, and last login time.
- Plaintext passwords are never stored or exported; only a one-way password representation is kept for authentication.
- The Director can export current signup data as an Excel-compatible UTF-8 CSV or JSON from Director Leads.
- Candidate accounts are automatically deleted after **30 days with no recorded activity**. The server checks at startup and every hour thereafter. Director/Admin and Teacher accounts are excluded from this automatic candidate cleanup.
- When Supabase cloud persistence is configured, the cleaned `users` collection is written back to the durable cloud record as well.
## Director login recovery

The seeded Director account is `admin@lingofi.org` with password `admin123`. The server includes a one-time migration that repairs the known seeded password-hash mismatch from the previous retention build after cloud data hydration. It only repairs the known seeded Director record and does not reset other administrator passwords.



## Supabase cloud database

Lingofi is Supabase-ready for durable authentication/account records and the complete application database. Run `supabase/migrations/20260927_lingofi_cloud_database.sql` in the Supabase SQL Editor, then configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as server-side environment variables. Do not expose the service-role key through Vite or any `VITE_*` variable.

The Supabase `lingofi_data` table stores the canonical `users` collection (used by Lingofi login/signup), test results, IELTS data, full tests, and standardized-exam data. The local JSON files remain a working cache. On startup, configured cloud data hydrates the cache; writes are mirrored back to Supabase.
