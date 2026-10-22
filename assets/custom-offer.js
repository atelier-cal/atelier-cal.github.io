(() => {
  'use strict';
  const select = document.getElementById('custom-modele');
  if (!select) return;
  const requested = new URLSearchParams(location.search).get('modele');
  // Existing Pearl campaign links still lead to the corresponding machine.
  if (requested === 'perle') {
    location.replace(new URL('machine.html?modele=perle#devis', location.href));
    return;
  }
  const models = {
    abeille: 'Signature Abeille',
    feuille: 'Signature Feuille',
    collection: 'Nouvelle Collection',
    surmesure: 'Forme sur mesure'
  };
  if (Object.hasOwn(models, requested)) select.value = models[requested];
})();
