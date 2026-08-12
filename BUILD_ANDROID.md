# Android build — CVS Interactive Physiology v4.1.2

## Prerequisites

- Node.js 22 LTS or a compatible current Node release
- Android Studio
- Android SDK
- JDK compatible with the installed Capacitor/Android toolchain
- Internet access to npm on the build machine

## Build and QA

```bash
npm install
npm run qa
npm run build
```

Do not continue to Android packaging if `npm run qa` or `npm run build` fails.

## Add/sync Android

For a fresh Android platform:

```bash
npx cap add android
npx cap sync android
npx cap open android
```

If an `android/` directory already exists, use:

```bash
npx cap sync android
npx cap open android
```

Then run the app on a physical Android device or emulator and test:

- all 8 modules
- every interactive chart
- chart zoom
- light/dark mode
- system-theme fallback
- portrait/rotation behaviour
- back navigation
- GitHub link
- cold start and relaunch

## Release security

- Keep the Android signing keystore outside the repository.
- Never commit keystore files, passwords, API keys or signing credentials.
- Use a unique production application ID.
- Keep Android permissions minimal.
- Do not install release APKs produced by an untrusted fork.

## Generate release

Use Android Studio:

**Build → Generate Signed Bundle / APK**

Prefer an **AAB** for Google Play and an APK for direct testing/distribution.

After changing web code, always run:

```bash
npm run build
npx cap sync android
```

before the Android build.
