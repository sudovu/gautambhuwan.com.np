/**
 * VHUWON MATHERS — Navigation System
 * Accessible Mobile Drawer, Active Page State, 60fps Back-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Mobile Drawer
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  backdrop?.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeMenu();
    }
  });

  // 2. Active Page Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Fast-Travel Floating Scroll Navigation (Back to Top & Scroll to Bottom)
  const backToTopBtn = document.querySelector('.back-to-top');
  const scrollToBottomBtn = document.querySelector('.scroll-to-bottom');

  const updateScrollButtons = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const distanceToBottom = docHeight - (scrollY + windowHeight);

    // Back to top: visible when scrolled down > 280px
    if (backToTopBtn) {
      if (scrollY > 280) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll to bottom: visible when there is at least 320px of scrollable page remaining below
    if (scrollToBottomBtn) {
      if (distanceToBottom > 320) {
        scrollToBottomBtn.classList.add('visible');
      } else {
        scrollToBottomBtn.classList.remove('visible');
      }
    }
  };

  if (backToTopBtn || scrollToBottomBtn) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollButtons();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateScrollButtons();
    window.addEventListener('load', updateScrollButtons);

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (scrollToBottomBtn) {
      scrollToBottomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      });
    }
  }
});
