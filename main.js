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


// =========== GOOGLE SCHOLAR CITATIONS ===========
// Fetches live citation data from Google Scholar via a CORS proxy.
// Profile: https://scholar.google.com/citations?user=f1HR6ucAAAAJ&hl=en
// Per-paper citations are matched by paper title from the profile page.
// Falls back to CrossRef API for papers not listed on the Scholar profile.
// Displays total citations, h-index, and i10-index in the pub-stats bar.

const SCHOLAR_USER = 'f1HR6ucAAAAJ';
const SCHOLAR_URL  = `https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en&sortby=pubdate&pagesize=100`;
const PROXY_BASE   = 'https://api.allorigins.win/get?url=';

// Mapping: pub-card element id → partial title keywords (lowercase)
// Used to match Scholar paper entries to our cards
const titleKeywordMap = {
  'pub-j1': ['secure iiot', 'active and reactive load forecasting', 'anomaly detection'],
  'pub-j2': ['environmental monitoring', 'power forecasting', 'comparative analysis'],
  'pub-j3': ['battery state of charge', 'soc estimation', 'rnn-cnn'],
  'pub-j4': ['optical camera communication', 'positioning information'],
  'pub-j5': ['arbgtu', 'nilm', 'load disaggregation'],
  'pub-j6': ['state of health', 'remaining useful life', 'ev batteries', 'systematic review'],
  'pub-j7': ['hybrid uav', 'dqn', 'energy management'],
  'pub-j8': ['ofdm', 'occ', 'unet', 'ber optimization'],
  'pub-j9': ['vlc', 'comprehensive survey', 'machine learning'],
  'pub-c1': ['smart microgrid', 'smart energy monitoring', 'management', 'protection'],
  'pub-c2': ['smart home', 'smart energy metering', 'iccit'],
  'pub-c3': ['smart control', 'protection system', 'home appliances'],
  'pub-c4': ['smart home automation', 'nodemcu', 'multiplug'],
  'pub-c5': ['cnn-rnn', 'load forecasting', 'comparative analysis', 'jcci'],
};

// Known fallback citation counts (manually verified from Google Scholar, March 2025)
// Update these when you refresh
const fallbackCitations = {
  'pub-j1': 38, // Sensors 2024 - Secure IIoT
  'pub-j2': 17,  // Applied Sciences 2024
  'pub-j3': 20,  // World EV Journal 2024
  'pub-j4': 7, // IEEE Access 2024
  'pub-j5': 0,  // Under review
  'pub-j6': 25, // ICT Express 2025 - SoH review
  'pub-j7': 0,  // Under review
  'pub-j8': 12,  // ICT Express 2025 - OFDM
  'pub-j9': 13,  // IEEE OJCOMS 2025
  'pub-c1': 13, // ICPC2T 2024 - Best Paper
  'pub-c2': 7,  // ICCIT 2023
  'pub-c3': 16,  // ICCIT 2022
  'pub-c4': 15, // ICCIT 2021
  'pub-c5': 0,  // JCCI 2024
};

function stripTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function titleMatch(scholarTitle, keywordsArray) {
  const s = stripTitle(scholarTitle);
  return keywordsArray.some(kw => s.includes(kw.toLowerCase()));
}

async function loadGoogleScholarCitations() {
  // Show spinners on all cite badges
  document.querySelectorAll('.cite-count[data-pub-id]').forEach(el => {
    el.innerHTML = '<span style="display:inline-block;animation:spin 0.9s linear infinite">⟳</span> Loading…';
    el.classList.add('loading');
  });

  const statsTotal  = document.getElementById('gs-total');
  const statsHidx   = document.getElementById('gs-hindex');
  const statsI10    = document.getElementById('gs-i10');
  const statsTotalR = document.getElementById('gs-total-r'); // recent
  if (statsTotal) statsTotal.innerHTML = '<span style="animation:spin 0.9s linear infinite;display:inline-block">⟳</span>';

  let scholarData = null;

  try {
    const proxyUrl = PROXY_BASE + encodeURIComponent(SCHOLAR_URL);
    const res      = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('proxy error');
    const json     = await res.json();
    const html     = json.contents;
    scholarData    = parseScholarPage(html);
  } catch (e) {
    console.warn('Google Scholar proxy fetch failed, using fallback values:', e.message);
    applyFallbackCitations();
    return;
  }

  if (!scholarData) {
    applyFallbackCitations();
    return;
  }

  // Update profile stats
  if (statsTotal)  statsTotal.textContent  = scholarData.totalCitations  ?? '—';
  if (statsHidx)   statsHidx.textContent   = scholarData.hIndex          ?? '—';
  if (statsI10)    statsI10.textContent    = scholarData.i10Index         ?? '—';
  if (statsTotalR) statsTotalR.textContent = scholarData.totalCitationsSince2020 ?? '—';

  // Match per-paper citations
  const papers = scholarData.papers || [];

  document.querySelectorAll('.cite-count[data-pub-id]').forEach(el => {
    const pubId   = el.dataset.pubId;
    const keywords = titleKeywordMap[pubId];
    if (!keywords) { applyFallbackBadge(el, pubId); return; }

    // Find matching paper in Scholar data
    const match = papers.find(p => titleMatch(p.title, keywords));
    const count = match ? match.citations : (fallbackCitations[pubId] ?? '—');
    renderCiteBadge(el, count, pubId);
  });
}

function parseScholarPage(html) {
  try {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(html, 'text/html');

    // Profile stats
    const statCells = doc.querySelectorAll('#gsc_rsb_st td.gsc_rsb_std');
    const totalCitations = statCells[0] ? parseInt(statCells[0].textContent) : null;
    const totalCitationsSince2020 = statCells[1] ? parseInt(statCells[1].textContent) : null;
    const hIndex  = statCells[2] ? parseInt(statCells[2].textContent) : null;
    const i10Index = statCells[4] ? parseInt(statCells[4].textContent) : null;

    // Per-paper
    const papers = [];
    doc.querySelectorAll('.gsc_a_tr').forEach(row => {
      const titleEl = row.querySelector('.gsc_a_at');
      const citeEl  = row.querySelector('.gsc_a_c a');
      if (!titleEl) return;
      papers.push({
        title:     titleEl.textContent.trim(),
        citations: citeEl ? (parseInt(citeEl.textContent) || 0) : 0,
      });
    });

    return { totalCitations, totalCitationsSince2020, hIndex, i10Index, papers };
  } catch (e) {
    console.error('Scholar parse error', e);
    return null;
  }
}

function renderCiteBadge(el, count, pubId) {
  el.classList.remove('loading');
  const schUrl = `https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en`;
  if (typeof count === 'number') {
    el.innerHTML = `📊 Cited by <strong>${count}</strong> &nbsp;<a href="${schUrl}" target="_blank" rel="noopener" title="View on Google Scholar" style="font-size:0.72rem;color:var(--accent);">↗</a>`;
  } else {
    el.innerHTML = `📊 <a href="${schUrl}" target="_blank" rel="noopener">View on Scholar ↗</a>`;
  }
}

function applyFallbackBadge(el, pubId) {
  const count = fallbackCitations[pubId];
  renderCiteBadge(el, count ?? '—', pubId);
}

function applyFallbackCitations() {
  // Apply fallback per-paper counts
  document.querySelectorAll('.cite-count[data-pub-id]').forEach(el => {
    const pubId = el.dataset.pubId;
    applyFallbackBadge(el, pubId);
  });

  // Apply fallback profile stats (hardcoded as of last check)
  const statsTotal  = document.getElementById('gs-total');
  const statsHidx   = document.getElementById('gs-hindex');
  const statsI10    = document.getElementById('gs-i10');
  const statsTotalR = document.getElementById('gs-total-r');
  if (statsTotal)  statsTotal.textContent  = '—';
  if (statsHidx)   statsHidx.textContent   = '—';
  if (statsI10)    statsI10.textContent    = '—';
  if (statsTotalR) statsTotalR.textContent = '—';

  // Add a "Refresh" link
  const refreshEl = document.getElementById('scholar-refresh-note');
  if (refreshEl) {
    refreshEl.innerHTML = `⚠️ Could not auto-fetch from Google Scholar (CORS). <a href="https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en" target="_blank" rel="noopener">View live data ↗</a>`;
    refreshEl.style.display = 'block';
  }
}

// Run on publications page
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.cite-count[data-pub-id]')) {
    loadGoogleScholarCitations();
  }
});

// =========== PAGE SIDEBAR SCROLL SPY ===========
document.addEventListener('DOMContentLoaded', function () {
  const sidebarLinks = document.querySelectorAll('.page-sidebar-nav a[href^="#"]');
  if (!sidebarLinks.length) return;

  // Smooth scroll on click
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

  // Active link on scroll
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
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
});

// =========== HERO TOTAL CITATIONS (Home page) ===========
document.addEventListener('DOMContentLoaded', function () {
  const heroCite = document.getElementById('hero-citations');
  if (!heroCite) return;

  const SCHOLAR_USER = 'f1HR6ucAAAAJ';
  const url = 'https://scholar.google.com/citations?user=' + SCHOLAR_USER + '&hl=en&sortby=pubdate&pagesize=100';
  const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);

  // Pulse while loading
  heroCite.style.animation = 'pulse 1.2s ease-in-out infinite';
  heroCite.textContent = '…';

  fetch(proxy, { signal: AbortSignal.timeout(12000) })
    .then(r => r.ok ? r.json() : Promise.reject('fetch failed'))
    .then(json => {
      const doc = new DOMParser().parseFromString(json.contents, 'text/html');
      // Google Scholar stores all-time citations in the first gsc_rsb_std cell
      const cells = doc.querySelectorAll('#gsc_rsb_st td.gsc_rsb_std');
      const total = cells[0] ? parseInt(cells[0].textContent) : NaN;

      heroCite.style.animation = '';
      if (!isNaN(total)) {
        // Animate count-up to the real number
        animateCounter(heroCite, total, 2000);
      } else {
        heroCite.textContent = '—';
      }
    })
    .catch(() => {
      heroCite.style.animation = '';
      // Hardcoded fallback (verified March 2025)
      animateCounter(heroCite, 184, 2000);
    });
});
