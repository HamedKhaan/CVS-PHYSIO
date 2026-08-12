# Release-readiness — CVS Interactive Physiology v4.1.2

## Completed in this package

- 8 cardiovascular physiology modules integrated
- React/Vite application shell
- Mobile-first layout
- Offline-first PWA structure
- Android/Capacitor configuration
- Mobile-safe Recharts containers
- Per-chart zoom controls
- Light/dark theme handling
- System theme fallback
- GitHub link on the home screen
- Heart + ECG PWA icons in 192×192 and 512×512
- Service-worker cache versioning
- QA script
- Scientific validation documentation retained

## Required before release

Run on a normal build environment:

```bash
npm install
npm run qa
npm run build
```

Then:

```bash
npx cap sync android
```

and test on a real Android device.

## Release test checklist

- [ ] All 8 modules open
- [ ] All charts render
- [ ] Chart zoom works
- [ ] No horizontal clipping on a small phone
- [ ] Light mode works
- [ ] Dark mode works
- [ ] System theme fallback works
- [ ] Theme persists after relaunch
- [ ] Home GitHub link opens correctly
- [ ] App icon appears correctly
- [ ] Cold start works
- [ ] Back navigation works
- [ ] No unexpected network/API dependency
- [ ] Release APK/AAB is signed with the private release key

## Important

This package does not claim that an APK/AAB has been successfully built unless the actual build passes in the target Android environment.
