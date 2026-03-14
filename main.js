/* =============================================
   MD. IBNE JOHA - Research Profile
   Shared JavaScript — main.js
   ============================================= */

// =========== THEME TOGGLE ===========
(function () {
  const STORAGE_KEY = 'joha-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || preferred);
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  document.addEventListener('DOMContentLoaded', initTheme);
})();

// =========== HEADER SCROLL EFFECT ===========
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

// =========== HAMBURGER MENU ===========
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
});

// =========== ACTIVE NAV LINK ===========
document.addEventListener('DOMContentLoaded', function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
});

// =========== SCROLL REVEAL ANIMATION ===========
document.addEventListener('DOMContentLoaded', function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
});

// =========== COUNTER ANIMATION ===========
function animateCounter(el, end, duration = 1800) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { start = end; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        animateCounter(el, parseInt(el.dataset.count), 1600);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
});

// =========== CANVAS PARTICLE ANIMATION (hero only) ===========
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animFrame;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.r = Math.random() * 2.5 + 1;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
    if (animFrame) cancelAnimationFrame(animFrame);
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56,189,248,${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init, { passive: true });
  init();
});

// =========== LIGHTBOX ===========
document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.achievement-imgs img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
});

// =========== PUBLICATION FILTERS ===========
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const pubCards = document.querySelectorAll('.pub-card[data-type]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      pubCards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
      });
    });
  });
});

// =========== CITE PANEL TOGGLE ===========
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cite-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = btn.nextElementSibling;
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      // close all first
      document.querySelectorAll('.cite-panel.open').forEach(p => p.classList.remove('open'));
      if (!isOpen) panel.classList.add('open');
    });
  });

  document.querySelectorAll('.cite-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const panel = tab.closest('.cite-panel');
      panel.querySelectorAll('.cite-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const format = tab.dataset.format;
      panel.querySelectorAll('.cite-text').forEach(t => {
        t.style.display = t.dataset.format === format ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.cite-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.cite-panel');
      const activeText = panel.querySelector('.cite-text:not([style*="none"])');
      if (activeText) {
        navigator.clipboard.writeText(activeText.textContent.trim()).then(() => {
          const orig = btn.textContent;
          btn.textContent = '✅ Copied!';
          setTimeout(() => btn.textContent = orig, 1500);
        });
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.cite-panel.open').forEach(p => p.classList.remove('open'));
  });
});

// =========== FETCH CITATIONS (Semantic Scholar) ===========
document.addEventListener('DOMContentLoaded', function () {
  const badges = document.querySelectorAll('[data-doi]');
  if (!badges.length) return;

  badges.forEach(async (badge) => {
    const doi = badge.dataset.doi;
    if (!doi || doi === 'none') return;

    badge.innerHTML = '<span style="animation:spin 0.8s linear infinite;display:inline-block">⟳</span> Cited by…';
    badge.classList.add('loading');

    try {
      const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}?fields=citationCount`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      const count = data.citationCount ?? '—';
      badge.innerHTML = `📊 Cited by <strong>${count}</strong>`;
      badge.classList.remove('loading');
    } catch {
      badge.innerHTML = '📊 <a href="https://scholar.google.com/scholar?q=' + encodeURIComponent(badge.closest('.pub-card')?.querySelector('.pub-title')?.textContent || '') + '" target="_blank" rel="noopener">View on Scholar</a>';
      badge.classList.remove('loading');
    }
  });
});
