/* ============================================
   COLORING-BOOK.JS — Woset-Style Coloring Game
   Multiple illustrations, minimal UI, flood-fill
   ============================================ */

class ColoringBook {
  constructor(canvasId, toolbarId) {
    this.canvas = document.getElementById(canvasId);
    this.toolbar = document.getElementById(toolbarId);

    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.size = 0;
    this.dpr = window.devicePixelRatio || 1;

    // State
    this.currentColor = '#F37B75';
    this.lineArtData = null;
    this.currentIllustration = 0;

    // Palette — vibrant, playful swatches
    this.palette = [
      '#F37B75',  // coral
      '#F8C614',  // yellow
      '#A0D4A6',  // mint green
      '#6CC2EA',  // sky blue
      '#EA89B9',  // pink
      '#F9A825',  // warm amber
      '#7EDBC1',  // teal
      '#C48BDB',  // lavender
    ];

    // Illustrations — each is a named draw function
    this.illustrations = [
      { name: 'Flower', draw: (ctx, s) => this._drawFlower(ctx, s) },
      { name: 'Butterfly', draw: (ctx, s) => this._drawButterfly(ctx, s) },
      { name: 'Cat', draw: (ctx, s) => this._drawCat(ctx, s) },
    ];

    this._setupCanvas();
    this._drawCurrentIllustration();
    this._buildToolbar();
    this._bindEvents();
  }

  _setupCanvas() {
    const wrapper = this.canvas.parentElement;
    const size = Math.min(wrapper.clientWidth, wrapper.clientHeight);

    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;

    this.ctx.scale(this.dpr, this.dpr);
    this.size = size;
  }

  _drawCurrentIllustration() {
    const ctx = this.ctx;
    // Fill with cream
    ctx.fillStyle = '#FFF8EE';
    ctx.fillRect(0, 0, this.size, this.size);

    // Draw the current illustration
    this.illustrations[this.currentIllustration].draw(ctx, this.size);

    // Save line art for re-stamping after flood fill
    this.lineArtData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  // ── Illustration: Flower ──
  _drawFlower(ctx, s) {
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = s * 0.5;
    const cy = s * 0.5;

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.07, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dot pattern in center
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * s * 0.03, cy + Math.sin(a) * s * 0.03, s * 0.008, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Large petals (5 petals)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(angle) * s * 0.2;
      const py = cy + Math.sin(angle) * s * 0.2;

      ctx.beginPath();
      ctx.ellipse(px, py, s * 0.14, s * 0.08, angle, 0, Math.PI * 2);
      ctx.stroke();

      // Petal vein
      const vx1 = cx + Math.cos(angle) * s * 0.09;
      const vy1 = cy + Math.sin(angle) * s * 0.09;
      const vx2 = cx + Math.cos(angle) * s * 0.30;
      const vy2 = cy + Math.sin(angle) * s * 0.30;
      ctx.beginPath();
      ctx.moveTo(vx1, vy1);
      ctx.lineTo(vx2, vy2);
      ctx.stroke();
    }

    // Stem
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.2);
    ctx.quadraticCurveTo(cx + s * 0.05, cy + s * 0.35, cx - s * 0.02, cy + s * 0.45);
    ctx.stroke();

    // Leaves on stem
    // Left leaf
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.01, cy + s * 0.32);
    ctx.quadraticCurveTo(cx - s * 0.12, cy + s * 0.28, cx - s * 0.15, cy + s * 0.34);
    ctx.quadraticCurveTo(cx - s * 0.10, cy + s * 0.36, cx - s * 0.01, cy + s * 0.32);
    ctx.stroke();

    // Right leaf
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.02, cy + s * 0.38);
    ctx.quadraticCurveTo(cx + s * 0.12, cy + s * 0.34, cx + s * 0.14, cy + s * 0.40);
    ctx.quadraticCurveTo(cx + s * 0.10, cy + s * 0.42, cx + s * 0.02, cy + s * 0.38);
    ctx.stroke();
  }

  // ── Illustration: Butterfly ──
  _drawButterfly(ctx, s) {
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = s * 0.5;
    const cy = s * 0.48;

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.02, s * 0.12, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.14, s * 0.03, 0, Math.PI * 2);
    ctx.stroke();

    // Antennae
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.01, cy - s * 0.16);
    ctx.quadraticCurveTo(cx - s * 0.08, cy - s * 0.26, cx - s * 0.12, cy - s * 0.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - s * 0.12, cy - s * 0.28, s * 0.012, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + s * 0.01, cy - s * 0.16);
    ctx.quadraticCurveTo(cx + s * 0.08, cy - s * 0.26, cx + s * 0.12, cy - s * 0.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + s * 0.12, cy - s * 0.28, s * 0.012, 0, Math.PI * 2);
    ctx.stroke();

    // Upper wings
    // Left upper
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.02, cy - s * 0.08);
    ctx.quadraticCurveTo(cx - s * 0.25, cy - s * 0.30, cx - s * 0.30, cy - s * 0.12);
    ctx.quadraticCurveTo(cx - s * 0.28, cy + s * 0.02, cx - s * 0.02, cy);
    ctx.stroke();

    // Left upper wing inner circle
    ctx.beginPath();
    ctx.arc(cx - s * 0.16, cy - s * 0.10, s * 0.05, 0, Math.PI * 2);
    ctx.stroke();

    // Right upper
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.02, cy - s * 0.08);
    ctx.quadraticCurveTo(cx + s * 0.25, cy - s * 0.30, cx + s * 0.30, cy - s * 0.12);
    ctx.quadraticCurveTo(cx + s * 0.28, cy + s * 0.02, cx + s * 0.02, cy);
    ctx.stroke();

    // Right upper wing inner circle
    ctx.beginPath();
    ctx.arc(cx + s * 0.16, cy - s * 0.10, s * 0.05, 0, Math.PI * 2);
    ctx.stroke();

    // Lower wings
    // Left lower
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.02, cy + s * 0.02);
    ctx.quadraticCurveTo(cx - s * 0.22, cy + s * 0.02, cx - s * 0.20, cy + s * 0.16);
    ctx.quadraticCurveTo(cx - s * 0.14, cy + s * 0.22, cx - s * 0.02, cy + s * 0.10);
    ctx.stroke();

    // Left lower wing dot
    ctx.beginPath();
    ctx.arc(cx - s * 0.12, cy + s * 0.10, s * 0.025, 0, Math.PI * 2);
    ctx.stroke();

    // Right lower
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.02, cy + s * 0.02);
    ctx.quadraticCurveTo(cx + s * 0.22, cy + s * 0.02, cx + s * 0.20, cy + s * 0.16);
    ctx.quadraticCurveTo(cx + s * 0.14, cy + s * 0.22, cx + s * 0.02, cy + s * 0.10);
    ctx.stroke();

    // Right lower wing dot
    ctx.beginPath();
    ctx.arc(cx + s * 0.12, cy + s * 0.10, s * 0.025, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── Illustration: Cat ──
  _drawCat(ctx, s) {
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = s * 0.5;
    const cy = s * 0.52;

    // Body (oval)
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.05, s * 0.16, s * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.18, s * 0.11, 0, Math.PI * 2);
    ctx.stroke();

    // Left ear
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.09, cy - s * 0.26);
    ctx.lineTo(cx - s * 0.14, cy - s * 0.38);
    ctx.lineTo(cx - s * 0.03, cy - s * 0.28);
    ctx.stroke();

    // Inner left ear
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.085, cy - s * 0.275);
    ctx.lineTo(cx - s * 0.12, cy - s * 0.34);
    ctx.lineTo(cx - s * 0.045, cy - s * 0.285);
    ctx.stroke();

    // Right ear
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.09, cy - s * 0.26);
    ctx.lineTo(cx + s * 0.14, cy - s * 0.38);
    ctx.lineTo(cx + s * 0.03, cy - s * 0.28);
    ctx.stroke();

    // Inner right ear
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.085, cy - s * 0.275);
    ctx.lineTo(cx + s * 0.12, cy - s * 0.34);
    ctx.lineTo(cx + s * 0.045, cy - s * 0.285);
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.ellipse(cx - s * 0.045, cy - s * 0.20, s * 0.025, s * 0.03, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.045, cy - s * 0.20, s * 0.025, s * 0.03, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.ellipse(cx - s * 0.045, cy - s * 0.198, s * 0.012, s * 0.018, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.045, cy - s * 0.198, s * 0.012, s * 0.018, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.14);
    ctx.lineTo(cx - s * 0.015, cy - s * 0.125);
    ctx.lineTo(cx + s * 0.015, cy - s * 0.125);
    ctx.closePath();
    ctx.stroke();

    // Mouth
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.125);
    ctx.lineTo(cx, cy - s * 0.11);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.11);
    ctx.quadraticCurveTo(cx - s * 0.03, cy - s * 0.10, cx - s * 0.04, cy - s * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.11);
    ctx.quadraticCurveTo(cx + s * 0.03, cy - s * 0.10, cx + s * 0.04, cy - s * 0.12);
    ctx.stroke();

    // Whiskers
    ctx.lineWidth = 1.5;
    // Left
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.06, cy - s * 0.15);
    ctx.lineTo(cx - s * 0.18, cy - s * 0.17);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.06, cy - s * 0.13);
    ctx.lineTo(cx - s * 0.18, cy - s * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.06, cy - s * 0.11);
    ctx.lineTo(cx - s * 0.17, cy - s * 0.08);
    ctx.stroke();
    // Right
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.06, cy - s * 0.15);
    ctx.lineTo(cx + s * 0.18, cy - s * 0.17);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.06, cy - s * 0.13);
    ctx.lineTo(cx + s * 0.18, cy - s * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.06, cy - s * 0.11);
    ctx.lineTo(cx + s * 0.17, cy - s * 0.08);
    ctx.stroke();

    ctx.lineWidth = 2.5;

    // Front paws
    ctx.beginPath();
    ctx.ellipse(cx - s * 0.08, cy + s * 0.22, s * 0.04, s * 0.025, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.08, cy + s * 0.22, s * 0.04, s * 0.025, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.14, cy + s * 0.10);
    ctx.quadraticCurveTo(cx + s * 0.28, cy + s * 0.05, cx + s * 0.26, cy - s * 0.05);
    ctx.quadraticCurveTo(cx + s * 0.24, cy - s * 0.10, cx + s * 0.20, cy - s * 0.08);
    ctx.stroke();
  }

  // ── Toolbar ──
  _buildToolbar() {
    if (!this.toolbar) return;

    const illName = this.illustrations[this.currentIllustration].name;

    this.toolbar.innerHTML = `
      <div class="game-illustration-nav">
        <button class="game-nav-btn" id="color-prev" aria-label="Previous illustration">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="game-illustration-label" id="color-label">${illName}</span>
        <button class="game-nav-btn" id="color-next" aria-label="Next illustration">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="color-palette" id="color-palette">
        ${this.palette.map((c, i) => `
          <button class="color-swatch ${i === 0 ? 'active' : ''}"
                  style="background-color: ${c}"
                  data-color="${c}"
                  aria-label="Color: ${c}"></button>
        `).join('')}
        <button class="game-btn game-btn-sm" id="color-reset">Reset</button>
      </div>
    `;

    // Color swatch clicks
    this.toolbar.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.toolbar.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.currentColor = swatch.dataset.color;
      });
    });

    // Navigation
    document.getElementById('color-prev')?.addEventListener('click', () => this.prevIllustration());
    document.getElementById('color-next')?.addEventListener('click', () => this.nextIllustration());

    // Reset
    document.getElementById('color-reset')?.addEventListener('click', () => this._reset());
  }

  nextIllustration() {
    this.currentIllustration = (this.currentIllustration + 1) % this.illustrations.length;
    this._switchIllustration();
  }

  prevIllustration() {
    this.currentIllustration = (this.currentIllustration - 1 + this.illustrations.length) % this.illustrations.length;
    this._switchIllustration();
  }

  _switchIllustration() {
    // Re-scale context (it was scaled on setup, but getImageData/putImageData resets transform)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    this._drawCurrentIllustration();

    const label = document.getElementById('color-label');
    if (label) label.textContent = this.illustrations[this.currentIllustration].name;
  }

  _bindEvents() {
    this.canvas.addEventListener('click', (e) => this._onCanvasClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._onCanvasClick(e.touches[0]);
    }, { passive: false });
  }

  _onCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * this.dpr);
    const y = Math.round((e.clientY - rect.top) * this.dpr);

    this._floodFill(x, y, this.currentColor);
  }

  /** Scanline stack-based flood fill */
  _floodFill(startX, startY, fillColorHex) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data;

    const targetIdx = (startY * w + startX) * 4;
    const targetR = pixels[targetIdx];
    const targetG = pixels[targetIdx + 1];
    const targetB = pixels[targetIdx + 2];

    const fillR = parseInt(fillColorHex.slice(1, 3), 16);
    const fillG = parseInt(fillColorHex.slice(3, 5), 16);
    const fillB = parseInt(fillColorHex.slice(5, 7), 16);

    if (Math.abs(targetR - fillR) < 5 && Math.abs(targetG - fillG) < 5 && Math.abs(targetB - fillB) < 5) return;
    if (targetR < 50 && targetG < 50 && targetB < 50) return;

    const tolerance = 30;

    function matchesTarget(idx) {
      return Math.abs(pixels[idx] - targetR) <= tolerance &&
             Math.abs(pixels[idx + 1] - targetG) <= tolerance &&
             Math.abs(pixels[idx + 2] - targetB) <= tolerance;
    }

    function setPixel(idx) {
      pixels[idx] = fillR;
      pixels[idx + 1] = fillG;
      pixels[idx + 2] = fillB;
      pixels[idx + 3] = 255;
    }

    const stack = [[startX, startY]];
    const visited = new Uint8Array(w * h);
    let fillCount = 0;
    const maxFill = w * h * 0.5;

    while (stack.length > 0 && fillCount < maxFill) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= w || y < 0 || y >= h) continue;

      let idx = y * w + x;
      if (visited[idx]) continue;

      const pixIdx = idx * 4;
      if (!matchesTarget(pixIdx)) continue;

      let left = x;
      while (left > 0) {
        const li = (y * w + (left - 1)) * 4;
        if (!matchesTarget(li) || visited[y * w + (left - 1)]) break;
        left--;
      }

      let right = x;
      while (right < w - 1) {
        const ri = (y * w + (right + 1)) * 4;
        if (!matchesTarget(ri) || visited[y * w + (right + 1)]) break;
        right++;
      }

      for (let i = left; i <= right; i++) {
        const pi = (y * w + i) * 4;
        setPixel(pi);
        visited[y * w + i] = 1;
        fillCount++;

        if (y > 0) {
          const aboveIdx = ((y - 1) * w + i);
          if (!visited[aboveIdx] && matchesTarget(aboveIdx * 4)) {
            stack.push([i, y - 1]);
          }
        }
        if (y < h - 1) {
          const belowIdx = ((y + 1) * w + i);
          if (!visited[belowIdx] && matchesTarget(belowIdx * 4)) {
            stack.push([i, y + 1]);
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    if (this.lineArtData) {
      this._restampLines();
    }
  }

  _restampLines() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const currentData = ctx.getImageData(0, 0, w, h);
    const lineData = this.lineArtData.data;
    const pixels = currentData.data;

    for (let i = 0; i < lineData.length; i += 4) {
      if (lineData[i] < 50 && lineData[i + 1] < 50 && lineData[i + 2] < 50 && lineData[i + 3] > 200) {
        pixels[i] = lineData[i];
        pixels[i + 1] = lineData[i + 1];
        pixels[i + 2] = lineData[i + 2];
        pixels[i + 3] = lineData[i + 3];
      }
    }

    ctx.putImageData(currentData, 0, 0);
  }

  _reset() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this._drawCurrentIllustration();
  }
}
