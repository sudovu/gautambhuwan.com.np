/**
 * VHUWON MATHERS — High-Performance Scroll Reveal Engine
 * Instant First-Fold Paint & 120px Pre-fetch Triggering
 */
(function() {
  'use strict';

  function initAnimations() {
    // Respect user prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
      return;
    }

    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Fast-path: immediately activate elements in the initial viewport
    const vh = window.innerHeight || 800;
    const toObserve = [];

    for (let i = 0; i < reveals.length; i++) {
      const el = reveals[i];
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 80) {
        el.classList.add('active');
      } else {
        toObserve.push(el);
      }
    }

    if (!toObserve.length) return;

    // Fallback if IntersectionObserver is unavailable
    if (!('IntersectionObserver' in window)) {
      toObserve.forEach(el => el.classList.add('active'));
      return;
    }

    // Pre-trigger 120px BEFORE entering viewport so elements are already visible when user scrolls
    const observer = new IntersectionObserver((entries, obs) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      }
    }, {
      root: null,
      rootMargin: '120px 0px 60px 0px',
      threshold: 0.01
    });

    for (let i = 0; i < toObserve.length; i++) {
      observer.observe(toObserve[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations, { passive: true });
  } else {
    initAnimations();
  }
})();
