/**
 * ECG Visualizer (Pulse Wave Canvas)
 * Menggambar oscilloscope elektrokardiogram (EKG) dinamis secara terus menerus
 * dengan grid medis dan puncak denyut gelombang P-Q-R-S-T.
 */
class ECGVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.x = 0;
    this.currentBpm = 72;
    this.speed = 1.8;
    this.history = [];
    this.isRunning = true;
    this.phase = 0;

    this.initCanvasSize();
    window.addEventListener('resize', () => this.initCanvasSize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = (rect.height || 100) * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height || 100;
    this.midY = this.displayHeight / 2;
    this.drawBackgroundGrid();
  }

  setBpm(bpm) {
    this.currentBpm = Math.max(50, Math.min(160, bpm));
    // Kecepatan disesuaikan dengan BPM
    this.speed = 1.4 + (this.currentBpm - 60) * 0.02;
  }

  drawBackgroundGrid() {
    const { ctx, displayWidth, displayHeight } = this;
    ctx.save();
    ctx.fillStyle = '#06131c'; // Deep Medical Monitor Blue-Dark
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Grid garis halus medis
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)'; // Cyan soft grid

    const gridSize = 16;
    for (let gx = 0; gx < displayWidth; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, displayHeight);
      ctx.stroke();
    }

    for (let gy = 0; gy < displayHeight; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(displayWidth, gy);
      ctx.stroke();
    }
    ctx.restore();
  }

  getYOffset(phase) {
    // Kurva P-Q-R-S-T
    // Phase 0..1
    const p = phase % 1;
    let offset = 0;

    if (p > 0.15 && p < 0.22) {
      // P wave (atrial depolarization)
      offset = -Math.sin((p - 0.15) / 0.07 * Math.PI) * 7;
    } else if (p >= 0.24 && p < 0.26) {
      // Q dip
      offset = 4;
    } else if (p >= 0.26 && p < 0.30) {
      // R peak (ventricular depolarization)
      const rRatio = (p - 0.26) / 0.04;
      if (rRatio < 0.5) {
        offset = -(rRatio * 2) * 36;
      } else {
        offset = -36 + (rRatio - 0.5) * 2 * 46;
      }
    } else if (p >= 0.30 && p < 0.33) {
      // S dip
      offset = 10 * Math.sin((p - 0.30) / 0.03 * Math.PI);
    } else if (p > 0.45 && p < 0.60) {
      // T wave (ventricular repolarization)
      offset = -Math.sin((p - 0.45) / 0.15 * Math.PI) * 11;
    } else {
      // Baseline noise kecil
      offset = (Math.random() - 0.5) * 1.2;
    }
    return offset;
  }

  animate() {
    if (!this.isRunning) return;

    const { ctx, displayWidth, displayHeight, midY } = this;
    const sweepWidth = 14;

    // Bersihkan zona pemindaian di depan sinar radar
    ctx.fillStyle = '#06131c';
    ctx.fillRect(this.x, 0, sweepWidth, displayHeight);

    // Gambar ulang grid yang tertutup di zona pemindaian
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    const gridSize = 16;
    const startGrid = Math.floor(this.x / gridSize) * gridSize;
    for (let gx = startGrid; gx < this.x + sweepWidth; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, displayHeight);
      ctx.stroke();
    }
    for (let gy = 0; gy < displayHeight; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(this.x, gy);
      ctx.lineTo(this.x + sweepWidth, gy);
      ctx.stroke();
    }
    ctx.restore();

    // Hitung siklus detak jantung berdasarkan BPM
    const beatFrequency = this.currentBpm / 60; // beats per second
    const cycleLength = displayWidth / (beatFrequency * 2.5);
    this.phase = (this.x / cycleLength) % 1;

    const currentY = midY + this.getYOffset(this.phase);

    // Titik sebelumnya
    const prevPoint = this.history.length > 0 ? this.history[this.history.length - 1] : { x: this.x, y: currentY };

    // Gambar garis EKG Emerald-Cyan Glow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(this.x, currentY);
    ctx.strokeStyle = '#10b981'; // Emerald glow
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#06b6d4'; // Cyan neon shadow
    ctx.shadowBlur = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Titik kepala sinar (Leading pointer)
    ctx.beginPath();
    ctx.arc(this.x, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    this.history.push({ x: this.x, y: currentY });
    if (this.history.length > displayWidth) {
      this.history.shift();
    }

    this.x += this.speed;
    if (this.x >= displayWidth) {
      this.x = 0;
      this.history = [];
    }

    requestAnimationFrame(this.animate);
  }
}

// Inisialisasi visualizer saat DOM siap
window.initECG = function() {
  if (document.getElementById('ecg-canvas')) {
    window.ecgInstance = new ECGVisualizer('ecg-canvas');
  }
};
