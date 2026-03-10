/**
 * TankMentor - Home Page JavaScript
 * Xử lý tương tác: mobile menu, scroll effects, animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
});

/* ============================================
   Header Scroll Effect
   Thêm shadow khi scroll xuống
   ============================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Thêm class 'scrolled' khi scroll > 10px
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================
   Mobile Menu
   Mở/đóng menu trên mobile
   ============================================ */
function initMobileMenu() {
  const btnOpen = document.getElementById('btn-mobile-menu');
  const btnClose = document.getElementById('btn-mobile-close');
  const overlay = document.getElementById('nav-mobile-overlay');
  const mobileNav = document.getElementById('nav-mobile');

  if (!btnOpen || !mobileNav) return;

  function openMenu() {
    overlay.classList.add('active');
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }

  btnOpen.addEventListener('click', openMenu);
  btnClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Đóng menu khi click vào link
  const mobileLinks = mobileNav.querySelectorAll('.nav-mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Đóng menu khi nhấn phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ============================================
   Scroll Reveal Animation
   Hiện các phần tử khi scroll vào viewport
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Bỏ observe sau khi đã hiển thị (chỉ animate 1 lần)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   Smooth Scroll
   Cuộn mượt khi click anchor links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
