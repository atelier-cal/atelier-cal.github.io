/* Fixed campaign dates in Paris summer time; never reset for a visitor. */
(() => {
  'use strict';
  const end = Date.parse('2026-10-20T00:00:00+02:00');
  const lastDay = Date.parse('2026-10-19T00:00:00+02:00');
  const read = (now = Date.now()) => {
    const seconds = Math.max(0, Math.ceil((end - now) / 1000));
    return {
      phase: now >= end ? 'expired' : now >= lastDay ? 'last-day' : 'running',
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60
    };
  };
  const clock = Object.freeze({end, lastDay, read});
  if (typeof module !== 'undefined' && module.exports) module.exports = clock;
  else globalThis.CalOfferClock = clock;
})();
