(() => {
  'use strict';

  // Clickjacking defense (meta CSP cannot set frame-ancestors on GitHub Pages)
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; } catch (_) { document.documentElement.remove(); }
  }

  document.documentElement.classList.add('js');

  // Footer year (textContent only: no DOM-XSS sinks anywhere in this file)
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Scroll spy
  const spyLinks = [...document.querySelectorAll('a[data-spy]')];
  const byId = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        spyLinks.forEach((a) => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        const a = byId.get(en.target.id);
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  // Reveal on scroll
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

  // Copy email
  const btn = document.getElementById('copyBtn');
  const emailEl = document.getElementById('emailText');
  const status = document.getElementById('copyStatus');
  const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[A-Za-z]{2,}$/; // validate before copying
  btn.addEventListener('click', async () => {
    const email = emailEl.textContent.trim();
    if (!EMAIL_RE.test(email)) return;
    let ok = false;
    try { await navigator.clipboard.writeText(email); ok = true; }
    catch (_) {
      const r = document.createRange(); r.selectNodeContents(emailEl);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
    }
    const original = 'Copy email';
    btn.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C';
    status.textContent = ok ? 'Email copied to clipboard' : 'Copy failed, text selected';
    setTimeout(() => { btn.textContent = original; status.textContent = ''; }, 2000);
  });
})();
