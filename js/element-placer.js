/* ============================================
   ELEMENT-PLACER.JS — Create & Position Elements
   Umi-style dense scatter with varied card types
   ============================================ */

class ElementPlacer {
  constructor(world) {
    this.world = world;
    this.elements = new Map();
  }

  placeAll(elements) {
    const isMobile = window.innerWidth < 768;
    const overrides = isMobile ? (CONFIG.mobileOverrides || {}) : {};

    for (const cfg of elements) {
      // Apply mobile overrides if available
      const mobileCfg = overrides[cfg.id];
      const finalCfg = mobileCfg
        ? { ...cfg, ...mobileCfg, data: cfg.data, type: cfg.type, depth: cfg.depth, rotation: cfg.rotation }
        : cfg;

      const el = this.createElement(finalCfg);
      if (el) {
        this.positionElement(el, finalCfg);
        this.world.appendChild(el);
        this.elements.set(finalCfg.id, el);
      }
    }
  }

  createElement(cfg) {
    switch (cfg.type) {
      case 'hero':        return this._createHero(cfg);
      case 'work-card':   return this._createWorkCard(cfg);
      case 'game-card':   return this._createGameCard(cfg);
      case 'info-card':   return this._createInfoCard(cfg);
      case 'mini-card':   return this._createMiniCard(cfg);
      case 'illustration': return this._createIllustration(cfg);
      case 'image-sticker': return this._createImageSticker(cfg);
      case 'draggable-sticker': return this._createDraggableSticker(cfg);
      case 'photo-card':  return this._createPhotoCard(cfg);
      case 'sticker':     return this._createSticker(cfg);
      case 'work-stack':  return this._createWorkStack(cfg);
      default:            return null;
    }
  }

  positionElement(el, cfg) {
    el.style.left = `${cfg.x}px`;
    el.style.top = `${cfg.y}px`;
    el.style.width = `${cfg.width}px`;

    if (cfg.rotation) {
      el.style.transform = `rotate(${cfg.rotation}deg)`;
    }

    el.dataset.elementId = cfg.id;
    el.dataset.depth = cfg.depth || 1;
    el.dataset.originX = cfg.x + cfg.width / 2;
    el.dataset.originY = cfg.y + (cfg.height || 0) / 2;

    el.classList.add('canvas-element');
    el.setAttribute('data-depth', cfg.depth || 1);
  }

  // ── HERO — Umi-style centered headline with highlighted word ──
  _createHero(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element hero-element';
    el.id = cfg.id;
    const nameMarkup = cfg.data.name ? `<span class="hero-name">${cfg.data.name}</span> ` : '';
    el.innerHTML = `
      <h1 class="hero-headline">
        ${nameMarkup}${cfg.data.tagline}
        <span class="hero-highlight">${cfg.data.highlightWord}<svg class="hero-highlight__stroke" viewBox="0 0 237.91 37.29" preserveAspectRatio="none" aria-hidden="true"><path class="highlight-path" d="M52.55,15.15c-4.81-1.44-37.11,1.16-39.18.83-1.94-.52.75-11,2.49-12.6.62-.57,1.34-.7,3.02-.48,2.03.27,28.9-1.06,36.94-1.43,0,0,54.12-1.14,63.19-1.25,2.88-.04.6.59,3.99.36,7.21-.48,22.93.19,28.39-.29,4.38-.39,5.32-.39,9.51.05,3.6.38,27.06.55,29.72-.14.65-.17,1.13-.09,1.12.14.18.02,16.06.77,16.12.94.12.23.6.36,1.06.22.84-.25,17.97-.39,18.23.29.73,1.96-1.96,10.01-3.99,11.94-1.06,1.01-4.33.82-8.47.48-13-1.06-7.03-.13-20.13-.49-40.01-1.11-33.24-.92-44.02-.14-1.01-.71-4.95.94-7.32-.29-.99-.51-8.07-.65-9.65-.16-1.14.36-37.27-.8-41.32.71-7.41-1.22-36.17,1.1-39.69,1.31Z" fill="#feef38" opacity="0"/><path class="highlight-path" d="M44,24.04c-5.48-1.44-41.15,2.52-43.19,2.33-2.16-.43.45-11.03,2.32-12.72.66-.6,1.46-.77,3.33-.63,1.95.15,15.04-1.07,40.93-2.76,0,0,37.46-1.78,70.31-.64,3.21.11.64.59,4.42.56,9.63-.08,25.17,1.79,31.36,1.55,9.68-.36,6.69.57,16.87.67,8.02.08,23.57-1.01,25.75-1.66.71-.21,1.25-.17,1.26.06.44,0,18.05-.2,18.24.24.13.23.69.36,1.21.21,2.74-.55,20.74.75,21.05,1.9.27,1.04-.67,3.42-1.96,5.76-3.51,6.39-4.82,6.07-7.32,5.84-3.26-.3-5.63-.64-5.63-.64-9.83-1.23-12.49-.32-16.49-.27-1.23.02-3,.05-5.13.12-55.33,1.63-19.64.39-49.42.99-1.1-.76-5.59.64-8.15-.75-1.08-.59-8.9-1.2-10.66-.83-1,.21-39.98-2.83-45.4-.95-8.62-1.41-35.07.86-43.69,1.62Z" fill="#feef38" opacity="0"/><path class="highlight-path" d="M48.64,35.93c-3.99-1.59-35.33-1.62-38.07-2.27-1.83-.7,1.76-10.89,3.56-12.33.64-.51,1.35-.58,2.94-.21,2.92.67,32.52,1.3,35.58,1.35.42.34,1.77-.69,2-.29.84,1.1,46.85,1.42,47.85,1.42,5.68.03,9.88.02,11.02.03,2.77.01.57.59,3.83.41,6.95-.4,22.09.3,27.35-.26,4.21-.45,5.12-.42,9.17-.06,4.69.41,26.13-.16,28.61-.96.61-.2,1.08-.14,1.09.09.11,0,15.52.1,15.56.21.12.23.6.33,1.03.17.8-.23,17.26-1.43,17.55-.77.83,1.92-1.23,10.11-3.09,12.16-1.95,2.15-12.93,0-21.46,1.39-51.43.7-34.09-.24-49.15,1.06-.99-.7-4.81.99-7.12-.25-.97-.52-7.85-.61-9.39-.15-.66.2-9.81-.1-19.24-.32-9.43-.23-19.15-.42-20.97.23-5.42-1.17-26.51-.75-38.65-.66Z" fill="#feef38" opacity="0"/></svg></span>
        ${cfg.data.tagline2}
      </h1>
      <p class="hero-subtitle">${cfg.data.subtitle}</p>
    `;
    el.setAttribute('aria-label', `${cfg.data.tagline} ${cfg.data.highlightWord} — ${cfg.data.subtitle}`);
    return el;
  }

  // ── WORK CARD — with variant styles ──
  _createWorkCard(cfg) {
    const el = document.createElement('article');
    const variant = cfg.data.variant || 'default';
    el.className = `canvas-element card work-card work-card--${variant}`;
    el.id = cfg.id;
    el.setAttribute('data-clickable', 'true');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `View project: ${cfg.data.title} — ${cfg.data.subtitle}`);

    if (variant === 'dark') {
      el.innerHTML = `
        <div class="card-thumbnail" style="background-color: ${cfg.data.color}">
          <span class="card-category">${cfg.data.category}</span>
        </div>
        <div class="card-content card-content--dark">
          <h3 class="card-title">${cfg.data.title}</h3>
          <p class="card-subtitle">${cfg.data.subtitle}</p>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="card-thumbnail" style="background-color: ${cfg.data.color}">
          <span class="card-category">${cfg.data.category}</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">${cfg.data.title}</h3>
          <p class="card-subtitle">${cfg.data.subtitle}</p>
        </div>
        <div class="card-year">${cfg.data.year || ''}</div>
      `;
    }

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
    return el;
  }

  // ── MINI CARD — small floating UI snippet cards (Umi-style) ──
  _createMiniCard(cfg) {
    const el = document.createElement('div');
    const variant = cfg.data.variant || 'default';
    el.className = `canvas-element mini-card mini-card--${variant}`;
    el.id = cfg.id;
    el.setAttribute('aria-hidden', 'true');

    const iconHtml = cfg.data.icon === 'check'
      ? `<span class="mini-card-icon">&#10003;</span>`
      : cfg.data.icon === 'trophy'
      ? `<span class="mini-card-icon">&#9733;</span>`
      : '';

    el.innerHTML = `
      ${cfg.data.label ? `<span class="mini-card-label">${cfg.data.label}</span>` : ''}
      <span class="mini-card-text">${cfg.data.text}</span>
      ${iconHtml}
    `;
    return el;
  }

  // ── ILLUSTRATION — hand-drawn SVG illustrations ──
  _createIllustration(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element illustration';
    el.id = cfg.id;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = this._getIllustrationSvg(cfg.data.shape, cfg.width, cfg.height);
    return el;
  }

  // ── IMAGE STICKER — PNG sticker with instant-swap frame animation ──
  _createImageSticker(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element image-sticker';
    el.id = cfg.id;
    el.setAttribute('aria-label', cfg.data.alt || '');

    const bubbleText = cfg.data.speechBubble || 'hey! hows it going';

    // Build frame images — support hoverFrames array or legacy hoverSrc/hoverSrc2
    const hoverFrames = cfg.data.hoverFrames;
    let framesHtml = `<img class="image-sticker-frame" data-frame="0" src="${cfg.data.src}" alt="${cfg.data.alt || ''}" width="${cfg.width}" height="${cfg.height}" loading="lazy" draggable="false">`;
    if (hoverFrames && hoverFrames.length > 1) {
      for (let i = 1; i < hoverFrames.length; i++) {
        framesHtml += `<img class="image-sticker-frame" data-frame="${i}" src="${hoverFrames[i]}" alt="" width="${cfg.width}" height="${cfg.height}" loading="lazy" draggable="false" aria-hidden="true">`;
      }
    } else {
      if (cfg.data.hoverSrc) framesHtml += `<img class="image-sticker-frame" data-frame="1" src="${cfg.data.hoverSrc}" alt="" width="${cfg.width}" height="${cfg.height}" loading="lazy" draggable="false" aria-hidden="true">`;
      if (cfg.data.hoverSrc2) framesHtml += `<img class="image-sticker-frame" data-frame="2" src="${cfg.data.hoverSrc2}" alt="" width="${cfg.width}" height="${cfg.height}" loading="lazy" draggable="false" aria-hidden="true">`;
    }

    el.innerHTML = `
      <div class="speech-bubble" aria-hidden="true">${bubbleText}</div>
      ${framesHtml}
    `;

    const frames = el.querySelectorAll('.image-sticker-frame');
    // Animation sequences
    const useHoverFrames = !!(hoverFrames && hoverFrames.length > 1);
    const sequence = useHoverFrames
      ? Array.from({ length: hoverFrames.length }, (_, i) => i) // cycle through all frames
      : [1, 2, 1, 2]; // legacy wave: half-wave, full-wave
    let seqIdx = 0;
    let waveTimer = null;
    let active = -1;
    const hasHoverFrames = frames.length > 1;

    function showFrame(idx) {
      if (idx >= frames.length || idx === active) return;
      frames.forEach((f, i) => {
        f.style.visibility = i === idx ? 'visible' : 'hidden';
      });
      active = idx;
    }

    showFrame(0);

    if (hasHoverFrames) {
      const frameDelay = useHoverFrames ? 120 : 280;
      el.addEventListener('mouseenter', () => {
        seqIdx = 0;
        showFrame(sequence[seqIdx]);
        waveTimer = setInterval(() => {
          seqIdx = (seqIdx + 1) % sequence.length;
          showFrame(sequence[seqIdx]);
        }, frameDelay);
      });
    }

    el.addEventListener('mouseleave', () => {
      if (waveTimer) { clearInterval(waveTimer); waveTimer = null; }
      if (hasHoverFrames) showFrame(0);
    });

    // Click action support (e.g. open chai recipe panel)
    if (cfg.data.clickAction === 'openChaiPanel') {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', () => {
        if (window.__chaiPanel) window.__chaiPanel.open();
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.__chaiPanel) window.__chaiPanel.open();
        }
      });
    }

    // Naruto runner game — opens in site overlay
    if (cfg.data.clickAction === 'openNarutoGame') {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      const openGame = () => {
        if (window.__cardTransitions) {
          window.__cardTransitions.openNarutoGame();
        }
      };
      el.addEventListener('click', openGame);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGame(); }
      });
    }

    return el;
  }

  // ── DRAGGABLE STICKER — PNG sticker that can be dragged around the canvas ──
  _createDraggableSticker(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element draggable-sticker';
    el.id = cfg.id;
    el.setAttribute('aria-label', cfg.data.alt || 'Draggable sticker');

    el.innerHTML = `
      <img src="${cfg.data.src}" alt="${cfg.data.alt || ''}" width="${cfg.width}" height="${cfg.height}" loading="lazy" draggable="false">
    `;

    // ── Drag logic (pointer events + GSAP) ──
    let dragging = false;
    let startX = 0, startY = 0;
    let elStartX = 0, elStartY = 0;
    let currentZoom = 1;

    const onDown = (e) => {
      e.stopPropagation(); // prevent canvas pan
      dragging = true;
      el.setPointerCapture(e.pointerId);

      // Get current zoom from the world transform
      const worldEl = el.closest('.world');
      if (worldEl) {
        const m = new DOMMatrix(getComputedStyle(worldEl).transform);
        currentZoom = m.a || 1; // scaleX from matrix
      }

      startX = e.clientX;
      startY = e.clientY;
      elStartX = parseFloat(el.style.left) || cfg.x;
      elStartY = parseFloat(el.style.top) || cfg.y;

      gsap.to(el, {
        scale: 1.08,
        duration: 0.2,
        ease: 'power2.out'
      });
      el.classList.add('is-dragging');
    };

    const onMove = (e) => {
      if (!dragging) return;
      const dx = (e.clientX - startX) / currentZoom;
      const dy = (e.clientY - startY) / currentZoom;

      gsap.set(el, {
        left: elStartX + dx,
        top: elStartY + dy,
      });
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture(e.pointerId);

      gsap.to(el, {
        scale: 1,
        duration: 0.35,
        ease: 'elastic.out(1, 0.5)'
      });
      el.classList.remove('is-dragging');
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return el;
  }

  // ── PHOTO CARD — image placeholder with rounded corners ──
  _createPhotoCard(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element photo-card';
    el.id = cfg.id;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="photo-card-image" style="background-color: ${cfg.data.color}; width: ${cfg.width}px; height: ${cfg.height}px;"></div>
    `;
    return el;
  }

  // ── GAME CARD ──
  _createGameCard(cfg) {
    const el = document.createElement('article');
    el.className = 'canvas-element card game-card';
    el.id = cfg.id;
    el.setAttribute('data-clickable', 'true');
    el.setAttribute('data-game', cfg.data.gameType);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `Play: ${cfg.data.title}`);

    const iconSvg = cfg.data.icon === 'dots'
      ? `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2">
           <circle cx="8" cy="8" r="3"/><circle cx="20" cy="5" r="3"/>
           <circle cx="32" cy="10" r="3"/><circle cx="35" cy="25" r="3"/>
           <circle cx="25" cy="35" r="3"/><circle cx="10" cy="30" r="3"/>
           <line x1="8" y1="8" x2="20" y2="5" stroke-dasharray="3 3"/>
         </svg>`
      : `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2">
           <circle cx="20" cy="20" r="16"/>
           <circle cx="12" cy="16" r="4" fill="var(--color-accent)"/>
           <circle cx="28" cy="16" r="4" fill="var(--color-gold)"/>
           <circle cx="20" cy="28" r="4" fill="var(--color-sage)"/>
         </svg>`;

    el.innerHTML = `
      <div class="game-card-icon">${iconSvg}</div>
      <div class="card-content">
        <h3 class="card-title">${cfg.data.title}</h3>
        <p class="card-subtitle" style="font-family: var(--font-hand)">${cfg.data.subtitle}</p>
      </div>
      <div class="game-card-badge">Play</div>
    `;

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
    return el;
  }

  // ── INFO CARD — Widget-style cards ──
  _createInfoCard(cfg) {
    const el = document.createElement('article');
    const variant = cfg.data.variant || 'default';
    el.className = `canvas-element card info-card info-card--${variant}`;
    el.id = cfg.id;
    el.setAttribute('data-clickable', 'true');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${cfg.data.title}: ${cfg.data.content.substring(0, 60)}...`);

    const icon = cfg.data.icon || '';

    if (variant === 'about') {
      el.innerHTML = `
        <h3 class="info-card__title">${cfg.data.title}</h3>
        <div class="info-card__visual">
          <img src="${cfg.data.photo || ''}" alt="Shruti" class="info-card__cover" />
        </div>
        <span class="info-card__cta">${cfg.data.content}</span>
      `;
    } else if (variant === 'contact') {
      el.innerHTML = `
        <h3 class="info-card__title">${cfg.data.title}</h3>
        <p class="info-card__desc">${cfg.data.content}</p>
        <div class="info-card__spacer"></div>
        ${cfg.data.email ? `<span class="info-card__email">${cfg.data.email}</span>` : ''}
        <span class="info-card__cta">${cfg.data.cta} <span class="info-card__arrow">→</span></span>
      `;
    } else {
      el.innerHTML = `
        <h3 class="card-title">${cfg.data.title}</h3>
        <p class="info-card-text">${cfg.data.content}</p>
        ${cfg.data.email ? `<a class="info-card-email" href="mailto:${cfg.data.email}">${cfg.data.email}</a>` : ''}
        <span class="info-card-cta">${cfg.data.cta} &rarr;</span>
      `;
    }

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
    return el;
  }

  // ── STICKER ──
  _createSticker(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element sticker';
    el.id = cfg.id;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = this._getStickerSvg(cfg.data.shape, cfg.width, cfg.height);
    return el;
  }

  // ── Illustration SVGs ──
  _getIllustrationSvg(shape, w, h) {
    const svgs = {
      'designer-at-desk': `<svg viewBox="0 0 160 180" width="${w}" height="${h}" fill="none" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <!-- person sitting at desk -->
        <ellipse cx="80" cy="55" rx="18" ry="20" fill="#FFF8EE"/>
        <path d="M62 55 Q60 45 65 38 Q72 30 80 28 Q88 30 95 38 Q100 45 98 55" fill="#FFF8EE"/>
        <circle cx="73" cy="52" r="1.5" fill="#1A1A1A"/>
        <circle cx="87" cy="52" r="1.5" fill="#1A1A1A"/>
        <path d="M77 58 Q80 61 83 58" fill="none"/>
        <path d="M62 72 L55 110 Q55 115 60 115 L100 115 Q105 115 105 110 L98 72" fill="#FFF8EE"/>
        <line x1="55" y1="115" x2="45" y2="155"/>
        <line x1="105" y1="115" x2="115" y2="155"/>
        <path d="M45 150 L35 155 L55 155 L45 150" fill="none"/>
        <path d="M115 150 L105 155 L125 155 L115 150" fill="none"/>
        <!-- desk -->
        <line x1="20" y1="125" x2="140" y2="125" stroke-width="2.5"/>
        <!-- laptop on desk -->
        <rect x="55" y="105" width="50" height="18" rx="2" fill="#E8E0D4"/>
        <rect x="45" y="122" width="70" height="3" rx="1" fill="#D4CFC5"/>
        <!-- hair -->
        <path d="M62 42 Q55 30 65 22 Q75 15 85 18 Q100 22 98 40" fill="#1A1A1A"/>
        <path d="M62 42 Q58 50 55 62" stroke="#1A1A1A" fill="none"/>
      </svg>`,

      'bicycle': `<svg viewBox="0 0 150 130" width="${w}" height="${h}" fill="none" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <!-- wheels -->
        <circle cx="35" cy="90" r="25"/>
        <circle cx="115" cy="90" r="25"/>
        <!-- frame -->
        <line x1="35" y1="90" x2="65" y2="55"/>
        <line x1="65" y1="55" x2="90" y2="55"/>
        <line x1="90" y1="55" x2="115" y2="90"/>
        <line x1="65" y1="55" x2="75" y2="90"/>
        <line x1="75" y1="90" x2="115" y2="90"/>
        <!-- handlebars -->
        <line x1="90" y1="55" x2="95" y2="42"/>
        <path d="M88 40 Q95 38 102 42"/>
        <!-- seat -->
        <line x1="65" y1="55" x2="60" y2="45"/>
        <line x1="53" y1="45" x2="67" y2="45"/>
        <!-- pedals -->
        <circle cx="75" cy="90" r="3"/>
        <!-- person riding (simple) -->
        <circle cx="68" cy="25" r="10" fill="#FFF8EE"/>
        <circle cx="65" cy="23" r="1" fill="#1A1A1A"/>
        <path d="M63 28 Q66 30 69 28"/>
        <path d="M68 35 L65 55" stroke-width="1.5"/>
        <path d="M65 55 L75 90"/>
        <path d="M68 45 L90 55"/>
      </svg>`,

      'paper-plane': `<svg viewBox="0 0 80 60" width="${w}" height="${h}" fill="none" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 30 L70 8 L45 55 L35 35 Z" fill="#FADA6A" stroke="#1A1A1A"/>
        <line x1="70" y1="8" x2="35" y2="35"/>
        <!-- trail dots -->
        <circle cx="12" cy="38" r="1.5" fill="#D4CFC5" stroke="none"/>
        <circle cx="6" cy="42" r="1" fill="#D4CFC5" stroke="none"/>
        <circle cx="2" cy="48" r="0.8" fill="#D4CFC5" stroke="none"/>
      </svg>`,
    };
    return svgs[shape] || '';
  }

  // ── Sticker SVGs ──
  _getStickerSvg(shape, w, h) {
    const svgs = {
      'star': `<svg viewBox="0 0 60 60" width="${w}" height="${h}" fill="none">
        <path d="M30 5 L35 22 L52 22 L38 33 L43 50 L30 40 L17 50 L22 33 L8 22 L25 22 Z" fill="var(--color-gold)" opacity="0.7"/>
      </svg>`,

      'star-small': `<svg viewBox="0 0 40 40" width="${w}" height="${h}" fill="none">
        <path d="M20 4 L23 15 L35 15 L26 22 L29 33 L20 27 L11 33 L14 22 L5 15 L17 15 Z" fill="var(--color-accent)" opacity="0.5"/>
      </svg>`,

      'squiggle': `<svg viewBox="0 0 100 40" width="${w}" height="${h}" fill="none">
        <path d="M5 20 Q15 5 25 20 Q35 35 45 20 Q55 5 65 20 Q75 35 85 20" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
      </svg>`,

      'arrow': `<svg viewBox="0 0 60 40" width="${w}" height="${h}" fill="none">
        <path d="M8 20 L42 20 M32 12 L44 20 L32 28" stroke="var(--color-ink-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
      </svg>`,

      'birds': `<svg viewBox="0 0 80 50" width="${w}" height="${h}" fill="none" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" opacity="0.35">
        <path d="M10 25 Q15 18 20 25"/>
        <path d="M25 20 Q30 13 35 20"/>
        <path d="M40 28 Q45 22 50 28"/>
        <path d="M55 15 Q60 8 65 15"/>
        <path d="M62 22 Q67 16 72 22"/>
      </svg>`,

      'coffee': `<svg viewBox="0 0 50 50" width="${w}" height="${h}" fill="none">
        <path d="M10 22 L10 40 Q10 44 14 44 L32 44 Q36 44 36 40 L36 22" stroke="var(--color-ink-muted)" stroke-width="1.8" opacity="0.4" stroke-linecap="round"/>
        <path d="M36 26 L40 26 Q45 26 45 31 Q45 36 40 36 L36 36" stroke="var(--color-ink-muted)" stroke-width="1.8" opacity="0.4"/>
        <path d="M16 18 Q17 12 16 8" stroke="var(--color-ink-muted)" stroke-width="1.3" stroke-linecap="round" opacity="0.3"/>
        <path d="M23 18 Q24 10 23 5" stroke="var(--color-ink-muted)" stroke-width="1.3" stroke-linecap="round" opacity="0.3"/>
        <path d="M30 18 Q31 12 30 8" stroke="var(--color-ink-muted)" stroke-width="1.3" stroke-linecap="round" opacity="0.3"/>
      </svg>`,

      'dots-pattern': `<svg viewBox="0 0 90 60" width="${w}" height="${h}" fill="none">
        <circle cx="10" cy="15" r="3" fill="var(--color-gold)" opacity="0.4"/>
        <circle cx="30" cy="10" r="2" fill="var(--color-accent)" opacity="0.3"/>
        <circle cx="50" cy="20" r="3.5" fill="var(--color-sage)" opacity="0.4"/>
        <circle cx="70" cy="12" r="2.5" fill="var(--color-blue)" opacity="0.3"/>
        <circle cx="20" cy="40" r="2" fill="var(--color-gold)" opacity="0.3"/>
        <circle cx="45" cy="45" r="3" fill="var(--color-accent)" opacity="0.4"/>
        <circle cx="65" cy="38" r="2" fill="var(--color-sage)" opacity="0.3"/>
      </svg>`,

      'plant': `<svg viewBox="0 0 50 65" width="${w}" height="${h}" fill="none">
        <path d="M25 60 L25 25" stroke="var(--color-sage)" stroke-width="1.8" opacity="0.6"/>
        <path d="M25 40 Q12 32 10 20 Q10 16 15 18 Q20 22 25 32" fill="var(--color-sage)" opacity="0.3"/>
        <path d="M25 30 Q38 22 40 12 Q41 8 36 11 Q30 15 25 25" fill="var(--color-sage)" opacity="0.25"/>
        <path d="M25 45 Q18 40 15 32 Q13 28 18 30 Q22 34 25 42" fill="var(--color-sage)" opacity="0.2"/>
      </svg>`,

      'hands': `<svg viewBox="0 0 60 60" width="${w}" height="${h}" fill="none" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" opacity="0.35">
        <!-- waving hands -->
        <path d="M15 35 L15 15 M15 15 L10 8 M15 15 L15 6 M15 15 L20 7 M15 15 L24 10"/>
        <path d="M45 35 L45 15 M45 15 L40 8 M45 15 L45 6 M45 15 L50 7 M45 15 L54 10"/>
        <!-- motion lines -->
        <path d="M8 20 Q5 25 8 30"/>
        <path d="M52 20 Q55 25 52 30"/>
      </svg>`,

      'sparkle': `<svg viewBox="0 0 30 30" width="${w}" height="${h}" fill="none">
        <path d="M15 2 L15 28 M2 15 L28 15 M6 6 L24 24 M24 6 L6 24" stroke="var(--color-gold)" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
      </svg>`,

      'leaf': `<svg viewBox="0 0 40 55" width="${w}" height="${h}" fill="none">
        <path d="M20 50 L20 20 Q10 15 8 5 Q20 10 20 20 Q30 10 32 5 Q30 15 20 20" fill="var(--color-sage)" opacity="0.25" stroke="var(--color-sage)" stroke-width="1" stroke-opacity="0.4"/>
      </svg>`,
    };
    return svgs[shape] || svgs['star'];
  }

  // ── WORK STACK — fanned deck of project cards with label ──
  _createWorkStack(cfg) {
    const el = document.createElement('div');
    el.className = 'canvas-element work-stack';
    el.id = cfg.id;
    el.setAttribute('data-clickable', 'true');
    el.setAttribute('data-stack-type', cfg.data.stackType);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `View ${cfg.data.stackName} projects`);

    const cards = cfg.data.cards;
    const deckCards = cards.slice(0, 5);

    // Palette dots — pick 3-4 colors from the stack's cards
    const dotColors = deckCards.slice(0, 4).map(c => c.color);

    // Build card deck HTML — moodboard style
    const deckHtml = deckCards.map((card, i) => {
      const offsetX = (i - Math.floor(deckCards.length / 2)) * 6;
      const offsetY = i * -3;
      const rotation = (i - Math.floor(deckCards.length / 2)) * 2;
      const textColor = this._isLightColor(card.color) ? '#1A1A1A' : '#FFFFFF';

      const thumbHtml = card.thumb
        ? `<div class="work-stack__card-thumb"><img src="${card.thumb}" alt="${card.title}" loading="lazy" draggable="false"></div>`
        : `<div class="work-stack__card-thumb work-stack__card-thumb--placeholder"></div>`;

      const dotsHtml = dotColors.map(c => `<span class="work-stack__card-dot" style="background:${c}"></span>`).join('');

      return `
        <div class="work-stack__card" style="
          --card-bg: ${card.color};
          --stack-offset-x: ${offsetX}px;
          --stack-offset-y: ${offsetY}px;
          --stack-rotation: ${rotation}deg;
          --stack-index: ${deckCards.length - i};
          --card-text: ${textColor};
        ">
          ${thumbHtml}
          <div class="work-stack__card-dots">${dotsHtml}</div>
          <div class="work-stack__card-info">
            <div class="work-stack__card-title"><em>${card.title}</em></div>
            <div class="work-stack__card-desc">${card.desc || ''}</div>
          </div>
        </div>
      `;
    }).join('');

    const tagsHtml = cfg.data.categoryTags.map(t => `<span>${t}</span>`).join('');

    el.innerHTML = `
      <div class="work-stack__deck">
        ${deckHtml}
      </div>
      <div class="work-stack__label">
        <h3 class="work-stack__name">${cfg.data.stackName}</h3>
        <div class="work-stack__tags">${tagsHtml}</div>
      </div>
    `;

    // GSAP hover: fan cards out
    const cardEls = el.querySelectorAll('.work-stack__card');

    el.addEventListener('mouseenter', () => {
      cardEls.forEach((card, i) => {
        const fanX = (i - Math.floor(deckCards.length / 2)) * 22;
        const fanRotation = (i - Math.floor(deckCards.length / 2)) * 5;
        gsap.to(card, {
          x: fanX,
          y: -8,
          rotation: fanRotation,
          duration: 0.4,
          ease: 'power2.out',
          delay: i * 0.03,
        });
      });
    });

    el.addEventListener('mouseleave', () => {
      cardEls.forEach((card, i) => {
        const offsetX = (i - Math.floor(deckCards.length / 2)) * 6;
        const offsetY = i * -3;
        const rotation = (i - Math.floor(deckCards.length / 2)) * 2;
        gsap.to(card, {
          x: offsetX,
          y: offsetY,
          rotation: rotation,
          duration: 0.35,
          ease: 'power2.inOut',
          delay: i * 0.02,
        });
      });
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });

    return el;
  }

  // ── Helper: check if a hex color is light ──
  _isLightColor(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  }

  getElement(id) { return this.elements.get(id); }
  getAllElements() { return this.elements; }
}
