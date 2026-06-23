# 🎯 Project Target — InsideBacteria

> Dokumen rencana pengembangan proyek InsideBacteria.  
> Terakhir diperbarui: 11 Maret 2026

---

## 📊 Status Proyek Saat Ini

| Aspek | Skor | Catatan |
|-------|------|---------|
| Fitur Inti | 8/10 | 3D viewer, label, popup, panel pengaturan sudah berjalan baik |
| Kualitas Kode | 7/10 | Terstruktur rapi tapi monolitik (script.js 1300+ baris) |
| Performa | 8/10 | Optimasi mobile sudah bagus; belum ada LOD |
| UI/UX | 8/10 | Tema dark sci-fi menarik; responsif; minor gap |
| Aksesibilitas | 4/10 | Belum ada keyboard nav, ARIA label, fokus indikator |
| SEO | 3/10 | Belum ada OG tags, sitemap, meta description |
| PWA | 1/10 | Belum ada manifest, service worker, ikon |
| Dokumentasi | 7/10 | README bagus; belum ada API docs & deployment guide |

---

## 🚀 Fase 1 — Quick Wins (Prioritas Tinggi)

Target: Perbaikan cepat yang langsung meningkatkan kualitas proyek.

- [ ] **Hapus file `index_old_viewer.html`** — Mengurangi technical debt
- [ ] **Tambahkan favicon & apple-touch-icon** — Tampilan profesional di browser & mobile
- [ ] **Perbaiki duplikasi CSS label3d** — Konsolidasi rules di style.css (baris ~618-648 dan ~887-919)
- [ ] **Tambahkan `aria-label`** pada semua tombol — Aksesibilitas dasar
- [ ] **Sembunyikan UI label tuning** saat `labelEditable: 0` — Bersihkan settings panel
- [ ] **Tambahkan Open Graph meta tags** — Preview saat share link
  ```html
  <meta property="og:title" content="InsideBacteria — Struktur Sel Bakteri 3D" />
  <meta property="og:description" content="Pelajari struktur sel bakteri secara interaktif dengan model 3D" />
  <meta property="og:type" content="website" />
  ```
- [ ] **Tambahkan `<meta name="description">`** di setiap halaman — SEO dasar
- [ ] **Support `prefers-reduced-motion`** — Matikan animasi untuk pengguna yang sensitif

---

## ⌨️ Fase 2 — Aksesibilitas & Keyboard Navigation

Target: Membuat aplikasi bisa diakses semua pengguna.

- [ ] **Keyboard shortcut untuk 3D Viewer:**
  - Angka `1`–`9` → Fokus ke organel
  - `Arrow keys` → Rotasi kamera
  - `+`/`-` → Zoom in/out
  - `Esc` → Tutup popup info
  - `R` → Reset kamera
  - `L` → Toggle label
- [ ] **Tambahkan fokus indikator** (outline) pada semua elemen interaktif
- [ ] **Ganti emoji sebagai label utama** dengan teks + ikon SVG (screen reader friendly)
- [ ] **High contrast mode** — Support `prefers-contrast: high`
- [ ] **Tab order yang benar** pada settings panel dan popup

---

## 🎨 Fase 3 — Fitur Baru (UI/UX)

Target: Menambah fungsionalitas dan interaktivitas.

- [ ] **Screenshot / Export** — Tombol untuk screenshot tampilan 3D saat ini (canvas → PNG)
- [ ] **Auto-rotate saat idle** — Rotasi otomatis kalau user tidak berinteraksi >10 detik
- [ ] **Pencarian organel** — Input search/filter di settings panel
- [ ] **Swipe dismiss info popup** (mobile) — Geser ke bawah untuk menutup
- [ ] **Bookmark kamera** — Simpan posisi kamera favorit
- [ ] **Animasi transisi antar organel** — Efek smooth saat berpindah fokus
- [ ] **Dark/Light mode toggle** — Opsi tema terang untuk pengguna yang prefer light mode
- [ ] **Tooltip pada hover label** — Preview nama organel tanpa klik

---

## 🏗️ Fase 4 — Refactoring & Arsitektur

Target: Meningkatkan maintainability dan skalabilitas kode.

- [ ] **Modularisasi `script.js`** — Pisahkan menjadi modul-modul:
  ```
  js/
  ├── main.js              # Entry point & init
  ├── scene.js             # Scene, camera, renderer setup
  ├── materials.js         # Material & texture generation
  ├── models.js            # Model loading & management
  ├── labels.js            # Label system (CSS2D)
  ├── controls.js          # OrbitControls & camera animation
  ├── ui.js                # Settings panel, popup, UI interactions
  ├── lighting.js          # Lighting setup & controls
  └── data/organelles.js   # Data organel (nama, deskripsi, fakta)
  ```
- [ ] **Migrasi ke TypeScript** — Type safety untuk state management yang kompleks
- [ ] **Konsolidasi duplikasi CSS** — Satu sumber kebenaran untuk setiap komponen
- [ ] **Setup build tool** (Vite) — Bundling, minification, tree-shaking
- [ ] **Tambahkan ESLint + Prettier** — Konsistensi kode otomatis

---

## 📱 Fase 5 — PWA & Deployment

Target: Membuat aplikasi bisa di-install dan diakses offline.

- [ ] **Buat `manifest.json`**
  ```json
  {
    "name": "InsideBacteria",
    "short_name": "Bacteria3D",
    "start_url": "/index.html",
    "display": "standalone",
    "theme_color": "#06080e",
    "background_color": "#06080e"
  }
  ```
- [ ] **Buat Service Worker** — Cache model 3D & aset statis untuk akses offline
- [ ] **Buat ikon app** (192×192, 512×512) — Untuk install prompt
- [ ] **Deploy ke GitHub Pages** — Branch `gh-pages` atau GitHub Actions
- [ ] **Setup CI/CD pipeline** — Auto deploy saat push ke `main`
- [ ] **Tambahkan `robots.txt` dan `sitemap.xml`**

---

## 🧪 Fase 6 — Testing

Target: Mencegah regresi dan menjamin kualitas.

- [ ] **Unit test** (Vitest) — Test fungsi utilitas, data organel, kalkulasi
- [ ] **E2E test** (Playwright) — Test navigasi halaman, 3D viewer loading, interaksi popup
- [ ] **Visual regression test** — Screenshot comparison untuk UI
- [ ] **Performance benchmark** — Lighthouse CI, WebGL profiling
- [ ] **Cross-browser testing** — Chrome, Firefox, Safari, Edge, Mobile

---

## 🌐 Fase 7 — Internasionalisasi (i18n)

Target: Mendukung multi-bahasa.

- [ ] **Buat sistem i18n sederhana** — JSON per bahasa
  ```
  locales/
  ├── id.json   # Bahasa Indonesia (default)
  └── en.json   # English
  ```
- [ ] **Ekstrak semua hardcoded string** dari HTML & JS ke file bahasa
- [ ] **Tambahkan language switcher** di navbar
- [ ] **Support bahasa Inggris** sebagai bahasa kedua

---

## 📈 Fase 8 — Analytics & Engagement (Opsional)

Target: Memahami bagaimana pengguna menggunakan aplikasi.

- [ ] **Integrasi analytics ringan** (Plausible / Umami — privacy-friendly)
- [ ] **Track interaksi organel** — Organel mana yang paling sering diklik
- [ ] **Kuis interaktif** — Mini quiz tentang struktur bakteri setelah eksplorasi
- [ ] **Gamifikasi** — Badge/achievement setelah menjelajahi semua organel
- [ ] **Share hasil** — Bagikan skor kuis ke sosial media

---

## 🐛 Bug yang Perlu Diperbaiki

| Prioritas | Bug | Detail |
|-----------|-----|--------|
| 🟡 Sedang | Settings panel overlap di mobile | Panel menutupi canvas, interaksi terblokir |
| 🟡 Sedang | Folder `referensi/` disebut di README tapi tidak ada | Hapus dari README atau buat foldernya |
| 🟠 Rendah | Controls hint terlalu kecil di mobile | Font 0.8rem sulit dibaca di layar kecil |
| 🟠 Rendah | Tidak ada indikasi visual model terpilih | Saat label tuning, model aktif tidak terlihat jelas |
| 🟢 Minor | Label config download pakai timestamp saat ini | Sebaiknya pakai tanggal modifikasi terakhir |

---

## 📋 Ringkasan Prioritas

```
🔴 KRITIS (Sekarang)     → Fase 1: Quick Wins
🟡 PENTING (Minggu Ini)   → Fase 2: Aksesibilitas
🟢 BAGUS (Bulan Ini)      → Fase 3: Fitur Baru + Fase 4: Refactoring  
🔵 MASA DEPAN             → Fase 5-8: PWA, Testing, i18n, Analytics
```

---

> 💡 **Tips**: Kerjakan satu fase secara tuntas sebelum pindah ke fase berikutnya. Setiap fase bisa di-deploy secara independen tanpa merusak fitur yang sudah ada.
