# Catatan proyek

- **Format video selalu 9:16** (vertikal, 1080 x 1920). `what-if-studio/src/studio.config.ts` sudah diset `aspect: '9:16'`;
  setiap episode baru memberi tiap shot sebuah `frame` (crop vertikal) di `defineEpisode`, dan judul serta skema
  disusun dari atas ke bawah.
- Studio What If ada di `what-if-studio/`; skrip pipeline yang sudah disesuaikan untuk 9:16 ada di `what-if-studio/scripts/`
  (jalankan dari folder studio). Font dimuat lokal dari `public/fonts/` (render tanpa Google Fonts).
- Remotion memakai Chromium bawaan lingkungan: tautkan `/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64`
  ke `node_modules/.remotion/chrome-headless-shell/linux64/` dengan file `VERSION` yang sesuai, jika belum ada.
- **MC di setiap cerita adalah karakter milik user**: `LOOKS.mc` di `what-if-studio/src/engine/rig.tsx` (rambut hitam
  berantakan, kulit peach, hoodie hitam bertali putih, celana hitam, sepatu hitam bersol putih, kaus kaki putih).
  Dia selalu jadi "kamu" di naskah. Pemeran pendukung: `sis` (adik), `momHijab` (ibu), `suit` (pria berjas).
- **Serial**: setiap episode minimal 40-50 detik, berakhir dengan "Bersambung". Seri "Kabar Dajjal" ada di
  `src/episodes/dajjal-1/` (episode berikutnya: `dajjal-2`, dst.). Aturan hormat: nabi tidak pernah digambar, Dajjal tidak
  pernah diperlihatkan langsung, mushaf digambar tertutup tanpa tulisan Arab buatan, setiap hadis disebut nomornya dan
  dicek di field `science`.
- **Subtitle selalu wajib** di setiap video: subtitle tertanam, sinkron per kata dengan narasi (`engine/captions.tsx`).
  Di `index.tsx` setiap episode, oper `words` (dari `words.json`) ke `defineEpisode`, dan isi `noCaptions` dengan shot
  kartu judul. Cek beberapa frame (`stills.mjs <slug> --frames ...`) sebelum master.
