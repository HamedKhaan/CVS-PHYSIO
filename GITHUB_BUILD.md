# ساخت نسخه Android با GitHub

این پروژه اکنون ۸ ماژول دارد و workflow باید همین نسخه را build کند.

## قبل از Build

در repository بررسی کن که این موارد وجود داشته باشند:

- `package.json`
- `vite.config.js`
- `src/`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `.github/workflows/`

سپس از Actions، workflow مربوط به Android را اجرا کن.

## ترتیب پیشنهادی

```text
Push / Commit
      ↓
GitHub Actions
      ↓
npm install
      ↓
npm run qa
      ↓
npm run build
      ↓
Capacitor sync
      ↓
Android build
      ↓
APK/AAB
```

اگر QA یا build قرمز شد، APK آن اجرا را قابل اعتماد فرض نکن.

## امنیت

Public بودن repository مانع استفاده شخصی تو از APK نیست. Fork یا ویرایش دیگران، نسخه نصب‌شده روی گوشی تو را تغییر نمی‌دهد.

برای نسخه Release:

- signing keystore را در GitHub commit نکن.
- secrets را فقط در GitHub Actions Secrets نگه دار.
- `main` را در صورت همکاری دیگران protected کن.
- Pull Requestها را قبل از merge بررسی کن.
- APK را فقط از workflow/release مورد اعتماد خودت نصب کن.

## GitHub

Repository:
https://github.com/HamedKhaan/CVS-PHYSIO


## v4.1.2 chart fix

The chart renderer was migrated away from `ResponsiveContainer`. Do not reintroduce `ResponsiveContainer` around the 20 charts unless a future change has been tested on Android/WebView. The current pattern is:

```jsx
<ChartContainer height={260}>
  <LineChart responsive style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }} data={data}>
    ...
  </LineChart>
</ChartContainer>
```

This uses the native Recharts 3 responsive mode.
