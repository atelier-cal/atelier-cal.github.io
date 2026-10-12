(() => {
  'use strict';
  const dialog = document.getElementById('cal-promo-dialog');
  const clock = globalThis.CalOfferClock;
  let tick;
  let lastPhase;
  const updateCampaign = () => {
    if (!clock) return;
    const state = clock.read();
    const expired = state.phase === 'expired';
    document.querySelectorAll('[data-cal-countdown]').forEach(counter => {
      counter.hidden = expired;
      counter.querySelectorAll('[data-clock-part]').forEach(part => {
        const value = String(state[part.dataset.clockPart]).padStart(2, '0');
        if (part.textContent !== value) part.textContent = value;
      });
    });
    if (state.phase !== lastPhase) {
      if (state.phase === 'last-day') {
        document.querySelectorAll('[data-cal-offer-headline]').forEach(heading => {
          heading.textContent = heading.dataset.lastDay;
        });
      }
      if (expired) {
        document.querySelectorAll('[data-cal-expired-copy]').forEach(el => {
          el.textContent = el.dataset.calExpiredCopy;
        });
        document.querySelectorAll('[data-cal-offer-active]').forEach(el => { el.hidden = true; });
        document.querySelectorAll('[data-cal-offer-expired]').forEach(el => { el.hidden = false; });
        document.querySelectorAll('[data-cal-budget-form] input[name="source"]').forEach(input => {
          input.value = 'Demande de tarif actuel - Bronze Perle 15 mm - offre terminee';
        });
        if (dialog?.open) dialog.close();
        document.documentElement.classList.remove('cal-promo-open');
        clearInterval(tick);
      }
      lastPhase = state.phase;
    }
  };
  const startClock = () => {
    clearInterval(tick);
    updateCampaign();
    if (clock && clock.read().phase !== 'expired') tick = setInterval(updateCampaign, 1000);
  };
  startClock();
  document.addEventListener('visibilitychange', updateCampaign);
  window.addEventListener('pageshow', startClock);
  window.addEventListener('pagehide', () => clearInterval(tick));
  document.querySelectorAll('[data-cal-budget-form]').forEach(form => {
    form.addEventListener('submit', updateCampaign);
  });
  const select = document.getElementById('offre-modele');
  const models = {perle:'Bronze Perle 15 mm'};
  if (select) {
    const requested = new URLSearchParams(location.search).get('modele');
    if (Object.hasOwn(models, requested)) select.value = models[requested];
    const unavailable = document.getElementById('cal-offer-unavailable');
    if (requested === 'pastille' && unavailable && clock?.read().phase !== 'expired') unavailable.hidden = false;
    document.querySelectorAll('[data-offer-model]').forEach(link => {
      link.addEventListener('click', () => {
        const chosen = link.dataset.offerModel;
        if (Object.hasOwn(models, chosen)) select.value = models[chosen];
      });
    });
  }
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const sessionKey = 'atelier-cal-perle-countdown-20261019';
  let shown = false;
  let timer;
  let previousFocus;
  const hasSeen = () => {
    try { return sessionStorage.getItem(sessionKey) === 'shown'; }
    catch (_) { return false; }
  };
  const isBusy = () => document.hidden ||
    document.querySelector('.cal-consent:not([hidden]), dialog[open], .viewer-overlay.open, details[open]') ||
    [...document.querySelectorAll('video')].some(video => !video.paused && !video.ended) ||
    document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
  const show = () => {
    if (shown || hasSeen() || clock?.read().phase === 'expired') return;
    if (isBusy()) { timer = setTimeout(show, 2000); return; }
    previousFocus = document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add('cal-promo-open');
    shown = true;
    try { sessionStorage.setItem(sessionKey, 'shown'); } catch (_) {}
    dialog.querySelector('[data-promo-close]').focus({preventScroll:true});
  };
  const close = () => dialog.close();
  dialog.querySelector('[data-promo-close]').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('cal-promo-open');
    if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({preventScroll:true});
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  if (!document.body.hasAttribute('data-offers-page') && !location.hash.includes('devis') && !hasSeen()) {
    timer = setTimeout(show, 5000);
  }
  window.addEventListener('pagehide', () => clearTimeout(timer));
})();
