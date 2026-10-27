(() => {
  'use strict';
  const select = document.getElementById('custom-modele');
  const requested = new URLSearchParams(location.search).get('modele');
  if (!select) {
    const machine = document.getElementById('modele');
    if (!machine) return;
    const option = [...machine.options].find(item => item.dataset.quoteModel === requested);
    if (option) {
      machine.value = option.value;
      machine.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return;
  }
  // Old campaign links for other shapes now lead to a regular quote request.
  if (['perle', 'feuille', 'collection', 'surmesure'].includes(requested)) {
    location.replace(new URL('machine.html?modele=' + requested + '#devis', location.href));
    return;
  }
  select.value = 'Signature Abeille';
})();
