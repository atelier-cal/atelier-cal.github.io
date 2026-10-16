(() => {
  'use strict';
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
})();
