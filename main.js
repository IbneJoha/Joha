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
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

// =========== HAMBURGER MENU ===========
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
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
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
});

// =========== COUNTER ANIMATION ===========
function animateCounter(el, end, duration = 1600) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, end);
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    if (start >= end) clearInterval(timer);
  }, 16);
}

document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.count), 1600);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
});

// =========== CANVAS PARTICLE ANIMATION ===========
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animFrame;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
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
  const lbImg   = lightbox.querySelector('img');
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

// =========== ACHIEVEMENT ACCORDION ===========
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.achievement-header').forEach(btn => {
    btn.addEventListener('click', function () {
      const body   = this.nextElementSibling;
      const isOpen = this.classList.contains('open');

      // Close all others
      document.querySelectorAll('.achievement-header.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        this.classList.add('open');
        body.classList.add('open');
        // Smooth scroll into view on mobile
        if (window.innerWidth < 600) {
          setTimeout(() => this.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }
      }
    });
  });
});

// =========== PUBLICATION FILTERS ===========
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const pubCards   = document.querySelectorAll('.pub-card[data-type]');
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

// =========== CITE PANEL TOGGLE (global fixed panel) ===========
document.addEventListener('DOMContentLoaded', function () {
  if (!document.querySelector('.cite-toggle-btn')) return;

  // Build ONE global panel and append to body
  const globalPanel = document.createElement('div');
  globalPanel.className = 'cite-panel';
  globalPanel.id = 'global-cite-panel';
  globalPanel.innerHTML = `
    <div class="cite-tabs" id="cite-tab-row"></div>
    <div class="cite-text-box" id="cite-text-box"></div>
    <button class="btn btn-outline" id="cite-copy-btn"
      style="font-size:0.78rem;padding:6px 14px;width:100%;margin-top:4px;">
      📋 Copy Citation
    </button>`;
  document.body.appendChild(globalPanel);

  let currentBtn = null;

  function closePanel() {
    globalPanel.classList.remove('open');
    currentBtn = null;
  }

  function positionPanel(triggerBtn) {
    const rect = triggerBtn.getBoundingClientRect();
    const panelW = 460;
    const margin = 12;

    // Horizontal: align left with button, but don't overflow right edge
    let left = rect.left + window.scrollX;
    if (left + panelW > window.innerWidth - margin) {
      left = window.innerWidth - panelW - margin;
    }
    if (left < margin) left = margin;

    // Vertical: prefer below button, flip above if not enough room
    const spaceBelow = window.innerHeight - rect.bottom;
    const panelH = 260; // approximate
    let top;
    if (spaceBelow >= panelH || spaceBelow >= 160) {
      top = rect.bottom + window.scrollY + 6;
    } else {
      top = rect.top + window.scrollY - panelH - 6;
    }

    globalPanel.style.left = left + 'px';
    globalPanel.style.top  = top + 'px';
    globalPanel.style.width = Math.min(panelW, window.innerWidth - margin * 2) + 'px';
  }

  function populatePanel(btn) {
    // Read data stored on the button via data attributes
    const wrap = btn.closest('.cite-dropdown-wrap');
    if (!wrap) return;

    // Collect all cite-text blocks from the inline panel sibling
    const inlinePanel = wrap.querySelector('.cite-panel-data');
    if (!inlinePanel) return;

    const texts   = inlinePanel.querySelectorAll('.cite-text');
    const tabRow  = globalPanel.querySelector('#cite-tab-row');
    const textBox = globalPanel.querySelector('#cite-text-box');

    // Build tabs
    tabRow.innerHTML = '';
    let first = true;
    texts.forEach(t => {
      const fmt = t.dataset.format;
      const tab = document.createElement('button');
      tab.className = 'cite-tab' + (first ? ' active' : '');
      tab.dataset.format = fmt;
      tab.textContent = fmt.toUpperCase();
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        tabRow.querySelectorAll('.cite-tab').forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        textBox.textContent = t.textContent.trim();
      });
      tabRow.appendChild(tab);
      first = false;
    });

    // Show first text
    if (texts.length) textBox.textContent = texts[0].textContent.trim();
  }

  // Toggle on cite button click
  document.querySelectorAll('.cite-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (currentBtn === btn) { closePanel(); return; }
      currentBtn = btn;
      populatePanel(btn);
      positionPanel(btn);
      globalPanel.classList.add('open');
    });
  });

  // Copy button
  globalPanel.querySelector('#cite-copy-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const text = globalPanel.querySelector('#cite-text-box').textContent.trim();
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = globalPanel.querySelector('#cite-copy-btn');
        const orig = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = orig, 1800);
      });
    }
  });

  // Close on outside click / scroll
  document.addEventListener('click', (e) => {
    if (!globalPanel.contains(e.target)) closePanel();
  });
  window.addEventListener('scroll', closePanel, { passive: true });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  window.addEventListener('resize', () => { if (currentBtn) positionPanel(currentBtn); });
});



// =========== CROSSREF CITATION FETCHING ===========
// CrossRef is fully CORS-friendly, free, no auth needed.
// It returns real citation counts per DOI via:
//   https://api.crossref.org/works/{DOI}  →  message["is-referenced-by-count"]
//
// Note: CrossRef counts only citations from CrossRef-indexed sources.
// Values are typically slightly lower than Google Scholar but are real and live.

const DOI_MAP = {
  'pub-j1': '10.3390/s24237440',
  'pub-j2': '10.3390/app142411970',
  'pub-j3': '10.3390/wevj15120562',
  'pub-j4': '10.1109/ACCESS.2024.3355754',
  'pub-j5': null,                              // under review — no DOI yet
  'pub-j6': '10.1016/j.icte.2025.01.008',
  'pub-j7': null,                              // under review — no DOI yet
  'pub-j8': '10.1016/j.icte.2025.01.006',
  'pub-j9': '10.1109/OJCOMS.2025.11142888',
  'pub-c1': '10.1109/ICPC2T60072.2024.10474733',
  'pub-c2': '10.1109/ICCIT60221.2023.10441201',
  'pub-c3': '10.1109/ICCIT57492.2022.10054941',
  'pub-c4': '10.1109/ICCIT54785.2021.9689913',
  'pub-c5': null,                              // Korean conf — no CrossRef DOI
};

const SCHOLAR_PROFILE = 'https://scholar.google.com/citations?user=f1HR6ucAAAAJ&hl=en';

async function fetchCrossRefCount(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`CrossRef HTTP ${res.status}`);
  const json = await res.json();
  const count = json.message['is-referenced-by-count'];
  return typeof count === 'number' ? count : 0;
}

function renderCiteBadge(el, count) {
  el.classList.remove('loading');
  if (count === null) {
    el.innerHTML = `<span style="color:var(--text-muted);font-size:0.78rem;">—</span>`;
    return;
  }
  el.innerHTML =
    `📊 Cited by <strong>${count}</strong>` +
    ` <a href="${SCHOLAR_PROFILE}" target="_blank" rel="noopener"` +
    ` title="View on Google Scholar" style="font-size:0.72rem;color:var(--accent);text-decoration:none;">↗</a>`;
}

async function loadAllCitations() {
  const badges = document.querySelectorAll('.cite-count[data-pub-id]');
  if (!badges.length) return;

  // Show spinner on every badge
  badges.forEach(el => {
    el.innerHTML = '<span style="display:inline-block;animation:spin 0.9s linear infinite">⟳</span>';
    el.classList.add('loading');
  });

  // Show spinner in Scholar stats bar too
  ['gs-total', 'gs-hindex', 'gs-i10', 'gs-total-r'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<span style="animation:spin 0.9s linear infinite;display:inline-block;font-size:1rem">⟳</span>';
  });

  // Fetch all DOIs in parallel
  const results = {};
  await Promise.allSettled(
    Object.entries(DOI_MAP).map(async ([pubId, doi]) => {
      if (!doi) { results[pubId] = null; return; }
      try {
        results[pubId] = await fetchCrossRefCount(doi);
      } catch (e) {
        console.warn(`CrossRef failed for ${pubId} (${doi}):`, e.message);
        results[pubId] = '?';
      }
    })
  );

  // Render each badge
  badges.forEach(el => {
    const count = results[el.dataset.pubId] ?? null;
    renderCiteBadge(el, count);
  });

  // Sum numeric counts for the stats bar total
  const numericCounts = Object.values(results).filter(v => typeof v === 'number');
  const total = numericCounts.reduce((a, b) => a + b, 0);

  const gsTotal = document.getElementById('gs-total');
  const gsHidx  = document.getElementById('gs-hindex');
  const gsI10   = document.getElementById('gs-i10');
  const gsTotR  = document.getElementById('gs-total-r');

  if (gsTotal) gsTotal.textContent = total;
  if (gsHidx)  gsHidx.innerHTML   = `<a href="${SCHOLAR_PROFILE}" target="_blank" rel="noopener" style="color:var(--accent);font-size:0.85rem;text-decoration:none;">View ↗</a>`;
  if (gsI10)   gsI10.innerHTML    = `<a href="${SCHOLAR_PROFILE}" target="_blank" rel="noopener" style="color:var(--accent);font-size:0.85rem;text-decoration:none;">View ↗</a>`;
  if (gsTotR)  gsTotR.innerHTML   = `<a href="${SCHOLAR_PROFILE}" target="_blank" rel="noopener" style="color:var(--accent);font-size:0.85rem;text-decoration:none;">View ↗</a>`;

  // Hide any old CORS warning
  const note = document.getElementById('scholar-refresh-note');
  if (note) note.style.display = 'none';

  // Cache total for home page hero (if both pages ever share state)
  window.__crossRefTotal = total;
}

// Run on publications page
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.cite-count[data-pub-id]')) {
    loadAllCitations();
  }
});

// =========== HERO TOTAL CITATIONS (Home page — CrossRef sum) ===========
document.addEventListener('DOMContentLoaded', function () {
  const heroCite = document.getElementById('hero-citations');
  if (!heroCite) return;

  heroCite.style.animation = 'pulse 1.2s ease-in-out infinite';
  heroCite.textContent = '…';

  const dois = Object.values(DOI_MAP).filter(Boolean);

  Promise.allSettled(dois.map(doi => fetchCrossRefCount(doi)))
    .then(results => {
      heroCite.style.animation = '';
      const total = results
        .filter(r => r.status === 'fulfilled' && typeof r.value === 'number')
        .reduce((sum, r) => sum + r.value, 0);

      if (total > 0) {
        animateCounter(heroCite, total, 2000);
      } else {
        heroCite.textContent = '—';
      }
    })
    .catch(() => {
      heroCite.style.animation = '';
      heroCite.textContent = '—';
    });
});

// =========== PAGE SIDEBAR SCROLL SPY ===========
document.addEventListener('DOMContentLoaded', function () {
  const sidebarLinks = document.querySelectorAll('.page-sidebar-nav a[href^="#"]');
  if (!sidebarLinks.length) return;

  sidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height')) + 24;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const sections = Array.from(sidebarLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(
          `.page-sidebar-nav a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
});
