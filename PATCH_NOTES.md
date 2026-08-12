# CVS-PHYSIO v4.1.2

## Chart rendering correction

The previous v4.1.1 chart patch did **not** resolve the underlying rendering problem. It still depended on `ResponsiveContainer`, which was the wrong layer to keep for this mobile/WebView failure mode.

v4.1.2 removes `ResponsiveContainer` from the 20 Recharts charts and uses Recharts 3's native `responsive` prop with explicit CSS dimensions inside `ChartContainer`. This follows the current Recharts sizing model and avoids the extra responsive-container resolution layer.

### Changed
- Modules 1, 2, 3, 4, 6 and 7: all Recharts charts migrated to native `responsive` mode.
- Module 5: unused `ResponsiveContainer` import removed; no chart logic changed.
- Module 8: unchanged.
- Removed global `.recharts-responsive-container` CSS rules.
- Kept chart zoom controls.
- No scientific formulas, data, labels, quiz answers or module content were changed.

### Verification
- 20 chart instances identified and migrated.
- 0 `ResponsiveContainer` references remain in the modules.
- 8 modules remain present.
