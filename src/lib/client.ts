/** Small client runtime: reveal animations, theme toggle, privacy-friendly event tracking. */

// Reveal on scroll
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io?.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' })
  : null;
document.querySelectorAll('.reveal, [data-inview]').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

// Event tracking: WhatsApp clicks and other data-track elements.
export function track(event: string, props: Record<string, unknown> = {}) {
  // Same event to Google Analytics, when it is on the page (see SITE.gaMeasurementId).
  try { (window as any).gtag?.('event', event, props); } catch {}
  // And to Microsoft Clarity, so recordings can be filtered by event (see SITE.clarityProjectId).
  try { (window as any).clarity?.('event', event); } catch {}
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
