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

  // Get custom cursor element
  const customCursor = document.querySelector('.custom-cursor');

  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Hide custom cursor and restore default
    if (customCursor) customCursor.style.display = 'none';
    document.body.classList.remove('has-custom-cursor');

    // Trap focus inside panel
    requestAnimationFrame(() => {
      closeBtn && closeBtn.focus();
    });
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore custom cursor
    if (customCursor && !('ontouchstart' in window)) {
      customCursor.style.display = '';
      document.body.classList.add('has-custom-cursor');
    }

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
