# Sleer audit and flow matrix

Review of the checkout and working-tree changes on 2026-11-25, using the checklists in Everything Claude Code's `security-review`, `code-reviewer`, `tdd-workflow` and `verification-loop` (repository commit `432485ba6b92c14fb357276a98957f348bcff9ee`). These are practices applied during this review, not claims that external agents ran. This is a prioritized review, not a proof that every possible state or event is safe. The app remains a prototype and is **not ready for public launch**.

## Prioritized findings

### 1. Release blocker: authorization and complete flows are unverified
**Paths:** `supabase/migrations/*.sql`, `supabase/tests/*.sql`, `src/auth/`, `src/SocialActions.tsx`, `src/UploadScreen.tsx`.
The migration and pgTAP files have not run against Supabase, and real storage, authentication and mobile behavior have not been exercised. PGlite smoke tests use simplified authentication and storage stubs, not the real APIs. Policy regressions could expose pending uploads or permit unauthorized writes. **Next:** run local Supabase migrations and pgTAP in CI, then test with two accounts and anonymous users; test on real Android devices and build an APK. No Docker, local PostgreSQL/Supabase, credentials or Android device was available in this environment.

### 2. Release blocker: unbounded uploads, reports and interactions
**Paths:** `supabase/migrations/20261125010000_content_and_social.sql`, `src/UploadScreen.tsx`, `src/SocialActions.tsx`.
**Mitigated in a later update:** `supabase/migrations/20261125030000_write_limits.sql` adds rolling per-account successful-write limits, including deleted/re-uploaded objects. PGlite tests exercise basic allowance and expiry, not concurrent transactions or the real Supabase Storage API. Limits do not prevent failed-request floods, account farming, storage transfer charges or IP-based abuse. **Next:** add gateway/IP rate limits, storage quotas and billing alerts; validate concurrency and error propagation in real Supabase. Do not rely on the client or publish before these controls are validated.

### 3. Release blocker: moderation and rights enforcement are operational, not automated
**Paths:** `supabase/migrations/20261125010000_content_and_social.sql`, `LAUNCH_CHECKLIST.md`.
An uploader can assert rights without proof, choose metadata, submit paths that may not reference real or safe files, and upload bytes with an incorrect media type. There is no scanning, moderation dashboard, takedown process, abuse response, audit trail or automated cleanup. Signed URLs can remain usable for an hour after rejection. **Next:** implement a trusted moderation/review workflow with safe file inspection, rights and takedown processes, shorter/revocable delivery, cleanup and operational tests before accepting public uploads.

### 4. High: credentials persist in unencrypted local storage
**Path:** `src/auth/client.ts`.
**Mitigated in a later update:** `src/auth/storage.ts` and `src/auth/secureStorageCore.ts` use Expo SecureStore on native platforms and migrate legacy sessions; web remains on AsyncStorage and is not a supported production target. Pure adapter tests cover chunking and failure paths, but no actual device/keystore test has run. **Next:** test storage, migration, backup and sign-out on Android; review privacy and account recovery. Never place service-role credentials in an Expo public variable.

### 5. High: ambiguous upload failure could delete a referenced file
**Paths:** `src/UploadScreen.tsx`, `src/uploadSafety.ts`, `tests/upload-safety.test.ts`.
**Mitigated in this review:** after a metadata insert is attempted, a network failure no longer triggers object deletion, because the server may have committed. The user is told to check before retrying. An orphan or duplicate is still possible; a durable idempotency key, resumable upload and server-side reconciliation remain needed. The test covers the cleanup decision, not actual network races.

### 6. High: interaction state could be stale or incorrectly overwritten
**Path:** `src/SocialActions.tsx`.
**Mitigated in this review:** interaction writes wait for initial state, load failures are surfaced and can be retried, and an old toggle response is ignored after the identity changes. An uncertain write requires reloading state. **Next:** component/integration tests for rapid taps, session changes, network interruptions, modal closure and duplicate requests; comments still lack pagination beyond the first 50.

### 7. High: pagination and signed playback need reliability work
**Paths:** `src/content.ts`, `App.tsx`.
Offset pagination may skip or repeat rows when feed contents change. Following/saved IDs are fetched as a list subject to API row limits and URL size; large accounts may see incomplete feeds. A signed upload URL expires after one hour, including during a long playback session. **Next:** use server-side keyset pagination/joins, bounded query sizes and a tested signed-URL renewal strategy. Retry was added for player errors, but it has not been tested on a device.

### 8. High: user recovery and safety features are incomplete
**Paths:** `src/auth/ProfileScreen.tsx`, `src/SocialActions.tsx`, `App.tsx`.
Password reset, account deletion, provider-specific embeds, creator profile browsing, notification delivery and upload status are absent. Reporting exists but there is no user-visible follow-up or moderation interface. **Next:** design these flows and their server-side authorization, retention, privacy and abuse controls. Do not present placeholders as working features.

### 9. Medium: discovery and search mismatches
**Paths:** `src/DiscoverScreen.tsx`, `src/UploadScreen.tsx`, `src/categories.ts`, `src/search.ts`, `src/content.ts`.
**Mitigated in this review:** creators select the same categories used by Discover; PostgREST wildcard/filter characters are stripped and punctuation-only searches return no results. Existing or admin-entered custom categories can still be undiscoverable by category. Search is caption-only and substring-based. **Next:** shared server-side categories and indexed, bounded search; test non-Latin text and search behavior with a real backend.

### 10. Medium: interaction timestamps and IDs were client-writable
**Paths:** `supabase/migrations/20261125020000_restrict_client_columns.sql`, `supabase/tests/content_and_social.test.sql`.
**Mitigated in this review:** a new migration restricts insert columns and adds a policy test for forged comment timestamps. Apply it after the earlier migrations. The SQL has not been run here, so verify grants and policies in a disposable Supabase instance before deployment.

### 11. Medium: weak release verification and onboarding
**Paths:** `README.md`, `docs/original-idea-notes.md`, `.github/workflows/verify.yml`, `package.json`, `LAUNCH_CHECKLIST.md`.
**Improved in this review:** replaced the chat-history README with actionable onboarding while preserving its contents; added Node version guidance and a CI job for typecheck, unit tests and Android JS export. CI has not run on GitHub here. There is no lint, coverage gate, Supabase policy job, integration test or device E2E job; the Android export is not a native APK. `npm audit` reports three moderate Expo/fingerprint/minimatch dependency-chain findings; the suggested forced fix downgrades Expo and was not applied.

## Flow and event coverage matrix

| Flow | Implemented paths / important scenarios | Verification status |
|---|---|---|
| Demo and feed | Initial load, empty/error, scroll activation, background pause, mute, retry, filtered feed | Pure active/playback helpers tested; no Android playback, offline or orientation test |
| Auth and profile | Sign-up, email confirmation outside app, sign-in/out, session refresh, edit/save/error | Validation and secure storage adapter helpers tested; no actual provider or device test; reset/deletion/deep links absent |
| Discover | Category and caption search, empty result | Search normalization unit-tested; no real query, pagination or accessibility test |
| Likes, follows, bookmarks | Sign-in guard, load/toggle, saved/following feeds, errors | Static review only; no component or backend integration test |
| Comments and reports | Load, post, delete own, report | Static review only; moderation/report response and pagination incomplete |
| Creator submission | Picker, size/type, consent, upload, pending metadata, ambiguous failure | Cleanup decision unit-tested; no real picker/storage/moderation tests; limits are not abuse prevention |
| Administrator | SQL approval/rejection and manual review | Documented only; no admin UI or end-to-end tests |
| Access control | Own profile, approved content, own social writes, private bucket | PostgreSQL/PGlite smoke tests passed with stubs; pgTAP and real Supabase storage HTTP, signed URL and concurrency tests unexecuted |
| Build/release | JS export, EAS preview profile | Android JS export passed locally; no APK, signing or store release was tested |

## Checks run in this environment

- `npm run typecheck`: passed.
- `npm test`: 12 tests passed, including a PostgreSQL/PGlite migration and policy smoke test with auth/storage stubs. They do not exercise React Native, real Supabase APIs, network or database concurrency.
- `EXPO_OFFLINE=1 npx expo export --platform android`: passed (JavaScript bundle only).
- `npm audit`: three moderate findings in the Expo/fingerprint/minimatch dependency chain; no forced breaking downgrade was applied.
- Supabase migrations/pgTAP, device E2E and GitHub Actions: **not run**. See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for setup and test instructions.
