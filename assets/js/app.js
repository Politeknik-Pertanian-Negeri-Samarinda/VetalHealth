/**
 * VetaHealth Core Interaction & Alpine Components
 */

// Web Audio API Beep Generator (Subtle Medical Monitor Sound)
class MedicalAudio {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playBeep(freq = 880, duration = 0.08) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio unavailable:", e);
    }
  }
}

window.medicalAudio = new MedicalAudio();

/**
 * Alpine Data Component: Booking Modal Multi-Step
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('bookingModal', () => ({
    isOpen: false,
    step: 1,
    isSubmitting: false,
    bookingSuccess: false,
    bookedCode: '',
    
    // Form fields
    form: {
      category: 'Umum',
      doctorId: 'dr-anita',
      doctorName: 'dr. Anita Rahmawati, Sp.JP',
      doctorFee: 'Rp 150.000',
      date: '',
      timeSlot: '09:00 - 09:30 WIB',
      patientName: '',
      patientAge: '',
      phone: '',
      notes: '',
      consultType: 'video' // 'video' | 'chat'
    },

    // Doctors catalog
    doctors: [
      { id: 'dr-anita', name: 'dr. Anita Rahmawati, Sp.JP', spec: 'Jantung & Pembuluh Darah', exp: '12 Tahun', fee: 'Rp 220.000', rating: 4.9, reviews: 312, avatar: '👩‍⚕️' },
      { id: 'dr-dimas', name: 'dr. Dimas Wardhana, Sp.A', spec: 'Kesehatan Anak (Pediatri)', exp: '9 Tahun', fee: 'Rp 180.000', rating: 4.8, reviews: 245, avatar: '👨‍⚕️' },
      { id: 'dr-maya', name: 'dr. Maya Farida, Sp.PD', spec: 'Penyakit Dalam', exp: '14 Tahun', fee: 'Rp 200.000', rating: 4.9, reviews: 489, avatar: '👩‍⚕️' },
      { id: 'dr-hendra', name: 'dr. Hendra Pratama, Sp.KJ', spec: 'Kesehatan Jiwa & Psikiatri', exp: '8 Tahun', fee: 'Rp 195.000', rating: 4.9, reviews: 182, avatar: '👨‍⚕️' },
      { id: 'dr-clara', name: 'dr. Clara Vanya, M.Ked.Klin', spec: 'Dokter Umum & Preventif', exp: '6 Tahun', fee: 'Rp 95.000', rating: 4.8, reviews: 620, avatar: '👩‍⚕️' }
    ],

    init() {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.form.date = tomorrow.toISOString().split('T')[0];
    },

    openModal(preselectDoctorId = null) {
      this.isOpen = true;
      this.step = 1;
      this.bookingSuccess = false;
      document.body.classList.add('overflow-hidden');

      if (preselectDoctorId) {
        const found = this.doctors.find(d => d.id === preselectDoctorId);
        if (found) {
          this.form.doctorId = found.id;
          this.form.doctorName = found.name;
          this.form.doctorFee = found.fee;
          this.step = 2; // Langsung ke pilih waktu jika dokter sudah dipilih
        }
      }
    },

    closeModal() {
      this.isOpen = false;
      document.body.classList.remove('overflow-hidden');
    },

    selectDoctor(doc) {
      this.form.doctorId = doc.id;
      this.form.doctorName = doc.name;
      this.form.doctorFee = doc.fee;
      this.nextStep();
    },

    nextStep() {
      if (this.step === 1 && !this.form.doctorId) {
        alert("Silakan pilih dokter terlebih dahulu.");
        return;
      }
      if (this.step === 2 && (!this.form.date || !this.form.timeSlot)) {
        alert("Silakan tentukan tanggal dan sesi waktu konsultasi.");
        return;
      }
      if (this.step === 3) {
        if (!this.form.patientName.trim() || !this.form.phone.trim()) {
          alert("Nama lengkap dan nomor WhatsApp wajib diisi.");
          return;
        }
      }
      if (this.step < 4) {
        this.step++;
      }
    },

    prevStep() {
      if (this.step > 1) {
        this.step--;
      }
    },

    submitBooking() {
      this.isSubmitting = true;
      // Simulasi panggilan API booking
      setTimeout(() => {
        this.isSubmitting = false;
        this.bookingSuccess = true;
        this.bookedCode = 'VETA-' + Math.floor(100000 + Math.random() * 900000);
        
        // Panggil toast alert
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            title: 'Janji Temu Berhasil Terdaftar!',
            message: `Tiket ${this.bookedCode} terkonfirmasi dengan ${this.form.doctorName}.`
          }
        }));
      }, 1200);
    }
  }));

  /**
   * Alpine Data Component: Vitals Simulation & Audio Toggle
   */
  Alpine.data('vitalsSimulator', () => ({
    autoPolling: false,
    activeScenario: 'normal',
    soundOn: false,
    pollInterval: null,

    toggleSound() {
      this.soundOn = !this.soundOn;
      window.medicalAudio.soundEnabled = this.soundOn;
      if (this.soundOn) {
        window.medicalAudio.playBeep(880, 0.1);
      }
    },

    toggleAutoPolling() {
      this.autoPolling = !this.autoPolling;
      if (this.autoPolling) {
        // Rotasi skenario otomatis setiap 6 detik
        this.pollInterval = setInterval(() => {
          const scenarios = ['normal', 'elevated', 'active'];
          const currentIndex = scenarios.indexOf(this.activeScenario);
          const nextIndex = (currentIndex + 1) % scenarios.length;
          this.loadScenario(scenarios[nextIndex]);
        }, 6000);
      } else {
        if (this.pollInterval) clearInterval(this.pollInterval);
      }
    },

    loadScenario(scenarioName) {
      this.activeScenario = scenarioName;
      const targetUrl = `partials/vitals-${scenarioName}.html`;
      
      // Menggunakan HTMX secara programmatic atau memicu hx-get
      htmx.ajax('GET', targetUrl, {
        target: '#vitals-display',
        swap: 'innerHTML'
      });
    }
  }));

  /**
   * Alpine Data Component: Doctor Filter
   */
  Alpine.data('doctorFilter', () => ({
    selectedCategory: 'all',
    doctors: [
      { id: 'dr-anita', name: 'dr. Anita Rahmawati, Sp.JP', spec: 'Spesialis Jantung & Pembuluh', cat: 'jantung', exp: '12 Tahun', fee: 'Rp 220.000', rating: 4.9, reviews: 312, status: 'Online', badge: 'Terfavorit' },
      { id: 'dr-dimas', name: 'dr. Dimas Wardhana, Sp.A', spec: 'Spesialis Anak & Tumbuh Kembang', cat: 'anak', exp: '9 Tahun', fee: 'Rp 180.000', rating: 4.8, reviews: 245, status: 'Online', badge: 'Pediatri' },
      { id: 'dr-maya', name: 'dr. Maya Farida, Sp.PD', spec: 'Spesialis Penyakit Dalam', cat: 'dalam', exp: '14 Tahun', fee: 'Rp 200.000', rating: 4.9, reviews: 489, status: 'Sibuk', badge: 'Konsultan' },
      { id: 'dr-hendra', name: 'dr. Hendra Pratama, Sp.KJ', spec: 'Spesialis Kedokteran Jiwa', cat: 'jiwa', exp: '8 Tahun', fee: 'Rp 195.000', rating: 4.9, reviews: 182, status: 'Online', badge: 'Psikiatri' },
      { id: 'dr-clara', name: 'dr. Clara Vanya, M.Ked.Klin', spec: 'Dokter Umum & Pencegahan', cat: 'umum', exp: '6 Tahun', fee: 'Rp 95.000', rating: 4.8, reviews: 620, status: 'Online', badge: 'Siaga 24/7' },
      { id: 'dr-reza', name: 'dr. Reza Pramana, Sp.S', spec: 'Spesialis Saraf & Neurologi', cat: 'saraf', exp: '11 Tahun', fee: 'Rp 210.000', rating: 4.9, reviews: 154, status: 'Online', badge: 'Neurologi' }
    ],

    get filteredDoctors() {
      if (this.selectedCategory === 'all') return this.doctors;
      return this.doctors.filter(d => d.cat === this.selectedCategory);
    }
  }));

  /**
   * Alpine Data Component: Toast Notification Controller
   */
  Alpine.data('toastNotification', () => ({
    show: false,
    title: '',
    message: '',
    timeout: null,

    init() {
      window.addEventListener('show-toast', (e) => {
        this.title = e.detail.title || 'Notifikasi';
        this.message = e.detail.message || '';
        this.show = true;

        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.show = false;
        }, 5000);
      });
    }
  }));
});

// Listener saat HTMX selesai menukar data (htmx:afterSwap)
document.addEventListener('htmx:afterSwap', function(evt) {
  if (evt.detail.target.id === 'vitals-display') {
    // Perbarui waktu sinkronisasi
    const timeEls = document.querySelectorAll('.sync-time');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    timeEls.forEach(el => el.textContent = timeStr);

    // Ambil nilai BPM baru dan sinkronkan kecepatan animasi EKG
    const bpmEl = document.getElementById('val-bpm');
    if (bpmEl && window.ecgInstance) {
      const bpmVal = parseInt(bpmEl.textContent.trim(), 10);
      if (!isNaN(bpmVal)) {
        window.ecgInstance.setBpm(bpmVal);
        // Bunyikan beep medis jika diaktifkan
        window.medicalAudio.playBeep(bpmVal > 100 ? 1040 : 880, 0.08);
      }
    }
  }
});

// Jalankan ECG saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initECG === 'function') {
    window.initECG();
  }
});
