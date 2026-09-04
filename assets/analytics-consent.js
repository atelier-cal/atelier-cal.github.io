(() => {
  'use strict';

  const measurementId = 'G-K4502PGZ0X';
  const storageKey = 'atelier_cal_analytics_consent_v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  const readChoice = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || !['granted', 'denied'].includes(saved.choice) || Date.now() - saved.at > lifetime) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return saved.choice;
    } catch (error) {
      return null;
    }
  };

  const saveChoice = (choice) => {
    try { localStorage.setItem(storageKey, JSON.stringify({ choice, at: Date.now() })); } catch (error) {}
  };

  const enableAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: true, anonymize_ip: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  };

  const disableAnalytics = () => {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  };

  const style = document.createElement('style');
  style.textContent = `
    .cal-consent{position:fixed;z-index:10020;left:16px;right:16px;bottom:16px;max-width:760px;margin:auto;padding:20px;border:1px solid rgba(213,171,91,.5);border-radius:16px;background:#141516;color:#fff;box-shadow:0 18px 55px rgba(0,0,0,.36);font:500 16px/1.5 Arial,sans-serif}
    .cal-consent[hidden]{display:none}.cal-consent strong{display:block;margin-bottom:6px;font-size:18px}.cal-consent p{margin:0;color:rgba(255,255,255,.78)}.cal-consent a{color:#e6bd6b}.cal-consent-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.cal-consent button{min-height:44px;padding:10px 18px;border:1px solid #d9ae5b;border-radius:999px;background:transparent;color:#fff;font:700 15px Arial,sans-serif;cursor:pointer}.cal-consent .cal-accept{background:#d9ae5b;color:#151515}.cal-cookie-manage{position:fixed;z-index:9990;left:12px;bottom:12px;padding:8px 12px;border:1px solid rgba(217,174,91,.65);border-radius:999px;background:#171819;color:#fff;font:700 13px Arial,sans-serif;cursor:pointer;box-shadow:0 8px 25px rgba(0,0,0,.2)}
    @media(max-width:600px){.cal-consent{left:10px;right:10px;bottom:10px;padding:17px}.cal-consent-actions{display:grid;grid-template-columns:1fr 1fr}.cal-consent button{padding-inline:10px}.cal-cookie-manage{bottom:78px}}
  `;
  document.head.appendChild(style);

  const banner = document.createElement('section');
  banner.className = 'cal-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Choix des cookies de mesure d’audience');
  banner.innerHTML = '<strong>Votre choix concernant les cookies</strong><p>Avec votre accord, Google Analytics nous aide à mesurer les visites et à améliorer le site. Vous pouvez accepter ou refuser sans conséquence sur votre navigation. <a href="/confidentialite.html">En savoir plus</a>.</p><div class="cal-consent-actions"><button type="button" class="cal-accept">Accepter</button><button type="button" class="cal-refuse">Refuser</button></div>';

  const manage = document.createElement('button');
  manage.type = 'button';
  manage.className = 'cal-cookie-manage';
  manage.textContent = 'Gérer les cookies';
  manage.hidden = true;

  const choose = (choice) => {
    saveChoice(choice);
    choice === 'granted' ? enableAnalytics() : disableAnalytics();
    banner.hidden = true;
    manage.hidden = false;
    window.dispatchEvent(new CustomEvent('atelier-cal-consent-set', { detail: { choice } }));
  };

  banner.querySelector('.cal-accept').addEventListener('click', () => choose('granted'));
  banner.querySelector('.cal-refuse').addEventListener('click', () => choose('denied'));
  manage.addEventListener('click', () => {
    banner.hidden = false;
    manage.hidden = true;
    banner.querySelector('.cal-accept').focus();
  });

  document.body.append(banner, manage);
  const choice = readChoice();
  if (choice) choose(choice);
})();
