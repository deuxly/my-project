# Catatan proyek

- **Format video selalu 9:16** (vertikal, 1080 x 1920). `what-if-studio/src/studio.config.ts` sudah diset `aspect: '9:16'`;
  setiap episode baru memberi tiap shot sebuah `frame` (crop vertikal) di `defineEpisode`, dan judul serta skema
  disusun dari atas ke bawah.
- Studio What If ada di `what-if-studio/`; skrip pipeline yang sudah disesuaikan untuk 9:16 ada di `what-if-studio/scripts/`
  (jalankan dari folder studio). Font dimuat lokal dari `public/fonts/` (render tanpa Google Fonts).
- Remotion memakai Chromium bawaan lingkungan: tautkan `/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64`
  ke `node_modules/.remotion/chrome-headless-shell/linux64/` dengan file `VERSION` yang sesuai, jika belum ada.
