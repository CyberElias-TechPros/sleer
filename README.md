# Sleer

Android-first, Expo/React Native prototype for a creator-curated short-video feed. It includes a local demo and code for Supabase-backed accounts, moderated creator submissions and social interactions. **Not production-ready:** the backend policies and end-to-end mobile flows require testing against a real Supabase project and Android devices.

## Start here

- [Quick start](GETTING_STARTED.md) — install dependencies and run the demo on Android.
- [Setup and launch checklist](LAUNCH_CHECKLIST.md) — database migrations, moderation, device testing and APK build steps.
- [Audit and flow matrix](AUDIT_REPORT.md) — prioritized findings, fixes and remaining risks.
- [Original project idea notes](docs/original-idea-notes.md) — preserved original README discussion.

Node.js 22.18+ is required for the current test runner. Run `npm ci`, `npm run typecheck`, `npm test` and `npx expo export --platform android`. The exported bundle is not an APK. Do not store secret/service-role keys in the mobile app. Public sample video availability and external content rights must be independently verified.
