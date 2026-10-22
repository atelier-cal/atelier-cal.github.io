(() => {
  'use strict';
  const select = document.getElementById('modele');
  if (!select || !select.form) return;
  const form = select.form;
  const source = form.querySelector('input[name="source"]');
  const note = document.querySelector('[data-budget-selection]');
  if (!source || !note) return;
  const originalSource = source.value;
  if (new URLSearchParams(location.search).get('modele') === 'perle') {
    select.value = 'Bronze Perle 15 mm';
  }
  const update = () => {
    const pearl = select.value === 'Bronze Perle 15 mm';
    const expired = globalThis.CalOfferClock?.read().phase === 'expired';
    note.hidden = !pearl || expired;
    source.value = !pearl ? originalSource : expired
      ? 'Demande de tarif actuel - Bronze Perle 15 mm'
      : 'Offre petit budget - Bronze Perle 15 mm - 2590 EUR HT';
  };
  select.addEventListener('change', update);
  form.addEventListener('submit', update);
  window.addEventListener('pageshow', update);
  document.addEventListener('visibilitychange', update);
  update();
})();
