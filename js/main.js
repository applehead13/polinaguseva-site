(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Плавающая шапка + название текущего раздела ---------- */
  var bar = $('#bar');
  var barWhere = $('#barWhere');
  var barNum = $('#barNum');
  var hero = $('#top');
  var sections = $$('[data-section]');

  function onScroll() {
    var heroBottom = hero.offsetTop + hero.offsetHeight * 0.55;
    var on = window.scrollY > heroBottom;
    bar.classList.toggle('is-on', on);
    bar.setAttribute('aria-hidden', on ? 'false' : 'true');
    $$('a,button', bar).forEach(function (el) { el.tabIndex = on ? 0 : -1; });

    var probe = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= probe) current = s; });
    barWhere.textContent = current.getAttribute('data-section');
    barNum.textContent = '[' + current.getAttribute('data-num') + ']';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Меню ---------- */
  var menu = $('#menu');
  var lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = $('.menu__nav a', menu);
    if (first) first.focus();
  }
  function closeMenu() {
    menu.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-menu-open]').forEach(function (b) { b.addEventListener('click', openMenu); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });

  /* ---------- Услуги: раскрытие строки ---------- */
  $$('.row__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = btn.parentNode;
      var open = !row.classList.contains('is-open');
      row.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Вопросы: переворот карточки (тап на сенсорных экранах) ---------- */
  $$('.card__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
  });

  /* ---------- Принципы: перетаскивание мышью ---------- */
  var track = $('.principles__track');
  if (track) {
    var down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) { moved = true; track.classList.add('is-drag'); }
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      down = false; track.classList.remove('is-drag');
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') track.scrollBy({ left: 320, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  /* ---------- Видео: играют только в зоне видимости ---------- */
  var vids = $$('video[data-autoplay]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (vids.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: '120px', threshold: 0.15 });
    vids.forEach(function (v) { io.observe(v); });
  }
})();
