# PROMPT UNTUK CLAUDE OPUS: GENERATE LOGBOOK 80 HARI MAGANG

## INSTRUKSI UMUM

Saya adalah mahasiswa magang di RSUD Kalisat yang sedang mengerjakan proyek SIMPEG (Sistem Informasi Manajemen Pegawai). Saya butuh Anda membuat **logbook 80 hari lengkap** yang profesional, detail, dan realistis. 

### BIODATA MAHASISWA
- **Nama**: [Ganti dengan nama Anda]
- **NIM**: [Ganti dengan NIM Anda]
- **Program Studi**: Teknologi Informasi
- **Mitra Magang**: RSUD Kalisat
- **Supervisor**: [Ganti dengan nama supervisor Anda]
- **Durasi**: 80 Hari (mulai: [tanggal mulai], selesai: [tanggal selesai])

---

## KONTEKS PROYEK

Saya sedang mengembangkan **SIMPEG RSKALISAT** - REST API dengan teknologi:
- **Backend**: Laravel (PHP)
- **Frontend**: React/Vue.js
- **Database**: MySQL
- **API Routes**: 177 endpoints total
- **Total Fitur**: 4 Sprint (45+ fitur backend)

### FASE PROYEK
Proyek dibagi menjadi **4 sprint**:
1. **Sprint 1** (Hari 1-20): Profile, Diklat Personal, Riwayat Karir, Change Request
2. **Sprint 2** (Hari 21-40): Data Keluarga, Manajemen Diklat HRD, Master Data, WhatsApp Integration
3. **Sprint 3** (Hari 41-60): Admin Management, HRD Monitoring, Dashboard, STR/SIP
4. **Sprint 4** (Hari 61-80): HRD Data Management, Reminder WhatsApp, Final Testing & Documentation

---

## STRUKTUR LOGBOOK YANG DIINGINKAN

### Format Header
```
# REKAP LOG-BOOK HARIAN

Nama Mahasiswa    : [Nama]
NIM               : [NIM]
Program Studi     : Teknologi Informasi
Mitra Magang      : RSUD Kalisat
Nama Supervisor   : [Nama Supervisor]
Periode Magang    : [Tanggal] - [Tanggal] (80 hari)
```

### Format Tabel dengan Kolom
| No | Tanggal | Uraian Kerja | Deliverable/Achievement | Evidence Link |
|:---:|:-------:|:------------|:----------------------:|:-------------:|

---

## REQUIREMENTS UNTUK SETIAP ENTRY LOGBOOK

### ✅ HARUS MEMILIKI:
1. **Tanggal Unik** - Sequential dari day 1 hingga day 80, tidak boleh ada tanggal yang terlewat
2. **Uraian Kerja Spesifik** - Jangan umum! Harus detail sesuai sprint masing-masing
3. **Deliverable/Achievement** - Apa yang dihasilkan? (misal: "1 endpoint API", "Database migration", "UI component")
4. **Evidence/Bukti** - Link Google Drive folder untuk setiap day

### ⚠️ HINDARI:
- Uraian kerja yang terlalu umum ("meeting", "testing", "revisi")
- Entry yang terulang-ulang
- Tidak ada progress yang terlihat jelas
- Deliverable yang vague

---

## TEMPLATE URAIAN KERJA PER SPRINT

### SPRINT 1: PROFILE, DIKLAT, RIWAYAT KARIR (Hari 1-20)
**Fokus**: Backend API development & Frontend UI untuk role individual

**Contoh Uraian**:
- "Membuat endpoint POST /api/profile dengan validasi foto, KTP, KK upload"
- "Design database schema untuk table `riwayat_pendidikan` dengan fields: institusi, jurusan, tahun_lulus, no_ijazah"
- "Implementasi CRUD endpoint `/api/riwayat-karir/pendidikan` dengan authorization"
- "Develop React component ProfileForm dengan conditional rendering untuk data pribadi vs data kepegawaian"
- "Setup JWT authentication middleware untuk melindungi protected routes"

### SPRINT 2: DATA KELUARGA, HRD DIKLAT, MASTER DATA (Hari 21-40)
**Fokus**: Database expansion, WhatsApp integration, HRD features

**Contoh Uraian**:
- "Membuat 5 tabel keluarga: pasangan, anak, orang_tua, kontak_darurat, tanggungan_lain"
- "Integrasi Fonnte WhatsApp API ke dalam HrdService untuk auto-notification"
- "Develop endpoint PATCH /api/hrd/diklat/{id}/status/layak dengan WhatsApp trigger"
- "Buat master data repository untuk jenis_diklat, tipe_peserta, kategori_pendidikan"
- "Generate PDF report untuk daftar peserta diklat dengan Chart.js visualization"

### SPRINT 3: ADMIN, HRD MONITORING, DASHBOARD (Hari 41-60)
**Fokus**: Complex queries, real-time dashboards, filtering

**Contoh Uraian**:
- "Implement AdminPegawaiRepository dengan 8+ filter conditions (profesi, pendidikan, waktu masuk, status)"
- "Build DirekturDashboard dengan real-time statistik dari database view"
- "Develop STR/SIP monitoring endpoint dengan logic untuk detect masa berlaku < 3 bulan"
- "Create Excel export untuk daftar pegawai dengan conditional formatting"
- "Optimize database query untuk mengurangi N+1 problem di endpoint list pegawai"

### SPRINT 4: TESTING, DOCUMENTATION, DEPLOYMENT (Hari 61-80)
**Fokus**: QA, Documentation, Final refinement

**Contoh Uraian**:
- "Write 45+ unit tests untuk semua services dengan PHPUnit"
- "Setup Postman collection dengan 177 API endpoints untuk documentation"
- "Perform load testing dengan Apache JMeter, target: 1000 concurrent users"
- "Buat API documentation di Swagger/OpenAPI format"
- "Deploy ke staging server dan setup GitHub Actions CI/CD pipeline"

---

## DELIVERABLE YANG REALISTIS

**Per Hari Rata-rata (jangan terlalu banyak)**:
- **Backend Dev Days**: 1-2 endpoint, 1 service method, atau 1 critical bug fix
- **Frontend Dev Days**: 1-2 UI components, 1 page integration
- **Testing Days**: 2-3 test cases, 1 bug report
- **Meeting/Planning Days**: Sprint planning, code review, retrospective

**Breakdown Realistis**:
- 40% Backend Development
- 25% Frontend Development  
- 15% Testing & QA
- 10% Meetings/Planning
- 10% Documentation

---

## STYLE & TONE

1. **Professional** - Gunakan istilah teknis yang proper
2. **Specific** - Jangan general, selalu sebutkan nama file, endpoint, atau komponen
3. **Progressive** - Terlihat ada progress harian yang konsisten
4. **Realistic** - Tidak semua hari bisa menghasilkan banyak hal, ada hari yang lebih ringan
5. **Achievement-Focused** - Highlight apa yang dicapai, bukan hanya aktivitas

---

## CONTOH ENTRY YANG BAIK VS BURUK

### ❌ BURUK:
| No | Tanggal | Uraian Kerja | Deliverable |
|:---:|:-----:|:-----------|:------------|
| 1 | 1/4/2026 | Mengikuti meeting dan discuss proyek | Meeting selesai |
| 2 | 2/4/2026 | Melakukan revisi | Revisi selesai |

### ✅ BAIK:
| No | Tanggal | Uraian Kerja | Deliverable/Achievement |
|:---:|:-----:|:-----------|:------------|
| 1 | 1/4/2026 | Setup Laravel project, create database schema untuk user, profile, dan riwayat_karir tables | Initialized project dengan 3 migrations, sample .env configuration |
| 2 | 2/4/2026 | Develop endpoint POST /api/login dengan JWT token generation dan refresh token mechanism | Working LoginController dengan 2 endpoints, passing basic unit tests |

---

## OUTPUT FORMAT (Markdown + Tabel)

```markdown
# REKAP LOG-BOOK HARIAN

Nama Mahasiswa    : [Nama]
NIM               : [NIM]
Program Studi     : Teknologi Informasi
Mitra Magang      : RSUD Kalisat
Nama Supervisor   : [Nama Supervisor]
Periode Magang    : [Tanggal] - [Tanggal] (80 hari)

**Aktivitas yang dilakukan:**

| No | Tanggal | Uraian Kerja | Deliverable/Achievement | Evidence Link |
|:---:|:------:|:-----------|:-----------------------:|:-------------:|
| 1 | 1/4/2026 | [Uraian] | [Achievement] | [Link] |
| 2 | 2/4/2026 | [Uraian] | [Achievement] | [Link] |
...
| 80 | [Tanggal] | [Uraian] | [Achievement] | [Link] |

## RINGKASAN PERFORMA

- **Total Endpoint API Developed**: 45+
- **Total Frontend Components**: 20+
- **Bug Fixed**: 10+
- **Test Cases Created**: 45+
- **Documentation Pages**: 5+
- **Achievements**: ...
```

---

## HAL PENTING YANG HARUS DIPERHATIKAN

1. ✅ **Jangan ada duplikasi uraian kerja** - Setiap hari harus beda
2. ✅ **Urutan kronologis yang logis** - Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4
3. ✅ **Tarik dari konteks backend** - Gunakan info dari dokumen pertanggungjawaban
4. ✅ **Teknologi yang realistis** - Laravel, React, MySQL, Fonnte API, JWT, etc.
5. ✅ **Deliverable yang terukur** - Hindari vague terms seperti "dipelajari", "dimengerti"
6. ✅ **Balanced workload** - Tidak semua hari heavy, ada yang lebih ringan
7. ✅ **Final days = wrap-up & testing** - Hari terakhir harus ada dokumentasi final

---

## REQUEST

Silakan generate **logbook 80 hari lengkap** dengan format yang sudah saya jelaskan di atas. Format final harus:

1. Markdown table yang rapih
2. Minimal 80 rows (satu per hari)
3. Setiap entry harus unik dan meaningful
4. Respek terhadap timeline 4 sprint
5. Deliverable yang terukur dan realistis
6. Evidence link placeholder seperti: `[Day XX](https://drive.google.com/...)`

**Mulai generate sekarang!**
