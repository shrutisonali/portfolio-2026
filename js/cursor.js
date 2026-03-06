/* ============================================
   CURSOR.JS — Custom Cursor with Context States
   ============================================ */

class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    this.label = document.querySelector('.cursor-label');

    if (!this.cursor || isTouchDevice()) {
      // Remove cursor DOM if touch device
      if (this.cursor) this.cursor.style.display = 'none';
      return;
    }

    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.ringX = 0;
    this.ringY = 0;
    this.active = true;
    this.state = 'default';

    document.body.classList.add('has-custom-cursor');

    this._bindEvents();
    this._animate();
  }

  _bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Track hover states
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.work-card, .info-card');
      const game = e.target.closest('.game-card');
      const stack = e.target.closest('.work-stack');
      const chai = e.target.closest('#illust-chai');
      const draggable = e.target.closest('.draggable-sticker');
      const naruto = e.target.closest('#sticker-naruto');

      if (naruto) {
        this.setState('play', 'Play');
      } else if (chai) {
        this.setState('view', 'Recipe');
      } else if (draggable) {
        this.setState('drag', 'Drag');
      } else if (stack) {
        this.setState('view', 'Explore');
      } else if (card) {
        this.setState('view', 'View');
      } else if (game) {
        this.setState('play', 'Play');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.work-card, .info-card, .game-card, .work-stack, #illust-chai, .draggable-sticker, #sticker-naruto');
      if (card) {
        this.setState('default');
      }
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      gsap.to(this.cursor, { opacity: 0, duration: 0.2 });
    });

    document.addEventListener('mouseenter', () => {
      gsap.to(this.cursor, { opacity: 1, duration: 0.2 });
    });
  }

  setState(state, labelText = '') {
    this.state = state;

    // Remove all state classes
    this.cursor.className = 'custom-cursor';

    if (state !== 'default') {
      this.cursor.classList.add(`cursor-${state}`);
    }

    if (this.label) {
      this.label.textContent = labelText;
    }
  }

  setDragging(isDragging) {
    if (isDragging) {
      this.setState('drag');
    } else {
      this.setState('default');
    }
  }

  _animate() {
    if (!this.active) return;

    // Dot follows tightly
    this.cursorX = lerp(this.cursorX, this.mouseX, 0.2);
    this.cursorY = lerp(this.cursorY, this.mouseY, 0.2);

    // Ring follows loosely
    this.ringX = lerp(this.ringX, this.mouseX, 0.1);
    this.ringY = lerp(this.ringY, this.mouseY, 0.1);

    this.dot.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
    this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`;

    requestAnimationFrame(() => this._animate());
  }

  hide() {
    if (this.cursor) this.cursor.style.display = 'none';
  }

  show() {
    if (this.cursor && !isTouchDevice()) this.cursor.style.display = '';
  }

  /** Hide custom cursor AND restore default cursor for overlays */
  hideForOverlay() {
    if (this.cursor) this.cursor.style.display = 'none';
    document.body.classList.remove('has-custom-cursor');
  }

  /** Re-enable custom cursor when leaving overlay */
  showFromOverlay() {
    if (this.cursor && !isTouchDevice()) {
      this.cursor.style.display = '';
      document.body.classList.add('has-custom-cursor');
    }
  }

  destroy() {
    this.active = false;
    document.body.classList.remove('has-custom-cursor');
  }
}
