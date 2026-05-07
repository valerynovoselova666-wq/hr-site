/* ==============================================================
 * STATIC BACKGROUND + SUBTLE MOUSE-FOLLOW RED GLOW
 * Минималистичный, контрастный, без шейдеров.
 * Чуть заметный красный блик за курсором (не резкий).
 * ============================================================== */

(function () {
  if (window.__bgShaderLoaded) return;
  window.__bgShaderLoaded = true;

  const css = `
    html { background:#000 !important; }
    body { background: transparent !important; position: relative; }

    #bg-static-root {
      position: fixed; inset: 0; z-index: -1;
      pointer-events: none; overflow: hidden;
      background: #000;
    }

    /* Editorial-сетка — +10% яркости */
    #bg-static-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
      background-size: clamp(64px, 7vw, 96px) clamp(64px, 7vw, 96px);
      mask-image: radial-gradient(ellipse at center, #000 30%, rgba(0,0,0,.55) 80%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, rgba(0,0,0,.55) 80%, transparent 100%);
    }

    /* Статичный красный свет в углах */
    #bg-static-edge {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 55% 40% at 0% 100%, rgba(215,58,58,.28) 0%, transparent 70%),
        radial-gradient(ellipse 50% 32% at 100% 0%, rgba(215,58,58,.16) 0%, transparent 70%);
    }

    /* Мышиный блик +30% (от прежнего значения) */
    #bg-mouse-glow {
      position: absolute;
      width: 880px; height: 880px;
      margin-left: -440px; margin-top: -440px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(215,58,58,.175) 0%, rgba(215,58,58,.091) 35%, transparent 65%);
      filter: blur(18px);
      will-change: transform, opacity;
      opacity: 0;
      transition: opacity .6s ease;
    }
    body.bg-glow-on #bg-mouse-glow { opacity: 1; }

    /* SVG-noise grain для зернистой плёнки (статичная) */
    .bg-noise-svg {
      position: absolute; inset: 0;
      opacity: .055;
      mix-blend-mode: overlay;
      pointer-events: none;
    }

    /* Корнер-лейблы (минимальные) */
    .bg-corner {
      position: absolute;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 10px;
      letter-spacing: .26em;
      text-transform: uppercase;
      color: rgba(255,255,255,.26);
      mix-blend-mode: screen;
      white-space: nowrap;
    }
    .bg-corner.tl { top: 14px;  left: 18px; }
    .bg-corner.br { bottom: 14px; right: 18px; }
    .bg-corner .pip {
      display:inline-block; width:5px; height:5px;
      background:#D73A3A; vertical-align:1px; margin-right:6px;
    }
    @media (max-width: 640px) {
      .bg-corner { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      #bg-mouse-glow { display: none; }
    }
  `;

  const style = document.createElement('style');
  style.id = 'bg-static-style';
  style.textContent = css;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'bg-static-root';
  root.innerHTML = `
    <div id="bg-static-edge"></div>
    <div id="bg-static-grid"></div>
    <div id="bg-mouse-glow"></div>
    <svg class="bg-noise-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <filter id="bg-noise-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#bg-noise-filter)"/>
    </svg>
    <div class="bg-corner tl"><span class="pip"></span>Мироненко · HR · 2026</div>
    <div class="bg-corner br">Москва · Россия</div>
  `;
  document.body.prepend(root);

  /* ---------- Mouse glow with smooth lerp ---------- */
  const reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const glow = document.getElementById('bg-mouse-glow');
  if (!glow) return;

  let curX = window.innerWidth / 2, curY = window.innerHeight / 2;
  let tgtX = curX, tgtY = curY;

  /* Включаем плавно после первого движения */
  let activated = false;
  function activate() {
    if (activated) return;
    activated = true;
    document.body.classList.add('bg-glow-on');
  }

  window.addEventListener('mousemove', (e) => {
    tgtX = e.clientX;
    tgtY = e.clientY;
    activate();
  }, { passive: true });

  /* Плавно гасим, если мышь не двигается долго */
  let idleTimer;
  window.addEventListener('mousemove', () => {
    document.body.classList.add('bg-glow-on');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.remove('bg-glow-on'), 1800);
  }, { passive: true });

  function tick() {
    /* Очень плавный lerp — блик ненавязчивый */
    curX += (tgtX - curX) * 0.045;
    curY += (tgtY - curY) * 0.045;
    glow.style.transform = `translate(${curX}px, ${curY}px) translateZ(0)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
/* polish.js — UX полировка: scroll-progress, magnetic, count-up,
 * reveal-маски, parallax, page-transitions, mobile menu, modal. */

(function () {
  if (window.__polishLoaded) return;
  window.__polishLoaded = true;

  const reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* === Scroll progress === */
  (() => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    function update() {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      const pct = Math.min(100, Math.max(0, (h.scrollTop / max) * 100));
      bar.style.setProperty('--scroll-pct', pct.toFixed(2) + '%');
    }
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* === Magnetic buttons === */
  (() => {
    if (reduced) return;
    document.querySelectorAll('[data-magnet]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnet) || 14;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = ((e.clientX - r.left - r.width / 2) / r.width) * strength;
        const dy = ((e.clientY - r.top - r.height / 2) / r.height) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  })();

  /* === Number count-up === */
  (() => {
    const els = document.querySelectorAll('.count-up');
    if (!els.length) return;

    function format(num, decimals, suffix, prefix) {
      const n = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
      const grouped = n.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return (prefix || '') + grouped + (suffix || '');
    }

    function animate(el) {
      const target = parseFloat(el.dataset.target);
      if (isNaN(target)) return;
      const dur = parseInt(el.dataset.dur || '1200', 10);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const suf = el.dataset.suffix || '';
      const pre = el.dataset.prefix || '';
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = format(target * eased, dec, suf, pre);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (reduced) {
      els.forEach((el) => {
        const target = parseFloat(el.dataset.target);
        const dec = parseInt(el.dataset.decimals || '0', 10);
        el.textContent = (el.dataset.prefix || '') +
          (dec > 0 ? target.toFixed(dec) : Math.round(target).toString())
          + (el.dataset.suffix || '');
      });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: .4 });
    els.forEach((el) => io.observe(el));
  })();

  /* === Reveal-маски === */
  (() => {
    const els = document.querySelectorAll('.mask-reveal');
    if (!els.length) return;
    if (reduced) { els.forEach((el) => el.classList.add('visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: .25 });
    els.forEach((el) => io.observe(el));
  })();

  /* === Parallax === */
  (() => {
    if (reduced) return;
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    function update() {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.12;
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${(-offset).toFixed(1)}px, 0)`;
      });
    }
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* === Page transitions fallback === */
  (() => {
    if (reduced) return;
    if ('startViewTransition' in document) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto:') || href.startsWith('tel:') ||
          a.target === '_blank' || a.hasAttribute('download')) return;
      e.preventDefault();
      document.documentElement.classList.add('pt-fade-out');
      setTimeout(() => { window.location.href = href; }, 280);
    });
  })();

  /* === Mobile menu === */
  (() => {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  })();

  /* === "Связаться" → smooth scroll к #contacts (или переход на index#contacts) === */
  document.querySelectorAll('[data-goto="contacts"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = document.getElementById('contacts');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      /* если #contacts нет — даём ссылке сработать (href="index.html#contacts") */
    });
  });

  /* === Modal === */
  window.openModal = function (id) {
    const m = document.getElementById(id || 'contactModal');
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeModal = function (id) {
    const m = document.getElementById(id || 'contactModal');
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-back.open').forEach((m) => {
        m.classList.remove('open'); document.body.style.overflow = '';
      });
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-back')) {
      e.target.classList.remove('open'); document.body.style.overflow = '';
    }
  });
})();
