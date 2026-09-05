document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close mobile menu after clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // Close mobile menu as soon as the user starts scrolling
    window.addEventListener('scroll', () => {
      navLinks.classList.remove('open');
    }, { passive: true });
  }

  // Auto-update footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Light/dark theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const root = document.documentElement;
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Highlight the active nav link based on which full-screen section is in view
  const sections = document.querySelectorAll('.full-screen[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const setActiveLink = (id) => {
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
  }

  // Projects carousel: monitor-only, slides by 1 project per click,
  // always keeping 3 in view. Tablet/phone show all projects normally.
  const projectsTrack = document.getElementById('projectsGrid');
  const prevBtn = document.getElementById('projectsPrev');
  const nextBtn = document.getElementById('projectsNext');
  const desktopQuery = window.matchMedia('(min-width: 1025px)');

  if (projectsTrack && prevBtn && nextBtn) {
    const cards = Array.from(projectsTrack.children);
    const visibleCount = 3;
    const maxStart = Math.max(0, cards.length - visibleCount);
    let start = 0;

    const renderSlide = () => {
      if (!desktopQuery.matches) {
        projectsTrack.style.transform = 'none';
        return;
      }
      const offset = cards[start] ? cards[start].offsetLeft : 0;
      projectsTrack.style.transform = `translateX(-${offset}px)`;
      prevBtn.hidden = start === 0;
      nextBtn.hidden = start >= maxStart;
    };

    prevBtn.addEventListener('click', () => {
      if (start > 0) {
        start--;
        renderSlide();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (start < maxStart) {
        start++;
        renderSlide();
      }
    });

    desktopQuery.addEventListener('change', () => {
      start = 0;
      renderSlide();
    });

    window.addEventListener('resize', renderSlide);

    renderSlide();
  }

});