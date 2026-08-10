# Release-readiness status — V4 (final in this environment)

## Completed in this package
- React/Vite application shell
- 5 implemented interactive modules
- Modules 06–08 reserved (empty placeholders in App.jsx)
- Offline-first PWA assets (manifest + service worker)
- Capacitor configuration present
- Mobile safe-area, touch-target, overflow and 100dvh refinements
- Google Fonts network dependency removed → pure offline fonts
- QA script passes cleanly
- Scientific validation notes retained
- Version set to 4.0.0
- BUILD_ANDROID.md documents the official next steps

## Intentionally not completed here
- `npm install` / production Vite build (environment has npm/tar filesystem errors and intermittent registry issues)
- Android Gradle project generation
- Signed or unsigned APK/AAB
- Physical-device testing

These require a normal Node.js + Android Studio/SDK machine with unrestricted npm registry access. No fake APK or unverified build artifact is included.

## How to finish on a normal machine
1. `npm install`
2. `npm run qa`
3. `npm run build`
4. `npx cap add android && npx cap sync android`
5. Open in Android Studio → Build → Generate Signed Bundle / APK
