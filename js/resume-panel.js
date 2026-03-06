/* ============================================
   RESUME-PANEL.JS — Side Panel Toggle
   ============================================ */

(function () {
  'use strict';

  const avatar = document.getElementById('profileAvatar');
  const panel = document.getElementById('resumePanel');
  const backdrop = document.getElementById('resumeBackdrop');
  const closeBtn = document.getElementById('resumeClose');

  if (!avatar || !panel) return;

  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap focus inside panel
    requestAnimationFrame(() => {
      closeBtn && closeBtn.focus();
    });
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    avatar.focus();
  }

  avatar.addEventListener('click', openPanel);
  backdrop.addEventListener('click', closePanel);
  closeBtn.addEventListener('click', closePanel);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closePanel();
    }
  });
})();
