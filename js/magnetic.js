/* ============================================
   MAGNETIC.JS — Magnetic Hover Effect on Cards
   ============================================ */

class MagneticEffect {
  constructor() {
    this.elements = [];
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  /** Initialize magnetic effect on all cards */
  init() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mousemove', this._onMouseMove);
      card.addEventListener('mouseleave', this._onMouseLeave);
      this.elements.push(card);
    });
  }

  _onMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Get mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Magnetic pull — card moves toward cursor
    const moveX = deltaX * 8;
    const moveY = deltaY * 6;
    const rotateX = -deltaY * 3;
    const rotateY = deltaX * 3;

    // Get the element's base rotation from config
    const baseRotation = parseFloat(card.style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] || 0);

    const isInfoCard = card.classList.contains('info-card');
    gsap.to(card, {
      x: moveX,
      y: moveY,
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.03,
      boxShadow: isInfoCard ? 'none' : '0 16px 48px rgba(26, 26, 26, 0.15)',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  _onMouseLeave(e) {
    const card = e.currentTarget;

    const isInfoCard = card.classList.contains('info-card');
    gsap.to(card, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: isInfoCard ? 'none' : '0 4px 16px rgba(26, 26, 26, 0.08)',
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto'
    });
  }

  destroy() {
    this.elements.forEach(card => {
      card.removeEventListener('mousemove', this._onMouseMove);
      card.removeEventListener('mouseleave', this._onMouseLeave);
    });
    this.elements = [];
  }
}
