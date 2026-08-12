# CVS Interactive Physiology — v4.1.2

A mobile-first, offline-first React/Vite application containing **8 cardiovascular physiology learning modules** with interactive models, charts, concept maps, and mobile-friendly controls.

## Modules

1. Basic Hemodynamics
2. Frank–Starling & Venous Return
3. Cardiac Cycle & PV Loop
4. Vascular Distensibility & Pulse Pressure
5. Microcirculation & Starling Forces
6. Baroreceptor Reflex & Autonomic Control
7. Local & Humoral Control of Blood Flow
8. Exercise — Integrated Response

## Current v4.1.2 improvements

- Fixed mobile/Android WebView chart sizing for Recharts visualizations.
- Added per-chart zoom controls (75%–200%) where Recharts charts are used.
- Preserved the existing scientific models, equations, data and module content.
- Removed the global chart `min-height: 180px !important` rule that could distort short charts.
- Unified light/dark theme tokens across the module UI.
- First launch follows the device/system light-dark preference; an explicit user choice is persisted.
- Added a direct link to the official project repository on the home screen:
  https://github.com/HamedKhaan/CVS-PHYSIO
- Added a recognizable cardiovascular app icon (heart + ECG motif) for the PWA/Android packaging.
- Bumped the service-worker cache version so deployed clients can receive the updated assets.

## Architecture

React + Vite → PWA/offline-first → Capacitor → Android APK/AAB.

The core educational content is bundled locally. The app does not require a remote API for its educational modules.

## Local development

```bash
npm install
npm run qa
npm run build
npm run dev
```

## Android

```bash
npm install
npm run qa
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Then build/debug or generate a signed release APK/AAB from Android Studio.

## Security

- No API keys or passwords belong in the repository.
- Keep the Android signing keystore and credentials outside GitHub.
- Public/open-source source code does **not** allow other GitHub users to modify an APK already installed on your phone.
- Only install/update an APK from a build source you trust.
- Keep the `main` branch protected if other contributors will submit changes.
- Review pull requests before merging them into the release branch.
- Keep Android permissions minimal.
- Do not put secrets into GitHub Actions logs or source files.

## Scientific scope

This is an educational cardiovascular physiology application, not a clinical decision-support system. The interactive models are intentionally simplified teaching models.

See `SCIENTIFIC_VALIDATION.md` for the current scientific validation scope and limitations.

## Build limitation

A reproducible APK/AAB must be built in a normal Node.js + Android SDK environment. The project does not claim an APK has been successfully built unless the build actually passes.

## Chart rendering

The project uses **Recharts 3 native responsive charts** (`responsive` prop) rather than the older `ResponsiveContainer` wrapper. This is intentional for mobile/WebView reliability: Recharts documents the native `responsive` mode as using standard CSS sizing without the extra `ResponsiveContainer` resolution layer. The chart itself is sized to its explicit `ChartContainer` frame, so it can render on first mount and resize with the device.

The app currently contains 20 Recharts visualizations across Modules 1, 2, 3, 4, 6 and 7. Modules 5 and 8 use their own visualization/diagram approaches.

