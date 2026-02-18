/* ============================================================
   SILICON NEXUS PORTFOLIO — JavaScript Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initScrollProgress();
  initNav();
  initReveal();
  initTyping();
  initHeroCanvas();
  initOrbCanvas();
  initSkillBars();
  initCounters();
  initBackToTop();
  initMagnetic();
  initAnalytics();
});

/* ── Loader ────────────────────────────────────────────────── */
function initLoader() {
  const el = document.getElementById('loader');
  if (!el) return;
  const hide = () => { el.classList.add('hidden'); setTimeout(() => el.remove(), 600); };
  window.addEventListener('load', () => setTimeout(hide, 1800));
  setTimeout(hide, 3500);
}

/* ── Custom Cursor ─────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx - 3 + 'px';
    dot.style.top = my - 3 + 'px';
  });

  (function follow() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll('a, button, .glass-card, .mini-card, .chip-list span').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

/* ── Scroll Progress ───────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });
}

/* ── Navigation ────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('navbar');
  const burger = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        burger.classList.remove('active');
        links.classList.remove('open');
      })
    );
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 200;
    sections.forEach(s => {
      const link = nav.querySelector(`a[href="#${s.id}"]`);
      if (link) link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    });
  }, { passive: true });
}

/* ── Scroll Reveal ─────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Typing Effect ─────────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = ['Semiconductor Engineer', 'RF Engineer', 'TNSCST Funded Researcher', 'VLSI Designer'];
  let pi = 0, ci = 0, del = false, spd = 70;

  (function type() {
    const cur = phrases[pi];
    if (del) { el.textContent = cur.substring(0, --ci); spd = 35; }
    else { el.textContent = cur.substring(0, ++ci); spd = 70; }

    if (!del && ci === cur.length) { spd = 2200; del = true; }
    else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; spd = 400; }

    setTimeout(type, spd);
  })();
}

/* ── Hero Particle Canvas ──────────────────────────────────── */
function initHeroCanvas() {
  const c = document.getElementById('heroCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');

  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 2, a: 0.12 + Math.random() * 0.2
    });
  }

  let mx = -999, my = -999;
  c.parentElement.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = c.width;
      if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height;
      if (p.y > c.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,102,255,${p.a})`;
      ctx.fill();
    }

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,102,255,${0.05 * (1 - d / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Mouse attraction
    if (mx > 0) {
      for (const p of particles) {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          p.vx += dx * 0.0001; p.vy += dy * 0.0001;
          p.vx *= 0.99; p.vy *= 0.99;
        }
      }
    }

    requestAnimationFrame(draw);
  })();
}

/* ── Profile Orb Canvas ────────────────────────────────────── */
function initOrbCanvas() {
  const c = document.getElementById('orbCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');

  const size = 500;
  const dpr = window.devicePixelRatio || 1;
  c.width = size * dpr; c.height = size * dpr;
  c.style.width = size + 'px'; c.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2;

  const orbs = Array.from({ length: 24 }, (_, i) => ({
    angle: (Math.PI * 2 * i) / 24 + Math.random() * 0.5,
    radius: 140 + Math.random() * 50,
    speed: (0.003 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.3 + Math.random() * 0.5,
    hue: [210, 165, 260][Math.floor(Math.random() * 3)],
    trail: [], trailLen: 5 + Math.floor(Math.random() * 7)
  }));

  const pulses = [];
  let pt = 0;

  (function animate() {
    ctx.clearRect(0, 0, size, size);

    // Pulses
    pt++;
    if (pt % 90 === 0) pulses.push({ r: 125, o: 0.25, h: [210, 165, 260][Math.floor(Math.random() * 3)] });
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.r += 0.5; p.o -= 0.003;
      if (p.o <= 0) { pulses.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${p.h},80%,60%,${p.o})`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Orbiters
    for (const o of orbs) {
      o.angle += o.speed;
      const x = cx + Math.cos(o.angle) * o.radius;
      const y = cy + Math.sin(o.angle) * o.radius;
      o.trail.push({ x, y });
      if (o.trail.length > o.trailLen) o.trail.shift();

      for (let t = 0; t < o.trail.length; t++) {
        const tp = o.trail[t];
        const a = (t / o.trail.length) * o.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, o.size * (t / o.trail.length) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${o.hue},80%,65%,${a})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(x, y, o.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${o.hue},85%,65%,${o.opacity})`;
      ctx.shadowBlur = 8; ctx.shadowColor = `hsla(${o.hue},85%,65%,0.4)`;
      ctx.fill(); ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  })();
}

/* ── Skill Bars ────────────────────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
}

/* ── Counters ──────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = target % 1 !== 0;
      const start = performance.now();
      const dur = 1500;

      (function update(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = isFloat ? (target * eased).toFixed(1) : Math.round(target * eased);
        if (p < 1) requestAnimationFrame(update);
      })(start);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

/* ── Back to Top ───────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 600), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Magnetic ──────────────────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ── Contact Form ──────────────────────────────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const origText = btn.textContent;

  // Disable button and show loading state
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  const formData = {
    name: form.querySelector('#name').value,
    email: form.querySelector('#email').value,
    subject: form.querySelector('#subject').value,
    message: form.querySelector('#message').value
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      btn.textContent = '✓ Sent!';
      form.reset();
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
      }, 3000);
    } else {
      throw new Error(result.error || 'Failed to send');
    }
  } catch (error) {
    console.error('Contact error:', error);
    btn.textContent = '❌ Error';
    alert(`Failed to send message: ${error.message}`);
    setTimeout(() => {
      btn.textContent = origText;
      btn.disabled = false;
    }, 3000);
  }
}

/* ── Analytics ─────────────────────────────────────────────── */
function initAnalytics() {
  // Track page view on load
  if (window.location.hostname !== 'localhost') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer
      })
    }).catch(err => console.error('Analytics error:', err));
  }
}



