/* ============================================
   CANVAS-ENGINE.JS — Pan / Drag / Inertia
   ============================================ */

class CanvasEngine {
  constructor(viewport, world) {
    this.viewport = viewport;
    this.world = world;

    // State
    this.panX = 0;
    this.panY = 0;
    this.zoom = CONFIG.defaultZoom;
    this.locked = false;

    // Drag state
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragStartPanX = 0;
    this.dragStartPanY = 0;
    this.pointerStartX = 0;
    this.pointerStartY = 0;
    this.hasDragged = false;

    // Velocity for inertia
    this.velocityX = 0;
    this.velocityY = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.lastPointerTime = 0;

    // Pinch zoom state
    this.pinchStartDist = 0;
    this.pinchStartZoom = 1;
    this.activePointers = new Map();

    // Callbacks
    this.onClickElement = null;
    this.onDragStart = null;
    this.onDragEnd = null;
    this.onPanUpdate = null;

    // Bind
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onWheel = this._onWheel.bind(this);

    this._bindEvents();
  }

  _bindEvents() {
    this.viewport.addEventListener('pointerdown', this._onPointerDown);
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    window.addEventListener('pointercancel', this._onPointerUp);
    this.viewport.addEventListener('wheel', this._onWheel, { passive: false });

    // Prevent context menu on long press
    this.viewport.addEventListener('contextmenu', e => e.preventDefault());
  }

  _onPointerDown(e) {
    if (this.locked) return;

    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Pinch zoom with 2 fingers
    if (this.activePointers.size === 2) {
      const pointers = Array.from(this.activePointers.values());
      this.pinchStartDist = distance(pointers[0].x, pointers[0].y, pointers[1].x, pointers[1].y);
      this.pinchStartZoom = this.zoom;
      return;
    }

    if (this.activePointers.size > 2) return;

    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragStartPanX = this.panX;
    this.dragStartPanY = this.panY;
    this.pointerStartX = e.clientX;
    this.pointerStartY = e.clientY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.lastPointerTime = performance.now();
    this.velocityX = 0;
    this.velocityY = 0;

    // Kill any inertia tween
    gsap.killTweensOf(this, 'panX,panY');

    this.viewport.style.cursor = 'grabbing';
    if (this.onDragStart) this.onDragStart();
  }

  _onPointerMove(e) {
    if (this.locked) return;

    // Update tracked pointer
    if (this.activePointers.has(e.pointerId)) {
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Pinch zoom
    if (this.activePointers.size === 2) {
      const pointers = Array.from(this.activePointers.values());
      const currentDist = distance(pointers[0].x, pointers[0].y, pointers[1].x, pointers[1].y);
      const scale = currentDist / this.pinchStartDist;
      this.zoom = clamp(this.pinchStartZoom * scale, CONFIG.minZoom, CONFIG.maxZoom);
      this._applyTransform();
      return;
    }

    if (!this.isDragging) return;

    const dx = e.clientX - this.dragStartX;
    const dy = e.clientY - this.dragStartY;

    // Check if we've moved enough to count as a drag
    if (!this.hasDragged) {
      const dist = distance(e.clientX, e.clientY, this.pointerStartX, this.pointerStartY);
      if (dist > CONFIG.clickThreshold) {
        this.hasDragged = true;
      }
    }

    // Update pan (divide by zoom for consistent feel at all zoom levels)
    this.panX = this.dragStartPanX + dx / this.zoom;
    this.panY = this.dragStartPanY + dy / this.zoom;

    // Track velocity
    const now = performance.now();
    const dt = now - this.lastPointerTime;
    if (dt > 0) {
      this.velocityX = (e.clientX - this.lastPointerX) / dt;
      this.velocityY = (e.clientY - this.lastPointerY) / dt;
    }
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.lastPointerTime = now;

    this._applyTransform();
    if (this.onPanUpdate) this.onPanUpdate(this.panX, this.panY);
  }

  _onPointerUp(e) {
    this.activePointers.delete(e.pointerId);

    if (!this.isDragging) return;

    this.isDragging = false;
    this.viewport.style.cursor = '';

    // If it was a click (not a drag), check for element clicks
    if (!this.hasDragged) {
      this._handleClick(e);
    } else {
      // Apply inertia
      const vx = this.velocityX * 300 / this.zoom;
      const vy = this.velocityY * 300 / this.zoom;

      if (Math.abs(vx) > 5 || Math.abs(vy) > 5) {
        gsap.to(this, {
          panX: this.panX + vx,
          panY: this.panY + vy,
          duration: CONFIG.inertiaDuration,
          ease: 'power3.out',
          onUpdate: () => {
            this._applyTransform();
            if (this.onPanUpdate) this.onPanUpdate(this.panX, this.panY);
          }
        });
      }
    }

    if (this.onDragEnd) this.onDragEnd();
  }

  _onWheel(e) {
    if (this.locked) return;
    e.preventDefault();

    // Shift + wheel = horizontal pan, otherwise vertical pan
    const dx = e.shiftKey ? -e.deltaY : -e.deltaX;
    const dy = e.shiftKey ? 0 : -e.deltaY;

    // If ctrl is pressed, zoom
    if (e.ctrlKey || e.metaKey) {
      const zoomDelta = -e.deltaY * 0.001;
      this.zoom = clamp(this.zoom + zoomDelta, CONFIG.minZoom, CONFIG.maxZoom);
    } else {
      this.panX += dx / this.zoom;
      this.panY += dy / this.zoom;
    }

    this._applyTransform();
    if (this.onPanUpdate) this.onPanUpdate(this.panX, this.panY);
  }

  _handleClick(e) {
    // Find clickable element under pointer
    const target = e.target.closest('[data-clickable]');
    if (target && this.onClickElement) {
      this.onClickElement(target, target.dataset.elementId);
    }
  }

  _applyTransform() {
    // World transform: translate then scale
    const tx = this.panX * this.zoom;
    const ty = this.panY * this.zoom;
    this.world.style.transform = `translate(${tx}px, ${ty}px) scale(${this.zoom})`;
  }

  /** Smoothly pan to center a world coordinate in the viewport */
  panTo(worldX, worldY, duration = 1.2) {
    if (this.locked) return;

    const vw = this.viewport.clientWidth;
    const vh = this.viewport.clientHeight;

    // Calculate pan needed to center the given world coord
    const targetPanX = (vw / 2) / this.zoom - worldX;
    const targetPanY = (vh / 2) / this.zoom - worldY;

    gsap.killTweensOf(this, 'panX,panY');

    if (prefersReducedMotion()) {
      this.panX = targetPanX;
      this.panY = targetPanY;
      this._applyTransform();
      if (this.onPanUpdate) this.onPanUpdate(this.panX, this.panY);
      return;
    }

    gsap.to(this, {
      panX: targetPanX,
      panY: targetPanY,
      duration: duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        this._applyTransform();
        if (this.onPanUpdate) this.onPanUpdate(this.panX, this.panY);
      }
    });
  }

  /** Center viewport on hero (initial position) */
  centerOnHero() {
    const vw = this.viewport.clientWidth;
    const vh = this.viewport.clientHeight;

    // Center the hero element in the viewport
    this.panX = (vw / 2) / this.zoom - CONFIG.startX;
    this.panY = (vh / 2) / this.zoom - CONFIG.startY;
    this._applyTransform();
  }

  /** Get current world coordinate at viewport center */
  getViewportCenter() {
    const vw = this.viewport.clientWidth;
    const vh = this.viewport.clientHeight;
    return {
      x: (vw / 2) / this.zoom - this.panX,
      y: (vh / 2) / this.zoom - this.panY,
    };
  }

  /** Save current pan/zoom state */
  saveState() {
    return { panX: this.panX, panY: this.panY, zoom: this.zoom };
  }

  /** Restore saved state with animation */
  restoreState(state, duration = 1) {
    gsap.killTweensOf(this, 'panX,panY,zoom');

    if (prefersReducedMotion()) {
      this.panX = state.panX;
      this.panY = state.panY;
      this.zoom = state.zoom;
      this._applyTransform();
      return;
    }

    gsap.to(this, {
      panX: state.panX,
      panY: state.panY,
      zoom: state.zoom,
      duration: duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        this._applyTransform();
        if (this.onPanUpdate) this.onPanUpdate(this.panX, this.panY);
      }
    });
  }

  lock() { this.locked = true; }
  unlock() { this.locked = false; }

  destroy() {
    this.viewport.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);
    this.viewport.removeEventListener('wheel', this._onWheel);
  }
}
