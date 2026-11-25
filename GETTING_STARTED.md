# Sleer: feed prototype

This is the first Android-first Expo milestone, not a finished social app. The UI follows the selected feed mockup. The two cards intentionally repeat the same demo video so you can test paging; the clip is Big Buck Bunny © Blender Foundation, licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Source: [Blender Foundation](https://www.bigbuckbunny.org/). It is landscape and is cropped to fill the feed. Remote playback depends on the sample host and a working internet connection; it was not verified from an Android device in this environment.

## Run on Android

1. Install a current Node.js LTS and Expo Go on your Android phone.
2. In this directory run `npm install` and then `npx expo start`.
3. With your phone and computer on the same network, scan the QR code using Expo Go. If LAN access fails, consult Expo's current tunnel instructions.
4. Swipe up, tap the video to pause, use the sound button to unmute, and background the app to check playback pauses. Test on a real device, including poor connectivity.

Run `npm run typecheck`, `npm test` (Node 22.18+), and `npx expo export --platform android` for local checks. Tests cover the playback decision and visible-item selection helpers; they do not replace device testing.

## Setup and next steps

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for the full Supabase, moderation, testing and Android APK instructions. Discover, upload and social controls require a configured Supabase project; the default demo feed remains available without it. The app is a prototype and has not been tested on a real device or connected to a real Supabase instance.
