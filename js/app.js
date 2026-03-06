/* ============================================
   APP.JS — Entry Point & Init Orchestrator
   The Playground — Shruti's Portfolio
   ============================================ */

(function () {
  'use strict';

  // ── Module references ──
  let engine, placer, parallax, cursor, magnetic, nav, transitions, minimap, loader;

  // Expose for debugging / testing
  window.__playground = {};

  // ── Init ──
  function init() {
    const viewport = document.querySelector('.viewport');
    const world = document.querySelector('.world');

    if (!viewport || !world) {
      console.error('Viewport or world container not found');
      return;
    }

    // 1. Canvas Engine
    engine = new CanvasEngine(viewport, world);

    // 2. Element Placer — create all elements
    placer = new ElementPlacer(world);
    placer.placeAll(CONFIG.elements);

    // 3. Center on hero
    engine.centerOnHero();

    // 4. Parallax
    parallax = new ParallaxEngine(engine);
    parallax.init();

    // 5. Custom Cursor
    cursor = new CustomCursor();

    // 6. Magnetic hover
    magnetic = new MagneticEffect();
    magnetic.init();

    // 7. Navigation
    nav = new Navigation(engine);

    // 8. Card Transitions
    transitions = new CardTransitions(engine, nav, cursor);
    window.__cardTransitions = transitions;

    // 9. Minimap
    minimap = new Minimap(engine);

    // Expose for testing
    window.__playground = { engine, transitions, nav };

    // 10. Wire up engine callbacks
    engine.onClickElement = (el, elementId) => {
      transitions.openCard(elementId);
    };

    engine.onDragStart = () => {
      if (cursor) cursor.setDragging(true);
      hideDragHint();
    };

    engine.onDragEnd = () => {
      if (cursor) cursor.setDragging(false);
    };

    engine.onPanUpdate = (panX, panY) => {
      parallax.update(panX, panY);
      if (minimap) minimap.update();
    };

    // 11. Start loading sequence
    loader = new Loader(() => {
      revealElements();
      if (nav) nav.reveal();
      showDragHint();
      if (minimap) minimap.update();
    });

    loader.start();

    // Start idle animations after reveal
    setTimeout(() => {
      startIdleAnimations();
    }, 3500);
  }

  // ── Reveal elements with stagger ──
  function revealElements() {
    const elements = document.querySelectorAll('.canvas-element');

    if (prefersReducedMotion()) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    // Reveal hero first
    const heroEl = document.querySelector('.hero-element');
    if (heroEl) {
      gsap.fromTo(heroEl,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
          onComplete: () => heroEl.classList.add('revealed') }
      );

      // Stagger hero text children
      const heroName = heroEl.querySelector('.hero-name');
      const heroTagline = heroEl.querySelector('.hero-tagline');
      const heroSubtitle = heroEl.querySelector('.hero-subtitle');

      if (heroName) gsap.fromTo(heroName, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' });
      if (heroTagline) gsap.fromTo(heroTagline, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' });
      if (heroSubtitle) gsap.fromTo(heroSubtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.6, ease: 'power2.out' });

      // Animate highlight stroke behind "Creative." — staggered brush strokes
      const highlightPaths = heroEl.querySelectorAll('.highlight-path');
      if (highlightPaths.length) {
        gsap.to(highlightPaths, {
          opacity: 0.7,
          duration: 0.35,
          stagger: 0.12,
          delay: 0.9,
          ease: 'power2.out',
          onStart: function() {
            // Animate each path with a left-to-right clip reveal
            highlightPaths.forEach((path, i) => {
              gsap.fromTo(path,
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: 0.5, delay: i * 0.12, ease: 'power2.out' }
              );
            });
          }
        });
      }
    }

    // Reveal other elements with stagger
    elements.forEach((el, i) => {
      if (el === heroEl) return; // skip hero, already handled

      gsap.fromTo(el,
        {
          opacity: 0,
          scale: 0.85,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          delay: 0.3 + i * 0.06,
          ease: 'power2.out',
          onComplete: () => el.classList.add('revealed'),
        }
      );
    });
  }

  // ── Idle floating animations ──
  function startIdleAnimations() {
    if (prefersReducedMotion()) return;

    // Cards: gentle bob
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: '+=3',
        duration: randomRange(3, 5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      });
    });

    // Stickers: floating + slight rotation
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach((sticker, i) => {
      const isAlt = i % 2 === 0;
      sticker.style.setProperty('--float-duration', `${randomRange(3, 5)}s`);
      sticker.style.setProperty('--float-delay', `${i * 0.3}s`);
      sticker.classList.add(isAlt ? 'idle-animate' : 'idle-animate-alt');
    });
  }

  // ── Drag hint ──
  let dragHintTimeout;

  function showDragHint() {
    const hint = document.querySelector('.drag-hint');
    if (!hint || prefersReducedMotion()) return;

    dragHintTimeout = setTimeout(() => {
      hint.classList.add('visible');
    }, 800);
  }

  function hideDragHint() {
    const hint = document.querySelector('.drag-hint');
    if (hint) {
      hint.classList.remove('visible');
      clearTimeout(dragHintTimeout);
    }
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
