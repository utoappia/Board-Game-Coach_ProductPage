/*
 * Board Game Coach — product site renderer. No build step: every page is a
 * small HTML shell (<body data-page="home|game|privacy|support" data-root="../"
 * [data-game="go"]>) and this script fills it from SITE (content.js).
 *
 * Language: ?lang=<code> wins (and is carried along on internal links);
 * otherwise the browser's languages; otherwise English.
 */
(function () {
  'use strict';

  var LANGS = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko'];
  var body = document.body;
  var root = body.getAttribute('data-root') || '';
  var page = body.getAttribute('data-page');

  // ---- Language -----------------------------------------------------------
  function normalize(tag) {
    if (!tag) return null;
    var t = String(tag).toLowerCase();
    if (t === 'en' || t.indexOf('en-') === 0) return 'en';
    if (t === 'ja' || t.indexOf('ja-') === 0) return 'ja';
    if (t === 'ko' || t.indexOf('ko-') === 0) return 'ko';
    if (t.indexOf('zh') === 0) {
      if (/hant|-tw|-hk|-mo/.test(t)) return 'zh-Hant';
      return 'zh-Hans';
    }
    return null;
  }
  var params = new URLSearchParams(location.search);
  var forced = null;
  if (params.has('lang')) {
    var raw = params.get('lang');
    forced = LANGS.indexOf(raw) >= 0 ? raw : normalize(raw);
  }
  var lang = forced;
  if (!lang) {
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < prefs.length && !lang; i++) lang = normalize(prefs[i]);
  }
  if (!lang) lang = 'en';
  document.documentElement.lang = lang;

  var S = window.SITE;
  function tr(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] != null ? obj[lang] : obj.en;
  }
  var ui = function (key) { return tr(S.ui[key]); };

  /** An internal link, keeping ?lang= when the reader chose a language. */
  function href(path) {
    var url = root + path;
    return forced ? url + (url.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + encodeURIComponent(forced) : url;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content;
  }

  // ---- Pieces -------------------------------------------------------------
  function icon(game, big) {
    var cls = 'icon' + (big ? ' big' : '');
    if (game.tile) return '<span class="' + cls + ' tile ' + game.id + (big ? ' big' : '') + '" aria-hidden="true">' + game.tile + '</span>';
    return '<img class="' + cls + '" src="' + root + 'assets/icons/' + game.id + '.png" alt="" width="64" height="64">';
  }
  var APPLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.52-.71 2.85-.71s1.7.71 2.87.69c1.18-.02 1.93-1.08 2.66-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.29-3.54zM14.18 6.11c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.68.97.07 1.96-.49 2.56-1.23z"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 2.2c-.2.2-.3.6-.3 1v17.6c0 .4.1.8.3 1l9.8-9.8L3.6 2.2zm11.2 11.2 2.9 2.9-11.8 6.7 8.9-9.6zm0-2.8L5.9 1l11.8 6.7-2.9 2.9zm4.9 2.8-2.5 1.4-3.1-3.1 3.1-3.1 2.5 1.4c.7.4.7 1 0 1.4z"/></svg>';

  function header() {
    var nav = [
      ['index.html', ui('navGames'), 'home'],
      ['support/', ui('navSupport'), 'support'],
      ['privacy/', ui('navPrivacy'), 'privacy'],
    ];
    var links = nav.map(function (n) {
      return '<a href="' + href(n[0]) + '"' + (page === n[2] ? ' aria-current="page"' : '') + '>' + esc(n[1]) + '</a>';
    }).join('');
    var options = LANGS.map(function (l) {
      return '<option value="' + l + '"' + (l === lang ? ' selected' : '') + '>' + esc(S.langNames[l]) + '</option>';
    }).join('');
    return '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="' + href('index.html') + '"><img src="' + root + 'assets/owl.png" alt="">' + esc(ui('brand')) + '</a>' +
      '<nav class="nav" aria-label="' + esc(ui('brand')) + '">' + links +
      '<select class="lang" aria-label="' + esc(ui('language')) + '">' + options + '</select></nav>' +
      '</div></header>';
  }

  function footer() {
    return '<footer class="site-footer"><div class="wrap">' +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(ui('brand')) + '</span>' +
      '<nav><a href="' + href('support/') + '">' + esc(ui('navSupport')) + '</a>' +
      '<a href="' + href('privacy/') + '">' + esc(ui('navPrivacy')) + '</a>' +
      '<a href="mailto:' + S.email + '">' + S.email + '</a>' +
      '<a href="' + S.facebook + '" rel="noopener">Facebook</a></nav>' +
      '</div></footer>';
  }

  function gameCard(game) {
    var badge = game.appStore || game.playStore
      ? '<span class="badge live">' + esc(ui('available')) + '</span>'
      : '<span class="badge soon">' + esc(ui('comingSoon')) + '</span>';
    return '<a class="game-card" href="' + href(game.id + '/') + '">' + icon(game, false) +
      '<div><h3>' + esc(tr(game.name)) + '</h3><p>' + esc(tr(game.tagline)) + '</p>' + badge + '</div></a>';
  }

  // ---- Pages ----------------------------------------------------------------
  function home() {
    document.title = ui('brand') + ' — ' + ui('heroTitle');
    return '<main class="wrap">' +
      '<section class="hero"><img src="' + root + 'assets/owl.png" alt="">' +
      '<h1>' + esc(ui('heroTitle')) + '</h1><p>' + esc(ui('heroText')) + '</p></section>' +
      '<h2 class="section-title">' + esc(ui('gamesTitle')) + '</h2>' +
      '<div class="grid">' + S.games.map(gameCard).join('') + '</div>' +
      '<section class="card"><h2>' + esc(ui('whyTitle')) + '</h2><ul class="bullets">' +
      S.benefits.map(function (b) { return '<li>' + esc(tr(b)) + '</li>'; }).join('') +
      '</ul></section></main>';
  }

  function game() {
    var id = body.getAttribute('data-game');
    var g = S.games.filter(function (x) { return x.id === id; })[0];
    if (!g) return '<main class="wrap"><p>Not found.</p></main>';
    document.title = tr(g.name) + ' — ' + ui('brand');
    var stores = '';
    if (g.appStore || g.playStore) {
      stores = '<div class="stores">' +
        (g.appStore ? '<a class="store-btn" href="' + g.appStore + '" rel="noopener">' + APPLE + esc(ui('appStore')) + '</a>' : '') +
        (g.playStore ? '<a class="store-btn" href="' + g.playStore + '" rel="noopener">' + PLAY + esc(ui('googlePlay')) + '</a>' : '') +
        '</div>';
    } else {
      stores = '<p class="soon-note">' + esc(ui('comingSoonLong')) + '</p>';
    }
    return '<main class="wrap">' +
      '<section class="game-hero">' + icon(g, true) +
      '<div><h1>' + esc(tr(g.name)) + '</h1><p>' + esc(tr(g.tagline)) + '</p>' + stores + '</div></section>' +
      '<section class="card prose"><h2>' + esc(ui('aboutGame').replace('{name}', tr(g.name))) + '</h2><p>' + esc(tr(g.about)) + '</p></section>' +
      '<section class="card"><h2>' + esc(ui('whyTitle')) + '</h2><ul class="bullets">' +
      S.benefits.map(function (b) { return '<li>' + esc(tr(b)) + '</li>'; }).join('') +
      '</ul></section>' +
      '<p><a href="' + href('index.html') + '">← ' + esc(ui('allGames')) + '</a></p></main>';
  }

  /** Privacy / support: sections of { h, p: [paragraphs], list?: [items] } per language. */
  function prose(doc) {
    document.title = tr(doc.title) + ' — ' + ui('brand');
    var sections = tr(doc.sections).map(function (s) {
      return (s.h ? '<h2>' + esc(s.h) + '</h2>' : '') +
        (s.p || []).map(function (p) { return '<p>' + linkify(esc(p)) + '</p>'; }).join('') +
        (s.list ? '<ul class="bullets">' + s.list.map(function (li) { return '<li>' + linkify(esc(li)) + '</li>'; }).join('') + '</ul>' : '') +
        (s.link ? '<p><a href="' + href(s.link) + '">' + esc(ui(s.link === 'privacy/' ? 'navPrivacy' : 'navSupport')) + ' →</a></p>' : '');
    }).join('');
    return '<main class="wrap"><section class="hero" style="padding-bottom:8px"><h1>' + esc(tr(doc.title)) + '</h1>' +
      (doc.updated ? '<p class="meta">' + esc(ui('updated')) + ' ' + esc(tr(doc.updated)) + '</p>' : '') +
      '</section><article class="card prose">' + sections + '</article></main>';
  }
  /** Email addresses and https links in already-escaped text become links. */
  function linkify(s) {
    return s
      .replace(/(https:\/\/[^\s<]+[^\s<.,;:)）。、])/g, function (url) {
        return '<a href="' + url + '" rel="noopener">' + (url.indexOf('facebook.com') >= 0 ? 'Facebook' : url) + '</a>';
      })
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+\w)/g, '<a href="mailto:$1">$1</a>');
  }

  var main = page === 'home' ? home() : page === 'game' ? game() : page === 'privacy' ? prose(S.privacy) : page === 'support' ? prose(S.support) : '';
  body.innerHTML = '';
  body.appendChild(el(header() + main + footer()));

  var select = document.querySelector('.lang');
  if (select) {
    select.addEventListener('change', function () {
      var p = new URLSearchParams(location.search);
      p.set('lang', select.value);
      location.search = p.toString();
    });
  }
})();
