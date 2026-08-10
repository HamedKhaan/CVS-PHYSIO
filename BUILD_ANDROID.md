# Android build — CVS Interactive Physiology V4

## Prerequisites
- Node.js 22 LTS or compatible current Node
- Android Studio + Android SDK
- JDK compatible with the installed Capacitor/Android toolchain
- Internet access to the npm registry on the build machine

## Build web assets
```bash
npm install
npm run qa
npm run build
```

## Add/sync Android
```bash
npx cap add android
npx cap sync android
npx cap open android
```

Then use Android Studio to run a debug build or generate a signed release AAB/APK.

## Release security
- Keep the Android signing keystore outside the repository.
- Never commit passwords, API keys, or signing credentials.
- Use a unique production application ID.
- Keep permissions minimal; this app currently needs no network, location, camera, contacts, or storage permissions for its core educational content.
