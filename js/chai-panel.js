/* ============================================
   CHAI-PANEL.JS — Chai Recipe Side Panel Toggle
   ============================================ */

(function () {
  'use strict';

  const panel = document.getElementById('chaiPanel');
  const backdrop = document.getElementById('chaiBackdrop');
  const closeBtn = document.getElementById('chaiClose');
  const notebook = document.getElementById('chaiNotebook');

  if (!panel) return;

  function open() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Scroll notebook to top on each open
    if (notebook) notebook.scrollTop = 0;

    requestAnimationFrame(() => {
      closeBtn && closeBtn.focus();
    });
  }

  function close() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      close();
    }
  });

  // Expose globally for sticker click handler
  window.__chaiPanel = { open, close };
})();
