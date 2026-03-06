/* ============================================
   PARALLAX.JS — Depth-Based Parallax on Pan
   ============================================ */

class ParallaxEngine {
  constructor(engine) {
    this.engine = engine;
    this.elements = [];
    this.active = !prefersReducedMotion();
  }

  /** Register elements for parallax */
  init() {
    if (!this.active) return;

    const canvasElements = document.querySelectorAll('.canvas-element');
    canvasElements.forEach(el => {
      const depth = parseInt(el.dataset.depth || '1');
      this.elements.push({
        el,
        depth,
        baseX: parseFloat(el.style.left),
        baseY: parseFloat(el.style.top),
      });
    });
  }

  /** Update parallax offsets based on current pan */
  update(panX, panY) {
    if (!this.active) return;

    // The viewport center in world coords
    const vw = this.engine.viewport.clientWidth;
    const vh = this.engine.viewport.clientHeight;
    const centerWorldX = (vw / 2) / this.engine.zoom - panX;
    const centerWorldY = (vh / 2) / this.engine.zoom - panY;

    for (const item of this.elements) {
      // Calculate offset from viewport center
      const dx = item.baseX - centerWorldX;
      const dy = item.baseY - centerWorldY;

      // Depth multiplier: depth 0 = moves a lot (far), depth 3 = moves least (close)
      const factor = (3 - item.depth) * 0.015;

      const offsetX = dx * factor;
      const offsetY = dy * factor;

      // Apply as additional translate, keeping existing rotation
      const currentTransform = item.el.style.transform;
      const rotateMatch = currentTransform.match(/rotate\([^)]+\)/);
      const rotate = rotateMatch ? rotateMatch[0] : '';

      item.el.style.transform = `translate(${offsetX}px, ${offsetY}px) ${rotate}`;
    }
  }

  destroy() {
    this.elements = [];
  }
}
