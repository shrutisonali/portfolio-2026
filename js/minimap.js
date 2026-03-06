/* ============================================
   MINIMAP.JS — Canvas Minimap Navigation
   ============================================ */

class Minimap {
  constructor(engine) {
    this.engine = engine;
    this.minimap = document.querySelector('.minimap');

    if (!this.minimap || window.innerWidth <= 768) return;

    this.viewportIndicator = null;
    this.scale = 180 / CONFIG.canvas.width;

    this._buildMinimap();
    this._bindEvents();
  }

  _buildMinimap() {
    // Clear existing
    this.minimap.innerHTML = '';

    // Draw element dots
    for (const cfg of CONFIG.elements) {
      if (cfg.type === 'sticker') continue;

      const dot = document.createElement('div');
      dot.className = 'minimap-dot';

      if (cfg.type === 'hero') dot.classList.add('dot-hero');
      else if (cfg.type === 'work-card') dot.classList.add('dot-work');
      else if (cfg.type === 'game-card') dot.classList.add('dot-game');

      dot.style.left = `${(cfg.x + cfg.width / 2) * this.scale}px`;
      dot.style.top = `${(cfg.y + (cfg.height || 0) / 2) * this.scale}px`;

      this.minimap.appendChild(dot);
    }

    // Viewport indicator
    this.viewportIndicator = document.createElement('div');
    this.viewportIndicator.className = 'minimap-viewport';
    this.minimap.appendChild(this.viewportIndicator);
  }

  _bindEvents() {
    // Click minimap to pan
    this.minimap.addEventListener('click', (e) => {
      const rect = this.minimap.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / this.scale;
      const clickY = (e.clientY - rect.top) / this.scale;
      this.engine.panTo(clickX, clickY, 0.8);
    });
  }

  /** Update viewport indicator position */
  update() {
    if (!this.viewportIndicator) return;

    const vw = this.engine.viewport.clientWidth;
    const vh = this.engine.viewport.clientHeight;

    // Current viewport in world coords
    const worldX = -this.engine.panX;
    const worldY = -this.engine.panY;
    const worldW = vw / this.engine.zoom;
    const worldH = vh / this.engine.zoom;

    this.viewportIndicator.style.left = `${worldX * this.scale}px`;
    this.viewportIndicator.style.top = `${worldY * this.scale}px`;
    this.viewportIndicator.style.width = `${worldW * this.scale}px`;
    this.viewportIndicator.style.height = `${worldH * this.scale}px`;
  }

  hide() {
    if (this.minimap) this.minimap.style.display = 'none';
  }

  show() {
    if (this.minimap && window.innerWidth > 768) this.minimap.style.display = '';
  }
}
