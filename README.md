# CVS Interactive Physiology — V4

A mobile-first, offline-first React/Vite application containing five implemented cardiovascular physiology modules. Modules 06–08 are reserved and intentionally empty.

## Implemented modules
1. Basic Hemodynamics
2. Frank–Starling & Venous Return
3. Cardiac Cycle & PV Loop
4. Vascular Distensibility & Pulse Pressure
5. Microcirculation & Starling Forces

## Target architecture
React + Vite → PWA/offline-first → Capacitor → Android APK/AAB.

Capacitor is designed to wrap modern web applications in native Android/iOS shells while preserving the web codebase.

Vite production builds are generated with `npm run build` into `dist`; the project uses a relative base so it can also be packaged as a local app.

## Local development

```bash
npm install
npm run qa
npm run dev
```

Production web build:

```bash
npm run build
npm run preview
```

## Android

After a successful web build in a normal Node + Android SDK environment:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Build a debug APK or a signed release AAB from Android Studio. Full steps are in `BUILD_ANDROID.md`.

## V4 changes (from previous)
- Mobile UX refined for viewports < 700 px
- Safe-area insets for notch / gesture navigation
- Larger touch targets (min ~42–44 px)
- Prevented unwanted horizontal overflow in charts
- `100dvh` used for mobile viewport height
- Google Fonts `@import` removed → fully offline-capable (system fonts)
- QA script passes (no external network calls, no eval, 5 modules + 3 reserved)
- Version bumped to 4.0.0

## Security design
- No API keys or credentials in source.
- No remote API dependency in the five supplied modules.
- No unnecessary Android permissions.
- Educational data is bundled locally.
- PWA service worker is same-origin only.
- Production Android releases should be signed with a private release keystore.
- The app is educational and not a clinical decision-support device.

## Scientific validation
See `SCIENTIFIC_VALIDATION.md`. Module 05 distinguishes the classic Starling teaching equation from the modern glycocalyx/revised-Starling framework.

## Important build limitation for this environment
This package includes the web/PWA and Capacitor configuration. The current execution environment has intermittent npm/tar issues and cannot reliably produce a reproducible `dist/` or Android Gradle project. The project is left in a clean install/buildable state. No fake or unverified APK is supplied.
