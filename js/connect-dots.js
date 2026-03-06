/* ============================================
   CONNECT-DOTS.JS — Connect the Dots Game
   Multiple puzzles, recognizable shapes, shape reveal
   ============================================ */

class ConnectDots {
  constructor(canvasId, toolbarId, completionId) {
    this.canvas = document.getElementById(canvasId);
    this.toolbar = document.getElementById(toolbarId);
    this.completionEl = document.getElementById(completionId);

    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = [];
    this.currentDot = 0;
    this.connected = [];
    this.isComplete = false;
    this.particles = [];
    this.animatingParticles = false;

    // Colors
    this.dotColor = '#F37B75';
    this.lineColor = '#F8C614';
    this.connectedColor = '#A0D4A6';
    this.fillColor = 'rgba(248, 198, 20, 0.15)';
    this.bgColor = '#FFF8EE';

    // Puzzles
    this.currentPuzzle = 0;
    this.puzzles = [
      {
        name: 'Lightbulb',
        label: 'You drew a lightbulb!',
        fillColor: 'rgba(232, 201, 122, 0.25)',
        dots: [
          { x: 0.42, y: 0.08 },  // 1 - top left of bulb
          { x: 0.34, y: 0.14 },  // 2
          { x: 0.28, y: 0.24 },  // 3
          { x: 0.26, y: 0.36 },  // 4
          { x: 0.30, y: 0.46 },  // 5
          { x: 0.36, y: 0.52 },  // 6
          { x: 0.36, y: 0.60 },  // 7 - base left
          { x: 0.36, y: 0.68 },  // 8
          { x: 0.40, y: 0.72 },  // 9 - bottom left
          { x: 0.50, y: 0.74 },  // 10 - bottom center
          { x: 0.60, y: 0.72 },  // 11 - bottom right
          { x: 0.64, y: 0.68 },  // 12
          { x: 0.64, y: 0.60 },  // 13 - base right
          { x: 0.64, y: 0.52 },  // 14
          { x: 0.70, y: 0.46 },  // 15
          { x: 0.74, y: 0.36 },  // 16
          { x: 0.72, y: 0.24 },  // 17
          { x: 0.66, y: 0.14 },  // 18
          { x: 0.58, y: 0.08 },  // 19 - top right of bulb
          { x: 0.50, y: 0.06 },  // 20 - top center
        ]
      },
      {
        name: 'Heart',
        label: 'You drew a heart!',
        fillColor: 'rgba(196, 85, 58, 0.20)',
        dots: [
          { x: 0.50, y: 0.30 },  // 1 - center dip
          { x: 0.42, y: 0.22 },  // 2
          { x: 0.34, y: 0.18 },  // 3
          { x: 0.26, y: 0.18 },  // 4
          { x: 0.18, y: 0.22 },  // 5
          { x: 0.14, y: 0.30 },  // 6
          { x: 0.14, y: 0.38 },  // 7
          { x: 0.18, y: 0.46 },  // 8
          { x: 0.26, y: 0.56 },  // 9
          { x: 0.38, y: 0.66 },  // 10
          { x: 0.50, y: 0.76 },  // 11 - bottom point
          { x: 0.62, y: 0.66 },  // 12
          { x: 0.74, y: 0.56 },  // 13
          { x: 0.82, y: 0.46 },  // 14
          { x: 0.86, y: 0.38 },  // 15
          { x: 0.86, y: 0.30 },  // 16
          { x: 0.82, y: 0.22 },  // 17
          { x: 0.74, y: 0.18 },  // 18
          { x: 0.66, y: 0.18 },  // 19
          { x: 0.58, y: 0.22 },  // 20
        ]
      },
      {
        name: 'Star',
        label: 'You drew a star!',
        fillColor: 'rgba(212, 168, 83, 0.25)',
        dots: [
          { x: 0.50, y: 0.08 },  // 1 - top
          { x: 0.56, y: 0.30 },  // 2
          { x: 0.80, y: 0.30 },  // 3 - right
          { x: 0.62, y: 0.46 },  // 4
          { x: 0.70, y: 0.70 },  // 5 - lower right
          { x: 0.50, y: 0.56 },  // 6 - center bottom
          { x: 0.30, y: 0.70 },  // 7 - lower left
          { x: 0.38, y: 0.46 },  // 8
          { x: 0.20, y: 0.30 },  // 9 - left
          { x: 0.44, y: 0.30 },  // 10
        ]
      },
    ];

    this._setupCanvas();
    this._loadPuzzle();
    this._buildToolbar();
    this._bindEvents();
  }

  _setupCanvas() {
    const wrapper = this.canvas.parentElement;
    const size = Math.min(wrapper.clientWidth, wrapper.clientHeight);
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;

    this.ctx.scale(dpr, dpr);
    this.size = size;
  }

  _loadPuzzle() {
    const puzzle = this.puzzles[this.currentPuzzle];

    this.dots = puzzle.dots.map((p, i) => ({
      x: p.x * this.size,
      y: p.y * this.size,
      number: i + 1,
      connected: false,
      radius: 10,
      pulsePhase: Math.random() * Math.PI * 2
    }));

    this.currentDot = 0;
    this.connected = [];
    this.isComplete = false;
    this.particles = [];
    this.animatingParticles = false;

    if (this.completionEl) this.completionEl.classList.remove('show');

    this._draw();
  }

  _buildToolbar() {
    if (!this.toolbar) return;

    const puzzle = this.puzzles[this.currentPuzzle];

    this.toolbar.innerHTML = `
      <div class="game-illustration-nav">
        <button class="game-nav-btn" id="dots-prev" aria-label="Previous puzzle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="game-illustration-label" id="dots-label">${puzzle.name}</span>
        <button class="game-nav-btn" id="dots-next" aria-label="Next puzzle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="game-dots-controls">
        <button class="game-btn game-btn-sm" id="dots-reset">Reset</button>
        <span class="game-dots-progress">
          Dot <span id="dots-progress">1</span> of ${this.dots.length}
        </span>
      </div>
    `;

    document.getElementById('dots-prev')?.addEventListener('click', () => this.prevPuzzle());
    document.getElementById('dots-next')?.addEventListener('click', () => this.nextPuzzle());
    document.getElementById('dots-reset')?.addEventListener('click', () => this._reset());
  }

  nextPuzzle() {
    this.currentPuzzle = (this.currentPuzzle + 1) % this.puzzles.length;
    this._switchPuzzle();
  }

  prevPuzzle() {
    this.currentPuzzle = (this.currentPuzzle - 1 + this.puzzles.length) % this.puzzles.length;
    this._switchPuzzle();
  }

  _switchPuzzle() {
    this._loadPuzzle();
    this._buildToolbar();
    this._bindEvents();
  }

  _bindEvents() {
    // Remove old listeners by cloning
    const newCanvas = this.canvas.cloneNode(true);
    this.canvas.parentNode.replaceChild(newCanvas, this.canvas);
    this.canvas = newCanvas;
    this.ctx = this.canvas.getContext('2d');

    // Re-scale after clone
    const dpr = window.devicePixelRatio || 1;
    this.ctx.scale(dpr, dpr);

    this.canvas.addEventListener('click', (e) => this._onClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._onClick(e.touches[0]);
    }, { passive: false });

    this._draw();
  }

  _onClick(e) {
    if (this.isComplete) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextDot = this.dots[this.currentDot];
    if (!nextDot) return;

    const dist = Math.sqrt((x - nextDot.x) ** 2 + (y - nextDot.y) ** 2);
    const hitRadius = isTouchDevice() ? 30 : 22;

    if (dist < hitRadius) {
      this._connectDot(this.currentDot);
    }
  }

  _connectDot(index) {
    this.dots[index].connected = true;
    this.connected.push(index);
    this.currentDot = index + 1;

    // Bounce animation
    const dot = this.dots[index];
    const originalRadius = dot.radius;
    gsap.fromTo(dot, { radius: originalRadius * 2 }, {
      radius: originalRadius * 0.8,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)',
      onUpdate: () => this._draw()
    });

    // Update progress
    const progress = document.getElementById('dots-progress');
    if (progress) progress.textContent = Math.min(this.currentDot + 1, this.dots.length);

    // Check completion
    if (this.currentDot >= this.dots.length) {
      this._onComplete();
    }

    this._draw();
  }

  _onComplete() {
    this.isComplete = true;
    this._draw();

    const puzzle = this.puzzles[this.currentPuzzle];

    // Update completion text
    if (this.completionEl) {
      this.completionEl.querySelector('h2').textContent = 'Nice!';
      this.completionEl.querySelector('p').textContent = puzzle.label;
    }

    setTimeout(() => {
      this._spawnConfetti();
      if (this.completionEl) {
        this.completionEl.classList.add('show');
        gsap.fromTo(this.completionEl,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }
    }, 400);
  }

  _spawnConfetti() {
    const colors = ['#F37B75', '#F8C614', '#A0D4A6', '#6CC2EA', '#EA89B9'];
    this.particles = [];

    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: this.size / 2,
        y: this.size / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.15,
        life: 1,
        decay: 0.01 + Math.random() * 0.015
      });
    }

    this.animatingParticles = true;
    this._animateConfetti();
  }

  _animateConfetti() {
    if (!this.animatingParticles) return;

    let alive = false;
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;
      if (p.life > 0) alive = true;
    }

    this._draw();

    if (alive) {
      requestAnimationFrame(() => this._animateConfetti());
    } else {
      this.animatingParticles = false;
    }
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);

    // Background
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, this.size, this.size);

    const puzzle = this.puzzles[this.currentPuzzle];

    // Draw filled shape on completion
    if (this.isComplete && this.connected.length > 2) {
      ctx.beginPath();
      const first = this.dots[this.connected[0]];
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < this.connected.length; i++) {
        const d = this.dots[this.connected[i]];
        ctx.lineTo(d.x, d.y);
      }

      ctx.closePath();
      ctx.fillStyle = puzzle.fillColor;
      ctx.fill();
    }

    // Draw connecting lines with quadratic curves
    if (this.connected.length > 1) {
      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      const first = this.dots[this.connected[0]];
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < this.connected.length; i++) {
        const prev = this.dots[this.connected[i - 1]];
        const curr = this.dots[this.connected[i]];

        // Quadratic curve: control point is midpoint offset
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const offset = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, 8);

        // Slight curve perpendicular to the line
        const cpX = midX + (dy > 0 ? offset : -offset) * 0.3;
        const cpY = midY + (dx > 0 ? -offset : offset) * 0.3;

        ctx.quadraticCurveTo(cpX, cpY, curr.x, curr.y);
      }

      if (this.isComplete) {
        ctx.closePath();
        ctx.lineWidth = 4;
        ctx.shadowColor = this.lineColor;
        ctx.shadowBlur = 15;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw dots
    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      const isNext = i === this.currentDot;
      const isConnected = dot.connected;

      if (isNext && !this.isComplete) {
        // Pulse ring
        const pulse = Math.sin(Date.now() * 0.004 + dot.pulsePhase) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse * 0.25;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = this.dotColor;
        ctx.fill();
        ctx.restore();
      }

      // Dot circle
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);

      if (isConnected) {
        ctx.fillStyle = this.connectedColor;
      } else if (isNext) {
        ctx.fillStyle = this.dotColor;
      } else {
        ctx.fillStyle = '#CCC5BB';
      }

      ctx.fill();

      // Number label
      ctx.fillStyle = '#FFF';
      ctx.font = `bold ${dot.radius * 0.85}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dot.number, dot.x, dot.y + 0.5);
    }

    // Confetti
    if (this.animatingParticles) {
      for (const p of this.particles) {
        if (p.life <= 0) continue;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    // Re-request draw for pulse animation
    if (!this.isComplete && !this.animatingParticles) {
      requestAnimationFrame(() => this._draw());
    }
  }

  _reset() {
    this._loadPuzzle();

    const progress = document.getElementById('dots-progress');
    if (progress) progress.textContent = '1';
  }
}
