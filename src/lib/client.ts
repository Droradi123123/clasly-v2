/** Small client runtime: reveal animations, theme toggle, privacy-friendly event tracking. */

// Reveal on scroll
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io?.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' })
  : null;
document.querySelectorAll('.reveal, [data-inview]').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

// Theme toggle
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
    btn.setAttribute('aria-pressed', String(next === 'light'));
  });
});

// Event tracking: WhatsApp clicks and other data-track elements.
export function track(event: string, props: Record<string, unknown> = {}) {
  const body = JSON.stringify({ event, page: location.pathname, referrer: document.referrer || null, ...props });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
    else fetch('/api/event', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true });
  } catch {}
}
document.addEventListener('click', (ev) => {
  const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (!el) return;
  track(el.dataset.track!, { label: el.dataset.trackLabel ?? null });
});
(window as any).__track = track;
