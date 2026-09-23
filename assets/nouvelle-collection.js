(() => {
  'use strict';
  const carousel = document.querySelector('[data-collection]');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.collection-slide')];
  const thumbs = [...carousel.querySelectorAll('[data-slide]')];
  const strip = carousel.querySelector('.collection-thumbs');
  const stage = carousel.querySelector('.collection-stage');
  const play = carousel.querySelector('[data-play]');
  const status = carousel.querySelector('.collection-status');
  const count = carousel.querySelector('.collection-count');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let playing = !reduced.matches;
  let visible = false;
  let hovering = false;
  let timer;
  let pending = 0;
  let start = null;

  const stopTimer = () => window.clearTimeout(timer);
  const schedule = () => {
    stopTimer();
    if (playing && visible && !hovering && !document.hidden && !carousel.contains(document.activeElement)) {
      timer = window.setTimeout(() => show(current + 1), 5000);
    }
  };
  const updatePlay = () => {
    play.innerHTML = playing ? 'Pause <span aria-hidden="true">Ⅱ</span>' : 'Lecture <span aria-hidden="true">▶</span>';
    play.setAttribute('aria-label', playing ? 'Mettre le défilement en pause' : 'Lancer le défilement automatique');
    schedule();
  };
  const preloadNext = () => {
    const img = slides[(current + 1) % slides.length].querySelector('img');
    img.loading = 'eager';
  };
  async function show(index, manual = false) {
    const target = (index + slides.length) % slides.length;
    const request = ++pending;
    stopTimer();
    if (manual) { playing = false; updatePlay(); }
    const img = slides[target].querySelector('img');
    img.loading = 'eager';
    try { await img.decode(); }
    catch (_) {
      if (request !== pending) return;
      playing = false;
      updatePlay();
      status.textContent = 'Ce visuel ne peut pas être chargé. Vous pouvez choisir une autre miniature.';
      return;
    }
    if (request !== pending) return;
    slides[current].hidden = true;
    thumbs[current].setAttribute('aria-pressed', 'false');
    current = target;
    slides[current].hidden = false;
    thumbs[current].setAttribute('aria-pressed', 'true');
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
    const thumb = thumbs[current];
    const left = thumb.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft || left + thumb.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({left: left - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: 'instant'});
    }
    if (manual) status.textContent = `${current + 1} sur ${slides.length} : ${slides[current].querySelector('strong').textContent}`;
    preloadNext();
    schedule();
  }

  carousel.querySelector('[data-prev]').addEventListener('click', () => show(current - 1, true));
  carousel.querySelector('[data-next]').addEventListener('click', () => show(current + 1, true));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index, true)));
  play.addEventListener('click', () => { playing = !playing; updatePlay(); });
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  stage.addEventListener('dragstart', event => event.preventDefault());
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    start = {x: event.clientX, y: event.clientY};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1), true);
  });
  stage.addEventListener('pointercancel', () => { start = null; });
  carousel.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; stopTimer(); } });
  carousel.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovering = false; schedule(); } });
  carousel.addEventListener('focusin', stopTimer);
  carousel.addEventListener('focusout', () => window.setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { if (reduced.matches) { playing = false; updatePlay(); } });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) preloadNext();
    schedule();
  }, {threshold: 0.15}).observe(stage);

  carousel.querySelector('.collection-controls').hidden = false;
  strip.hidden = false;
  updatePlay();
})();
