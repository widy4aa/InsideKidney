# REKAP LOG-BOOK HARIAN

Nama Mahasiswa    : Widya Fitriadi Nugraha
NIM               : 232410102047
Program Studi     : Teknologi Informasi
Mitra Magang      : RSUD Kalisat
Nama Supervisor   : [Nama Supervisor]
Periode Magang    : 2 Februari 2026 - 22 Mei 2026 (80 hari)

**Aktivitas yang dilakukan:**

| No | Tanggal | Uraian Kerja | Deliverable/Achievement | Evidence Link |
|:---:|:------:|:-----------|:-----------------------|:-------------:|
| 1 | 2/2/2026 | Onboarding di RSUD Kalisat, setup environment kerja (PHP 8.2, Composer, MySQL), inisialisasi project Laravel SIMPEG RSKALISAT, dan konfigurasi `.env` + repository Git | Laravel project ter-inisialisasi, koneksi DB berhasil, repo Git ter-setup | [Day 01](https://drive.google.com/...) |
| 2 | 3/2/2026 | Desain ERD database SIMPEG dan pembuatan migration awal untuk tabel `users`, `pegawai`, `profile` | 3 migration core + ERD diagram | [Day 02](https://drive.google.com/...) |
| 3 | 4/2/2026 | Setup autentikasi JWT (tymon/jwt-auth), implementasi `AuthController::login()` endpoint `POST /api/login` dengan generate token | LoginController berfungsi, token JWT ter-generate | [Day 03](https://drive.google.com/...) |
| 4 | 5/2/2026 | Implementasi `AuthController::logout()` `POST /api/logout` dan JWT middleware untuk proteksi protected routes | Endpoint logout + middleware auth aktif | [Day 04](https://drive.google.com/...) |
| 5 | 6/2/2026 | Develop fitur Forgot Password: `POST /api/forgot-password/request-otp` dan `POST /api/forgot-password/reset` dengan mekanisme OTP | 2 endpoint forgot-password berfungsi | [Day 05](https://drive.google.com/...) |
| 6 | 9/2/2026 | Implementasi `AuthController::changePassword()` `POST /api/auth/change-password` + `ChangePasswordRequest` validation | Endpoint ganti password (saat login) selesai | [Day 06](https://drive.google.com/...) |
| 7 | 10/2/2026 | Develop endpoint `GET /api/profile` dan `PATCH /api/profile` untuk lihat & edit data profil | 2 endpoint profile berfungsi dengan validasi | [Day 07](https://drive.google.com/...) |
| 8 | 11/2/2026 | Implementasi upload foto, KTP, dan KK pada profil menggunakan Laravel Storage dengan validasi mime & size | Fitur upload dokumen profil berfungsi | [Day 08](https://drive.google.com/...) |
| 9 | 12/2/2026 | Buat migration & model `diklat`, develop endpoint `GET /api/diklat` untuk melihat jadwal & laporan diklat | Tabel diklat + endpoint list selesai | [Day 09](https://drive.google.com/...) |
| 10 | 13/2/2026 | Implementasi `POST /api/diklat` untuk menambah laporan diklat dengan validasi field laporan | Endpoint create diklat passing unit test dasar | [Day 10](https://drive.google.com/...) |
| 11 | 16/2/2026 | Develop `PATCH /api/diklat/{id}` dan `DELETE /api/diklat/{id}` dengan authorization kepemilikan data | 2 endpoint update & delete diklat selesai | [Day 11](https://drive.google.com/...) |
| 12 | 17/2/2026 | Implementasi `POST /api/diklat/{id}/upload-laporan` untuk upload file laporan diklat ke storage | Endpoint upload laporan diklat berfungsi | [Day 12](https://drive.google.com/...) |
| 13 | 18/2/2026 | Develop fitur Generate CV `GET /api/generate/cv` menggunakan library PDF (dompdf) dengan template CV pegawai | Generate CV PDF berfungsi | [Day 13](https://drive.google.com/...) |
| 14 | 19/2/2026 | Desain skema tabel `riwayat_pendidikan` (institusi, jurusan, tahun_lulus, no_ijazah) + CRUD `/api/riwayat-karir/pendidikan` | 4 endpoint CRUD riwayat pendidikan selesai | [Day 14](https://drive.google.com/...) |
| 15 | 20/2/2026 | Implementasi CRUD `/api/riwayat-karir/jabatan` lengkap dengan validasi tanggal mulai/akhir jabatan | 4 endpoint CRUD riwayat jabatan selesai | [Day 15](https://drive.google.com/...) |
| 16 | 23/2/2026 | Implementasi CRUD `/api/riwayat-karir/pangkat` dengan relasi ke master pangkat/golongan | 4 endpoint CRUD riwayat pangkat selesai | [Day 16](https://drive.google.com/...) |
| 17 | 24/2/2026 | Develop CRUD `/api/riwayat-karir/str` dengan field nomor STR & tanggal masa berlaku | 4 endpoint CRUD riwayat STR selesai | [Day 17](https://drive.google.com/...) |
| 18 | 25/2/2026 | Develop CRUD `/api/riwayat-karir/sip` dengan field nomor SIP & masa berlaku | 4 endpoint CRUD riwayat SIP selesai | [Day 18](https://drive.google.com/...) |
| 19 | 26/2/2026 | Implementasi CRUD `/api/riwayat-karir/penugasan-klinis` untuk pencatatan kewenangan klinis | 4 endpoint CRUD penugasan klinis selesai | [Day 19](https://drive.google.com/...) |
| 20 | 27/2/2026 | Develop Change Request Admin: `GET /api/admin/change-requests`, accept & reject; Sprint 1 review bersama supervisor | 3 endpoint change-request + review Sprint 1 (100%) | [Day 20](https://drive.google.com/...) |
| 21 | 2/3/2026 | Sprint 2 planning, desain skema 5 tabel data keluarga & dokumentasi relasi ke tabel pegawai | ERD modul keluarga + backlog Sprint 2 | [Day 21](https://drive.google.com/...) |
| 22 | 3/3/2026 | Buat migration & model `pasangan`, implementasi CRUD `/api/keluarga/pasangan` | Tabel + 4 endpoint CRUD pasangan selesai | [Day 22](https://drive.google.com/...) |
| 23 | 4/3/2026 | Implementasi CRUD `/api/keluarga/anak` dengan validasi tanggal lahir & relasi pegawai | 4 endpoint CRUD anak selesai | [Day 23](https://drive.google.com/...) |
| 24 | 5/3/2026 | Implementasi CRUD `/api/keluarga/orang-tua` untuk data ayah/ibu pegawai | 4 endpoint CRUD orang tua selesai | [Day 24](https://drive.google.com/...) |
| 25 | 6/3/2026 | Develop CRUD `/api/keluarga/kontak-darurat` dengan validasi nomor telepon | 4 endpoint CRUD kontak darurat selesai | [Day 25](https://drive.google.com/...) |
| 26 | 9/3/2026 | Implementasi `TanggunganLainController` + Service + Repository, CRUD `/api/keluarga/tanggungan-lain` | 4 endpoint CRUD tanggungan lain selesai | [Day 26](https://drive.google.com/...) |
| 27 | 10/3/2026 | Develop React component `KeluargaForm` dengan tab pasangan/anak/orang tua dan integrasi ke endpoint keluarga | 1 page + 5 sub-komponen keluarga ter-integrasi | [Day 27](https://drive.google.com/...) |
| 28 | 11/3/2026 | Implementasi CRUD Master Diklat HRD `POST/PUT /api/hrd/diklat` untuk jadwal diklat terpusat | Endpoint master diklat HRD selesai | [Day 28](https://drive.google.com/...) |
| 29 | 12/3/2026 | Develop manajemen peserta diklat `GET /api/hrd/diklat/{id}/peserta` dengan relasi pivot | Endpoint daftar peserta diklat selesai | [Day 29](https://drive.google.com/...) |
| 30 | 13/3/2026 | Implementasi `PATCH /api/hrd/diklat/{id}/status/layak` untuk verifikasi kelayakan laporan diklat | Endpoint status kelayakan selesai | [Day 30](https://drive.google.com/...) |
| 31 | 16/3/2026 | Implementasi `PATCH /api/hrd/diklat/{id}/status/validasi` untuk verifikasi validasi laporan | Endpoint status validasi selesai | [Day 31](https://drive.google.com/...) |
| 32 | 17/3/2026 | Integrasi Fonnte WhatsApp API ke dalam `WhatsappService::sendMessage()` dengan konfigurasi token | WhatsappService berfungsi (test kirim WA) | [Day 32](https://drive.google.com/...) |
| 33 | 18/3/2026 | Implementasi auto-notif WA `HrdService::sendNotifDiklatWa()` yang ter-trigger otomatis saat update status kelayakan & validasi | Auto-notif WA diklat aktif | [Day 33](https://drive.google.com/...) |
| 34 | 19/3/2026 | Buat master data repository & endpoint `/api/form/*` untuk jenis_diklat dan tipe_peserta | Master data jenis/tipe diklat selesai | [Day 34](https://drive.google.com/...) |
| 35 | 20/3/2026 | Lengkapi CRUD master data `/api/form/*` untuk kategori_pendidikan, jenis_pegawai, dan profesi | Master data tambahan selesai (CRUD) | [Day 35](https://drive.google.com/...) |
| 36 | 23/3/2026 | Develop `GET /api/generate/laporan-diklat` untuk cetak rekap diklat dalam format PDF | Cetak rekap diklat PDF berfungsi | [Day 36](https://drive.google.com/...) |
| 37 | 24/3/2026 | Implementasi `GET /api/diklat/all` untuk melihat data diklat seluruh pegawai (HRD & Direktur) | Endpoint diklat-all selesai | [Day 37](https://drive.google.com/...) |
| 38 | 25/3/2026 | Develop React page `HrdDiklatManagement` dengan tabel peserta dan tombol verifikasi kelayakan/validasi | 1 page manajemen diklat HRD ter-integrasi | [Day 38](https://drive.google.com/...) |
| 39 | 26/3/2026 | Testing integrasi notifikasi WhatsApp end-to-end (perubahan status → WA terkirim ke pegawai) dan perbaikan format pesan | 5 test case WA passing, 1 bug format pesan fixed | [Day 39](https://drive.google.com/...) |
| 40 | 27/3/2026 | Sprint 2 review & retrospective bersama supervisor, dokumentasi endpoint baru ke catatan internal | Review Sprint 2 (100%) + catatan endpoint | [Day 40](https://drive.google.com/...) |
| 41 | 30/3/2026 | Sprint 3 planning, analisis kebutuhan filter & dashboard, desain query strategi monitoring STR/SIP | Backlog Sprint 3 + desain query | [Day 41](https://drive.google.com/...) |
| 42 | 31/3/2026 | Implementasi `AdminPegawaiRepository` dengan 8+ kondisi filter (profesi, jenis, pendidikan, kelengkapan, status) | Repository filter pegawai selesai | [Day 42](https://drive.google.com/...) |
| 43 | 1/4/2026 | Develop `POST /api/pegawai` untuk menambah data pegawai baru oleh Admin dengan validasi NIK unik | Endpoint tambah pegawai selesai | [Day 43](https://drive.google.com/...) |
| 44 | 2/4/2026 | Implementasi `PATCH /api/pegawai/{id}/change-role` untuk mengubah role/status pegawai | Endpoint change-role selesai | [Day 44](https://drive.google.com/...) |
| 45 | 3/4/2026 | Develop Dashboard Admin `GET /api/admin/change-requests` statistik permintaan perubahan data | Endpoint dashboard admin (statistik) selesai | [Day 45](https://drive.google.com/...) |
| 46 | 6/4/2026 | Implementasi `GET /api/pegawai` daftar pegawai dengan integrasi query params filter dari repository | Endpoint list pegawai + filter berfungsi | [Day 46](https://drive.google.com/...) |
| 47 | 7/4/2026 | Develop `GET /api/pegawai/{id}` detail pegawai lengkap (profil, keluarga, riwayat karir) dengan eager loading | Endpoint detail pegawai selesai | [Day 47](https://drive.google.com/...) |
| 48 | 8/4/2026 | Implementasi `HrdDashboardRepository` agregasi statistik diklat, STR/SIP, dan jumlah pegawai | Dashboard HRD (real-time stats) selesai | [Day 48](https://drive.google.com/...) |
| 49 | 9/4/2026 | Implementasi `DirekturDashboardRepository` dengan statistik real-time dari database untuk Direktur RS | Dashboard Direktur selesai | [Day 49](https://drive.google.com/...) |
| 50 | 10/4/2026 | Develop logic monitoring STR/SIP untuk deteksi masa berlaku < 3 bulan (akan habis) | Logic deteksi masa berlaku berfungsi | [Day 50](https://drive.google.com/...) |
| 51 | 13/4/2026 | Implementasi `GET /api/str-sip` untuk data STR/SIP aktif & akan habis dengan kategori status | Endpoint monitoring STR/SIP selesai | [Day 51](https://drive.google.com/...) |
| 52 | 14/4/2026 | Tambah filter pegawai berdasarkan waktu masuk (`tgl_masuk_dari`, `tgl_masuk_sampai`, `tahun_masuk`) | Filter waktu masuk berfungsi | [Day 52](https://drive.google.com/...) |
| 53 | 15/4/2026 | Develop fitur Settings WhatsApp Token (Admin) untuk menyimpan & update token Fonnte | Endpoint settings WA token selesai | [Day 53](https://drive.google.com/...) |
| 54 | 16/4/2026 | Implementasi notifikasi in-app: list notifikasi, mark as read, mark all read | 3 endpoint notifikasi in-app selesai | [Day 54](https://drive.google.com/...) |
| 55 | 17/4/2026 | Develop React dashboard component dengan Chart.js untuk visualisasi statistik diklat & pegawai | 1 dashboard page + 3 chart komponen | [Day 55](https://drive.google.com/...) |
| 56 | 20/4/2026 | Implementasi Excel export daftar pegawai (maatwebsite/excel) dengan conditional formatting | Fitur export Excel pegawai selesai | [Day 56](https://drive.google.com/...) |
| 57 | 21/4/2026 | Optimasi query untuk mengatasi N+1 problem pada endpoint list pegawai menggunakan eager loading & select kolom | Query teroptimasi, response time turun | [Day 57](https://drive.google.com/...) |
| 58 | 22/4/2026 | Develop React page monitoring STR/SIP dengan badge warna status (aktif/akan habis/expired) | 1 page monitoring STR/SIP ter-integrasi | [Day 58](https://drive.google.com/...) |
| 59 | 23/4/2026 | Integration testing dashboard Admin/HRD/Direktur dan validasi akurasi angka statistik vs data DB | 6 test case dashboard passing, 2 bug stats fixed | [Day 59](https://drive.google.com/...) |
| 60 | 24/4/2026 | Sprint 3 review & retrospective, dokumentasi endpoint monitoring dan dashboard | Review Sprint 3 (100%) + dokumentasi | [Day 60](https://drive.google.com/...) |
| 61 | 27/4/2026 | Sprint 4 planning, breakdown fitur manajemen data pegawai oleh HRD & rencana testing akhir | Backlog Sprint 4 + rencana QA | [Day 61](https://drive.google.com/...) |
| 62 | 28/4/2026 | Implementasi `PATCH /api/hrd/pegawai/{id}/inti` untuk update data inti pegawai (nama, NIK, jabatan) | Endpoint update data inti selesai | [Day 62](https://drive.google.com/...) |
| 63 | 29/4/2026 | Develop `PATCH/POST /api/hrd/pegawai/{id}/pribadi` update data pribadi + upload foto/KTP/KK oleh HRD | Endpoint update data pribadi selesai | [Day 63](https://drive.google.com/...) |
| 64 | 30/4/2026 | Implementasi CRUD keluarga pegawai oleh HRD `/api/hrd/pegawai/{id}/keluarga/*` (5 jenis relasi) | Endpoint CRUD keluarga pegawai (HRD) selesai | [Day 64](https://drive.google.com/...) |
| 65 | 1/5/2026 | Develop CRUD riwayat jabatan pegawai oleh HRD `/api/hrd/pegawai/{id}/riwayat-karir/jabatan` | 4 endpoint riwayat jabatan (HRD) selesai | [Day 65](https://drive.google.com/...) |
| 66 | 4/5/2026 | Implementasi CRUD riwayat pangkat pegawai oleh HRD `/api/hrd/pegawai/{id}/riwayat-karir/pangkat` | 4 endpoint riwayat pangkat (HRD) selesai | [Day 66](https://drive.google.com/...) |
| 67 | 5/5/2026 | Implementasi CRUD riwayat STR pegawai oleh HRD `/api/hrd/pegawai/{id}/riwayat-karir/str` | 4 endpoint riwayat STR (HRD) selesai | [Day 67](https://drive.google.com/...) |
| 68 | 6/5/2026 | Implementasi CRUD riwayat SIP pegawai oleh HRD `/api/hrd/pegawai/{id}/riwayat-karir/sip` | 4 endpoint riwayat SIP (HRD) selesai | [Day 68](https://drive.google.com/...) |
| 69 | 7/5/2026 | Develop CRUD penugasan klinis pegawai oleh HRD `/api/hrd/pegawai/{id}/riwayat-karir/penugasan-klinis` | 4 endpoint penugasan klinis (HRD) selesai | [Day 69](https://drive.google.com/...) |
| 70 | 8/5/2026 | Implementasi `HrdRiwayatKarirController` + Service + Repository untuk CRUD riwayat pendidikan pegawai oleh HRD | 5 route riwayat pendidikan (HRD) selesai | [Day 70](https://drive.google.com/...) |
| 71 | 11/5/2026 | Develop `MessageController` kirim pesan WA manual `POST /api/pesan/pegawai/{id}` ke pegawai | Endpoint pesan WA manual selesai | [Day 71](https://drive.google.com/...) |
| 72 | 12/5/2026 | Implementasi `sendReminderStrSip` `POST /api/hrd/pegawai/{id}/reminder/str-sip` untuk reminder dokumen STR/SIP | Endpoint reminder WA STR/SIP selesai | [Day 72](https://drive.google.com/...) |
| 73 | 13/5/2026 | Implementasi `sendReminderPenugasanKlinis` `POST /api/hrd/pegawai/{id}/reminder/penugasan-klinis` | Endpoint reminder WA penugasan klinis selesai | [Day 73](https://drive.google.com/...) |
| 74 | 14/5/2026 | Menulis 45+ unit test PHPUnit untuk Auth, Profile, Diklat, dan Riwayat Karir services | 45+ test case dibuat, coverage service utama | [Day 74](https://drive.google.com/...) |
| 75 | 15/5/2026 | Menyusun Postman collection berisi 177 endpoint API dengan environment & contoh request/response | Postman collection lengkap (177 endpoint) | [Day 75](https://drive.google.com/...) |
| 76 | 18/5/2026 | Bug fixing round berdasarkan hasil testing: perbaikan validasi upload, response code, & edge case filter | 6 bug fixed, regression test passing | [Day 76](https://drive.google.com/...) |
| 77 | 19/5/2026 | Membuat API documentation format OpenAPI/Swagger untuk seluruh modul SIMPEG | Swagger docs ter-generate & dapat diakses | [Day 77](https://drive.google.com/...) |
| 78 | 20/5/2026 | Load testing dengan Apache JMeter pada endpoint kritikal (login, list pegawai, dashboard), analisis throughput | Laporan load test + rekomendasi optimasi | [Day 78](https://drive.google.com/...) |
| 79 | 21/5/2026 | Deploy aplikasi ke staging server dan setup pipeline GitHub Actions CI/CD (test + deploy otomatis) | Staging live + CI/CD pipeline aktif | [Day 79](https://drive.google.com/...) |
| 80 | 22/5/2026 | Finalisasi dokumentasi proyek, penyusunan Dokumen Pertanggungjawaban Backend (177 route, 45 fitur), serah terima ke supervisor | Dokumen final + handover proyek (100%) | [Day 80](https://drive.google.com/...) |

## RINGKASAN PERFORMA

- **Total Endpoint API Developed**: 177 route (45+ fitur backend)
- **Total Frontend Components**: 20+ (Profile, Keluarga, Diklat, Dashboard, Monitoring STR/SIP)
- **Bug Fixed**: 15+ (format WA, validasi upload, akurasi statistik, edge case filter)
- **Test Cases Created**: 45+ unit test PHPUnit + 177 request Postman
- **Documentation Pages**: 5+ (Swagger/OpenAPI, Postman, Dokumen Pertanggungjawaban, laporan load test, catatan internal)
- **Achievements**:
  - 4 Sprint selesai 100% (Profile/Diklat/Riwayat → Keluarga/HRD Diklat/Master Data → Admin/Monitoring/Dashboard → HRD Data Management/Reminder WA)
  - Integrasi WhatsApp Fonnte dengan auto-notification & reminder
  - Dashboard real-time untuk Admin, HRD, dan Direktur RS
  - Monitoring masa berlaku STR/SIP otomatis (< 3 bulan)
  - Deploy ke staging dengan pipeline CI/CD GitHub Actions