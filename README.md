# 📋 Dokumentasi Arsitektur & Spesifikasi Proyek: VetaHealth

Platform Landing Page Layanan Kesehatan Digital, Konsultasi Dokter Online, & Real-Time Vital Signs Tracker.

---

## 1. Ringkasan Eksekutif & Konsep Produk

### 1.1 Visi Produk
**VetaHealth** dirancang sebagai portal layanan kesehatan digital modern yang memadukan kenyamanan konsultasi medis online dengan pemantauan metrik vital kesehatan interaktif. Platform ini mengedepankan pengalaman pengguna (UX) yang tenang, steril, terpercaya, dan tanggap darurat dengan antarmuka yang bersih serta responsif.

### 1.2 Target Pengguna
- **Pasien Mandiri**: Pengguna yang membutuhkan konsultasi dokter spesialis tanpa harus antre di faskes fisik.
- **Pemeriksa Rutin / Telemonitoring**: Individu yang ingin melakukan pengecekan berkala terhadap tanda vital (Detak Jantung, Saturasi Oksigen, Tekanan Darah).
- **Pencari Layanan Darurat Ringan**: Pasien yang membutuhkan panduan triage awal cepat sebelum tindakan medis lanjutan.

---

## 2. Pilihan Teknologi & Peran Komponen

| Komponen | Teknologi | Peran & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantik | Struktur konten yang ramah SEO, aksesibel (ARIA compliant), dan terorganisir. |
| **Styling** | Tailwind CSS (CDN) | Utilitas styling modern dengan palet warna medis profesional (*Emerald*, *Teal*, *Cyan*), glassmorphism, dan sistem grid responsif. |
| **Reaktivitas UI & State** | Alpine.js | Menangani state modal pop-up konsultasi, *multi-step wizard* booking, dropdown dinamis, dan notifikasi toast tanpa bundle framework berat. |
| **Asynchronous Data Transfer** | HTMX | Melakukan *partial page update* untuk simulasi monitoring tanda vital secara berkala (`hx-get`, polling interval/on-demand) tanpa full reload. |
| **Logika Tambahan & Canvas** | JavaScript Native | Menggambar gelombang EKG/detak jantung (*Pulse Wave Canvas*), format waktu dinamis, dan fallback data mock. |

---

## 3. Desain Sistem & Identitas Visual

### 3.1 Skema Warna (Medical Clean & Modern)
Palet warna dipilih untuk membangkitkan rasa aman, higienis, dan ketenangan:

- **Primary Emerald (`emerald-600` / `#059669`)**: Melambangkan kesehatan, pemulihan, dan keamanan klinis.
- **Accent Cyan (`cyan-500` / `#06b6d4`)**: Merepresentasikan teknologi mutakhir, kecerdasan digital, dan presisi.
- **Secondary Teal (`teal-700` / `#0f766e`)**: Memberikan kontras profesional, kedalaman estetika, dan legitimasi medis.
- **Background Tones**:
  - `bg-slate-50` / `bg-white` untuk bidang utama.
  - `bg-gradient-to-br from-emerald-50/50 via-cyan-50/30 to-teal-50/50` untuk latar belakang hero & dashboard.
- **Status Indicators**:
  - *Normal / Optimal*: Emerald (`emerald-500`)
  - *Perhatian / Elevated*: Amber (`amber-500`)
  - *Kritis / Alert*: Rose (`rose-500`)

### 3.2 Tipografi & Ikonografi
- **Font**: Inter / Plus Jakarta Sans (Modern geometric sans-serif dengan legibilitas tinggi).
- **Icons**: Lucide Icons atau Feather Icons berbasis SVG inline yang ringan dan tajam pada layar Retina/HiDPI.

---

## 4. Struktur Halaman & Fitur Utama

```
VetaHealth Landing Page
│
├── 1. Sticky Navigation Bar
│   ├── Logo & Brand (VetaHealth)
│   ├── Menu Links (Layanan, Cek Vitals, Dokter Spesialis, FAQ)
│   ├── Indikator Status Sistem / Jam Operasional
│   └── Tombol CTA ("Konsultasi Sekarang" -> Buka Modal Alpine.js)
│
├── 2. Hero Section
│   ├── Headline Persuasif & Value Proposition
│   ├── Quick Action Badges (24/7 Siaga, Dokter Terverifikasi IDI, Enkripsi Medis)
│   ├── CTA Utama ("Booking Jadwal Medis" & "Demo Cek Vitals")
│   └── Ilustrasi Interaktif / Mockup Pratinjau Dashboard Pasien
│
├── 3. Live Vitals Telemetry Widget (Fitur HTMX)
│   ├── Panel Pemantauan Tanda Vital Real-Time:
│   │   ├── Heart Rate (BPM) + Canvas Gelombang EKG Dinamis
│   │   ├── Tekanan Darah (Systolic/Diastolic mmHg)
│   │   ├── Saturasi Oksigen (SpO2 %)
│   │   ├── Suhu Tubuh (°C)
│   │   └── Status Kondisi Terkini (Normal / Waspada)
│   └── Kontrol Interaktif:
│       ├── Tombol "Refresh Status / Sinkronisasi Sensor" (`hx-get`)
│       ├── Toggle Mode Simulasi Otomatis (Polling setiap 5 detik)
│       └── Riwayat Diagnostik Singkat
│
├── 4. Daftar Dokter & Spesialisasi
│   ├── Filter Kategori (Umum, Jantung, Pediatri, Jiwa, Saraf)
│   └── Kartu Profil Dokter (Foto, Rating, Pengalaman, Jadwal, Tombol Konsultasi)
│
├── 5. Modal Booking Konsultasi Interaktif (Fitur Alpine.js)
│   ├── Multi-step Form Wizard:
│   │   ├── Langkah 1: Pilih Jenis Konsultasi & Dokter
│   │   ├── Langkah 2: Pilih Tanggal & Sesi Waktu
│   │   ├── Langkah 3: Data Pasien & Keluhan Singkat
│   │   └── Langkah 4: Ringkasan & Konfirmasi Tiket Konsultasi
│   ├── Validasi Input Real-time
│   └── Feedback Toast Sukses Booking
│
├── 6. Fitur Layanan Unggulan & Alur Kerja
│   ├── 3 Langkah Konsultasi (Daftar -> Telekonsultasi -> Tebus Resep Digital)
│   └── Sertifikasi & Standar Keamanan Data Medis
│
├── 7. Testimoni & FAQ Interaktif (Accordion Alpine.js)
│
└── 8. Footer Komprehensif
    ├── Disclaimer Medis Resmi
    ├── Kontak Darurat (Emergency Hotline 119)
    └── Hak Cipta & Tautan Kebijakan Privasi
```

---

## 5. Rencana Arsitektur Teknis

### 5.1 Alur Kerja HTMX: Cek Vitals Real-Time
Untuk menyajikan data tanda vital secara asinkron tanpa memerlukan backend server yang kompleks:
1. Target Kontainer: `<div id="vitals-display">...</div>`.
2. Pemicu Asinkron:
   - Manual via Tombol: `<button hx-get="partials/vitals-data.html" hx-target="#vitals-display" hx-swap="innerHTML">`.
   - Polling Otomatis: Menggunakan atribut `hx-trigger="load, every 6s"`.
3. Komponen partial respons memuat nilai acak realistis yang mencerminkan fluktuasi biologis normal beserta label status kesehatannya.
4. Digabungkan dengan animasi canvas native JavaScript yang merender denyut grafik EKG secara sinkron saat data baru tiba (`htmx:afterSwap` event listener).

### 5.2 Alur Kerja Alpine.js: Modal Booking Interaktif
State utama diatur via `x-data="bookingModal()"`:
- `isOpen`: Boolean untuk menampilkan/menyembunyikan modal dengan transisi backdrop blur.
- `step`: Mengontrol tahapan wizard (1, 2, 3, 4).
- `formData`: Menyimpan state reaktif (spesialis, dokter, tanggal, jam, nama pasien, no telp, keluhan).
- Metode validasi langkah demi langkah sebelum lanjut ke tahap berikutnya.
- Pengiriman formulir memicu efek animasi loading dan meluncurkan Toast Notifikasi Konfirmasi Jadwal.

---

## 6. Struktur Berkas Proyek

```
d:\Development\VetaHealth\
│
├── index.html                 # Halaman utama landing page & integrasi modul
├── telekonsultasi.html        # Ruang live video telekonsultasi, chat medis, & e-resep
├── cek-gejala.html            # AI Symptom Checker & wizard triage keluhan klinis
├── vitals-dashboard.html      # Portal pemantauan kesehatan pasien & rekam biometrik
├── DOKUMENTASI_PROYEK.md      # Dokumen spesifikasi & arsitektur proyek
│
├── partials/                  # Endpoint parsial respons asynchronous HTMX
│   ├── vitals-normal.html     # Status vitals normal / optimal (72 BPM)
│   ├── vitals-elevated.html   # Status vitals fluktuasi / waspada (96 BPM)
│   └── vitals-active.html     # Status vitals setelah aktivitas fisik (118 BPM)
│
└── assets/js/
    ├── ecg-visualizer.js      # Generator gelombang EKG canvas osiloskop dinamis
    └── app.js                 # Inisialisasi Alpine data helper, Web Audio API, & listener HTMX
```

---

## 7. Rencana Pengujian & Validasi

1. **Responsivitas**: Uji layout pada breakpoint mobile (`sm`), tablet (`md`), laptop (`lg`), dan ultra-wide (`xl`).
2. **Kinerja HTMX**: Verifikasi transisi swap parsial tanpa layout shift (CLS rendah).
3. **Aksesibilitas Modal**: Tombol `Escape` menutup modal, trap focus, dan scroll-lock pada elemen body saat modal terbuka.
4. **Validasi Desain**: Memastikan estetika konsisten dalam nuansa Emerald, Cyan, dan Teal yang ramah pengguna.
