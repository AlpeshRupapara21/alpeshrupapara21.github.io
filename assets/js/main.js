/* Alpesh Rupapara — portfolio interactions. Zero dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Sticky nav border --- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile nav toggle --- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Scroll reveal with stagger --- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var show = function (el, stagger) {
      if (el.classList.contains('is-in')) return;
      if (stagger) {
        var siblings = Array.prototype.slice.call(
          el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : []
        );
        el.style.setProperty('--d', Math.min(Math.max(0, siblings.indexOf(el)) * 60, 300) + 'ms');
      }
      el.classList.add('is-in');
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target, true);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });

    /* Safety net: a fast fling, an anchor jump or a restored scroll position can
       outrun IntersectionObserver and strand an element at opacity 0 forever.
       Sweep anything at or above the fold and reveal it unconditionally. */
    var sweep = function () {
      var h = window.innerHeight;
      revealables.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < h * 0.95) { show(el, false); io.unobserve(el); }
      });
    };
    var ticking = false;
    var onMove = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { sweep(); ticking = false; });
    };
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', onMove, { passive: true });
    window.addEventListener('load', sweep);
    setTimeout(sweep, 400);
  }

  /* --- Capability bars fill when visible --- */
  var bars = document.querySelectorAll('.cap__fill');
  if (bars.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      bars.forEach(function (b) { b.style.width = (b.dataset.level || 0) + '%'; });
    } else {
      var barIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var b = entry.target;
          window.setTimeout(function () {
            b.style.width = (b.dataset.level || 0) + '%';
          }, 120);
          barIO.unobserve(b);
        });
      }, { threshold: 0.4 });
      bars.forEach(function (b) { barIO.observe(b); });
    }
  }

  /* --- Count-up for readout values --- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduced && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.dataset.count);
        var prefix = el.dataset.prefix || '';
        var suffix = el.dataset.suffix || '';
        var decimals = parseInt(el.dataset.decimals || '0', 10);
        var start = performance.now();
        var dur = 1100;

        var tick = function (now) {
          var p = Math.min((now - start) / dur, 1);
          if (p >= 1) {
            el.textContent = prefix + target.toFixed(decimals) + suffix;  // land exactly
            return;
          }
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* --- Current year --- */
  var y = document.querySelectorAll('[data-year]');
  y.forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
