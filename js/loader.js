/* ============================================
   LOADER.JS — Sticker Trail Loading Sequence
   ============================================ */

class Loader {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.loader = document.querySelector('.loader');
    this.counter = document.querySelector('.loader-counter');
    this.trail = document.querySelector('.loader-sticker-trail');
    this.count = 0;
    this.tl = null;

    this.stickerFiles = [
      '1.png', '2.png', '3.png', '4.png', '5.png',
      '6.png', '7.png', '8.png', '9.png', '10.png',
      '11.png', '12.png', '13.png', '14.png', '15.png',
      '16.png', 'sticker 3.png', 'sticker 4.png',
      'sticker 5.png', 'sticker 6.png', 'sticker 7.png',
      'sticker 8.png', 'Sticker.png', 'chai me 2.png',
    ];
  }

  start() {
    if (prefersReducedMotion()) {
      this.loader.classList.add('hidden');
      if (this.onComplete) this.onComplete();
      return;
    }

    this._preloadStickers().then(() => this._animate());
  }

  _preloadStickers() {
    return Promise.all(this.stickerFiles.map(file => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = `assets/Load Animation Stickers/${file}`;
      });
    }));
  }

  _animate() {
    const shuffled = [...this.stickerFiles].sort(() => Math.random() - 0.5);
    const total = shuffled.length;

    // Create sticker elements positioned along a trail
    const stickerData = shuffled.map((file, i) => {
      const img = document.createElement('img');
      img.src = `assets/Load Animation Stickers/${file}`;
      img.alt = '';
      img.className = 'loader-sticker';
      img.draggable = false;

      const progress = i / (total - 1);
      const xPct = 3 + progress * 80; // 3% to 83% — full wide trail
      const yBase = 44;
      const yOffset = (Math.random() - 0.5) * 14;
      const rot = (Math.random() - 0.5) * 24;

      img.style.left = `${xPct}%`;
      img.style.top = `${yBase + yOffset}%`;
      img.style.zIndex = i;

      // Initial state via GSAP
      gsap.set(img, {
        xPercent: -50,
        yPercent: -50,
        rotation: rot,
        scale: 0,
        opacity: 0,
      });

      this.trail.appendChild(img);
      return { el: img, rot };
    });

    // Build timeline
    this.tl = gsap.timeline({
      onComplete: () => this._exit(stickerData)
    });

    // Counter: 0 → 100
    this.tl.to(this, {
      count: 100,
      duration: 2.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.counter.textContent = Math.round(this.count);
      }
    }, 0);

    // Stickers stamp in one by one
    stickerData.forEach((s, i) => {
      const delay = (i / total) * 2.2;

      this.tl.to(s.el, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(1.7)',
      }, delay);
    });

    // Hold
    this.tl.to({}, { duration: 0.5 });
  }

  _exit(stickerData) {
    const exitTl = gsap.timeline({
      onComplete: () => {
        this.loader.classList.add('hidden');
        if (this.onComplete) this.onComplete();
      }
    });

    // Scatter stickers outward
    stickerData.forEach((s, i) => {
      exitTl.to(s.el, {
        y: -80 - Math.random() * 120,
        x: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0.5,
        rotation: `+=${(Math.random() - 0.5) * 40}`,
        duration: 0.45,
        ease: 'power2.in',
      }, i * 0.02);
    });

    // Counter fades
    exitTl.to(this.counter, {
      opacity: 0,
      y: 20,
      duration: 0.35,
      ease: 'power2.in',
    }, 0);

    // Loader slides up
    exitTl.to(this.loader, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut',
    }, 0.25);
  }
}
