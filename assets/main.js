// Bookshelf website – i18n + light scroll reveal. No external deps.
// JSON and assets resolve from this script's directory, so the same files
// work at https://fushenghuangfu-cpu.github.io/bookshelf-site/.
(function () {
  'use strict';

  var FALLBACK = 'en';
  var SUPPORTED = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'fr', 'de', 'es', 'pt-BR', 'ru', 'ar', 'he'];
  var RTL = ['ar', 'he'];
  var STORAGE_KEY = 'bs.lang';
  var scriptEl = document.currentScript;
  var siteRoot = new URL('../', (scriptEl && scriptEl.src) || location.href);

  function pickInitial() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    if (nav.indexOf('zh') === 0) {
      return /hant|tw|hk|mo/.test(nav) ? 'zh-Hant' : 'zh-Hans';
    }
    if (nav.indexOf('ja') === 0) return 'ja';
    if (nav.indexOf('ko') === 0) return 'ko';
    if (nav.indexOf('fr') === 0) return 'fr';
    if (nav.indexOf('de') === 0) return 'de';
    if (nav.indexOf('es') === 0) return 'es';
    if (nav.indexOf('pt') === 0) return 'pt-BR';
    if (nav.indexOf('ru') === 0) return 'ru';
    if (nav.indexOf('ar') === 0) return 'ar';
    if (nav.indexOf('he') === 0 || nav.indexOf('iw') === 0) return 'he';
    return FALLBACK;
  }

  function langURL(code) {
    return new URL('languages/' + code + '.json', siteRoot).href;
  }

  function loadJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('load ' + url);
      return r.json();
    });
  }

  function loadDict(code) {
    return loadJSON(langURL(FALLBACK)).then(function (base) {
      if (code === FALLBACK) return base;
      return loadJSON(langURL(code)).then(function (dict) {
        var merged = {};
        Object.keys(base).forEach(function (k) { merged[k] = base[k]; });
        Object.keys(dict).forEach(function (k) {
          if (dict[k]) merged[k] = dict[k];
        });
        merged['_html.lang'] = dict['_html.lang'] || code;
        return merged;
      }).catch(function () { return base; });
    });
  }

  function applyLang(dict) {
    var nodes = document.querySelectorAll('[data-i18n], [data-i18n-html]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var key = n.getAttribute('data-i18n') || n.getAttribute('data-i18n-html');
      if (!dict[key]) continue;
      if (n.hasAttribute('data-i18n-html')) {
        n.innerHTML = dict[key];
      } else {
        n.textContent = dict[key];
      }
    }
    var alts = document.querySelectorAll('[data-i18n-alt]');
    for (var j = 0; j < alts.length; j++) {
      var altEl = alts[j];
      var altKey = altEl.getAttribute('data-i18n-alt');
      if (altKey && dict[altKey]) altEl.setAttribute('alt', dict[altKey]);
    }
    var code = dict['_html.lang'] || 'en';
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.indexOf(code) >= 0 ? 'rtl' : 'ltr';
  }

  function refreshShots() {
    var section = document.querySelector('.screenshots');
    if (!section) return;
    var figs = section.querySelectorAll('figure');
    var any = false;
    for (var i = 0; i < figs.length; i++) {
      if (!figs[i].hidden) any = true;
    }
    section.hidden = !any;
  }

  // Keep the numeric suffix and extension; swap only the language prefix.
  // png and jpg (including jpeg) are both accepted. A missing localized file
  // falls back to the English src stored on data-template. The figure is
  // hidden only when that English file also fails.
  function shotSrc(template, lang) {
    return template.replace(/\/[a-zA-Z-]+-(\d+\.(?:png|jpe?g))$/i, '/' + lang + '-$1');
  }

  function wireShots(lang) {
    var imgs = document.querySelectorAll('.screenshots img');
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        if (!img.getAttribute('data-template')) {
          img.setAttribute('data-template', img.getAttribute('src'));
        }
        var template = img.getAttribute('data-template');
        var next = shotSrc(template, lang);
        var fig = img.closest ? img.closest('figure') : null;
        var token = (img._shotToken || 0) + 1;
        img._shotToken = token;

        function show() {
          if (img._shotToken !== token) return;
          if (fig) fig.hidden = false;
          refreshShots();
        }
        function hide() {
          if (img._shotToken !== token) return;
          if (fig) fig.hidden = true;
          refreshShots();
        }
        function commit(url) {
          if (img._shotToken !== token) return;
          img.onerror = function () {
            if (img._shotToken !== token) return;
            if (url !== template) attempt(template, false);
            else hide();
          };
          if (img.getAttribute('src') !== url) img.setAttribute('src', url);
          show();
        }
        function attempt(url, canFallback) {
          if (img._shotToken !== token) return;
          if (img.getAttribute('src') === url && img.complete && img.naturalWidth > 0) {
            show();
            return;
          }
          var probe = new Image();
          probe.onload = function () { commit(url); };
          probe.onerror = function () {
            if (img._shotToken !== token) return;
            if (canFallback && url !== template) attempt(template, false);
            else hide();
          };
          probe.src = url;
        }
        attempt(next, true);
      })(imgs[i]);
    }
  }

  function revealOnScroll() {
    if (!('IntersectionObserver' in window)) {
      var all = document.querySelectorAll('.reveal');
      for (var i = 0; i < all.length; i++) all[i].classList.add('is-visible');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  function boot() {
    var select = document.getElementById('lang');
    var lang = pickInitial();
    if (select) select.value = lang;
    wireShots(lang);

    loadDict(lang).then(function (dict) {
      applyLang(dict);
      wireShots(dict['_html.lang'] || lang);
    }).catch(function () {
      wireShots(lang);
    });

    if (select) {
      select.addEventListener('change', function () {
        var v = select.value;
        localStorage.setItem(STORAGE_KEY, v);
        loadDict(v).then(function (dict) {
          applyLang(dict);
          wireShots(dict['_html.lang'] || v);
        });
      });
    }

    revealOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
