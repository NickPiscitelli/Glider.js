/* jquery.scrollex v0.2.1 | (c) @ajlkn | github.com/ajlkn/jquery.scrollex | MIT licensed */
!function (t) { function e(t, e, n) { return "string" == typeof t && ("%" == t.slice(-1) ? t = parseInt(t.substring(0, t.length - 1)) / 100 * e : "vh" == t.slice(-2) ? t = parseInt(t.substring(0, t.length - 2)) / 100 * n : "px" == t.slice(-2) && (t = parseInt(t.substring(0, t.length - 2)))), t } var n = t(window), i = 1, o = {}; n.on("scroll", function () { var e = n.scrollTop(); t.map(o, function (t) { window.clearTimeout(t.timeoutId), t.timeoutId = window.setTimeout(function () { t.handler(e) }, t.options.delay) }) }).on("load", function () { n.trigger("scroll") }), jQuery.fn.scrollex = function (l) { var s = t(this); if (0 == this.length) return s; if (this.length > 1) { for (var r = 0; r < this.length; r++)t(this[r]).scrollex(l); return s } if (s.data("_scrollexId")) return s; var a, u, h, c, p; switch (a = i++ , u = jQuery.extend({ top: 0, bottom: 0, delay: 0, mode: "default", enter: null, leave: null, initialize: null, terminate: null, scroll: null }, l), u.mode) { case "top": h = function (t, e, n, i, o) { return t >= i && o >= t }; break; case "bottom": h = function (t, e, n, i, o) { return n >= i && o >= n }; break; case "middle": h = function (t, e, n, i, o) { return e >= i && o >= e }; break; case "top-only": h = function (t, e, n, i, o) { return i >= t && n >= i }; break; case "bottom-only": h = function (t, e, n, i, o) { return n >= o && o >= t }; break; default: case "default": h = function (t, e, n, i, o) { return n >= i && o >= t } }return c = function (t) { var i, o, l, s, r, a, u = this.state, h = !1, c = this.$element.offset(); i = n.height(), o = t + i / 2, l = t + i, s = this.$element.outerHeight(), r = c.top + e(this.options.top, s, i), a = c.top + s - e(this.options.bottom, s, i), h = this.test(t, o, l, r, a), h != u && (this.state = h, h ? this.options.enter && this.options.enter.apply(this.element) : this.options.leave && this.options.leave.apply(this.element)), this.options.scroll && this.options.scroll.apply(this.element, [(o - r) / (a - r)]) }, p = { id: a, options: u, test: h, handler: c, state: null, element: this, $element: s, timeoutId: null }, o[a] = p, s.data("_scrollexId", p.id), p.options.initialize && p.options.initialize.apply(this), s }, jQuery.fn.unscrollex = function () { var e = t(this); if (0 == this.length) return e; if (this.length > 1) { for (var n = 0; n < this.length; n++)t(this[n]).unscrollex(); return e } var i, l; return (i = e.data("_scrollexId")) ? (l = o[i], window.clearTimeout(l.timeoutId), delete o[i], e.removeData("_scrollexId"), l.options.terminate && l.options.terminate.apply(this), e) : e } }(jQuery);
/* jquery.scrolly v1.0.0-dev | (c) @ajlkn | MIT licensed */
(function (e) { function u(s, o) { var u, a, f; if ((u = e(s))[t] == 0) return n; a = u[i]()[r]; switch (o.anchor) { case "middle": f = a - (e(window).height() - u.outerHeight()) / 2; break; default: case r: f = Math.max(a, 0) }return typeof o[i] == "function" ? f -= o[i]() : f -= o[i], f } var t = "length", n = null, r = "top", i = "offset", s = "click.scrolly", o = e(window); e.fn.scrolly = function (i) { var o, a, f, l, c = e(this); if (this[t] == 0) return c; if (this[t] > 1) { for (o = 0; o < this[t]; o++)e(this[o]).scrolly(i); return c } l = n, f = c.attr("href"); if (f.charAt(0) != "#" || f[t] < 2) return c; a = jQuery.extend({ anchor: r, easing: "swing", offset: 0, parent: e("body,html"), pollOnce: !1, speed: 1e3 }, i), a.pollOnce && (l = u(f, a)), c.off(s).on(s, function (e) { var t = l !== n ? l : u(f, a); t !== n && (e.preventDefault(), a.parent.stop().animate({ scrollTop: t }, a.speed, a.easing)) }) } })(jQuery);
/* breakpoints.js v1.0 | @ajlkn | MIT licensed */
var breakpoints = function () { "use strict"; function e(e) { t.init(e) } var t = { list: null, media: {}, events: [], init: function (e) { t.list = e, window.addEventListener("resize", t.poll), window.addEventListener("orientationchange", t.poll), window.addEventListener("load", t.poll), window.addEventListener("fullscreenchange", t.poll) }, active: function (e) { var n, a, s, i, r, d, c; if (!(e in t.media)) { if (">=" == e.substr(0, 2) ? (a = "gte", n = e.substr(2)) : "<=" == e.substr(0, 2) ? (a = "lte", n = e.substr(2)) : ">" == e.substr(0, 1) ? (a = "gt", n = e.substr(1)) : "<" == e.substr(0, 1) ? (a = "lt", n = e.substr(1)) : "!" == e.substr(0, 1) ? (a = "not", n = e.substr(1)) : (a = "eq", n = e), n && n in t.list) if (i = t.list[n], Array.isArray(i)) { if (r = parseInt(i[0]), d = parseInt(i[1]), isNaN(r)) { if (isNaN(d)) return; c = i[1].substr(String(d).length) } else c = i[0].substr(String(r).length); if (isNaN(r)) switch (a) { case "gte": s = "screen"; break; case "lte": s = "screen and (max-width: " + d + c + ")"; break; case "gt": s = "screen and (min-width: " + (d + 1) + c + ")"; break; case "lt": s = "screen and (max-width: -1px)"; break; case "not": s = "screen and (min-width: " + (d + 1) + c + ")"; break; default: s = "screen and (max-width: " + d + c + ")" } else if (isNaN(d)) switch (a) { case "gte": s = "screen and (min-width: " + r + c + ")"; break; case "lte": s = "screen"; break; case "gt": s = "screen and (max-width: -1px)"; break; case "lt": s = "screen and (max-width: " + (r - 1) + c + ")"; break; case "not": s = "screen and (max-width: " + (r - 1) + c + ")"; break; default: s = "screen and (min-width: " + r + c + ")" } else switch (a) { case "gte": s = "screen and (min-width: " + r + c + ")"; break; case "lte": s = "screen and (max-width: " + d + c + ")"; break; case "gt": s = "screen and (min-width: " + (d + 1) + c + ")"; break; case "lt": s = "screen and (max-width: " + (r - 1) + c + ")"; break; case "not": s = "screen and (max-width: " + (r - 1) + c + "), screen and (min-width: " + (d + 1) + c + ")"; break; default: s = "screen and (min-width: " + r + c + ") and (max-width: " + d + c + ")" } } else s = "(" == i.charAt(0) ? "screen and " + i : i; t.media[e] = !!s && s } return t.media[e] !== !1 && window.matchMedia(t.media[e]).matches }, on: function (e, n) { t.events.push({ query: e, handler: n, state: !1 }), t.active(e) && n() }, poll: function () { var e, n; for (e = 0; e < t.events.length; e++)n = t.events[e], t.active(n.query) ? n.state || (n.state = !0, n.handler()) : n.state && (n.state = !1) } }; return e._ = t, e.on = function (e, n) { t.on(e, n) }, e.active = function (e) { return t.active(e) }, e }(); !function (e, t) { "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.breakpoints = t() }(this, function () { return breakpoints });
/* browser.js v1.0 | @ajlkn | MIT licensed */
var browser = function () { "use strict"; var e = { name: null, version: null, os: null, osVersion: null, touch: null, mobile: null, _canUse: null, canUse: function (n) { e._canUse || (e._canUse = document.createElement("div")); var o = e._canUse.style, r = n.charAt(0).toUpperCase() + n.slice(1); return n in o || "Moz" + r in o || "Webkit" + r in o || "O" + r in o || "ms" + r in o }, init: function () { var n, o, r, i, t = navigator.userAgent; for (n = "other", o = 0, r = [["firefox", /Firefox\/([0-9\.]+)/], ["bb", /BlackBerry.+Version\/([0-9\.]+)/], ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/], ["opera", /OPR\/([0-9\.]+)/], ["opera", /Opera\/([0-9\.]+)/], ["edge", /Edge\/([0-9\.]+)/], ["safari", /Version\/([0-9\.]+).+Safari/], ["chrome", /Chrome\/([0-9\.]+)/], ["ie", /MSIE ([0-9]+)/], ["ie", /Trident\/.+rv:([0-9]+)/]], i = 0; i < r.length; i++)if (t.match(r[i][1])) { n = r[i][0], o = parseFloat(RegExp.$1); break } for (e.name = n, e.version = o, n = "other", o = 0, r = [["ios", /([0-9_]+) like Mac OS X/, function (e) { return e.replace("_", ".").replace("_", "") }], ["ios", /CPU like Mac OS X/, function (e) { return 0 }], ["wp", /Windows Phone ([0-9\.]+)/, null], ["android", /Android ([0-9\.]+)/, null], ["mac", /Macintosh.+Mac OS X ([0-9_]+)/, function (e) { return e.replace("_", ".").replace("_", "") }], ["windows", /Windows NT ([0-9\.]+)/, null], ["bb", /BlackBerry.+Version\/([0-9\.]+)/, null], ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/, null], ["linux", /Linux/, null], ["bsd", /BSD/, null], ["unix", /X11/, null]], i = 0; i < r.length; i++)if (t.match(r[i][1])) { n = r[i][0], o = parseFloat(r[i][2] ? r[i][2](RegExp.$1) : RegExp.$1); break } e.os = n, e.osVersion = o, e.touch = "wp" == e.os ? navigator.msMaxTouchPoints > 0 : !!("ontouchstart" in window), e.mobile = "wp" == e.os || "android" == e.os || "ios" == e.os || "bb" == e.os } }; return e.init(), e }(); !function (e, n) { "function" == typeof define && define.amd ? define([], n) : "object" == typeof exports ? module.exports = n() : e.browser = n() }(this, function () { return browser });
/*
  Stellar by HTML5 UP
  html5up.net | @ajlkn
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
if (iOS){
  document.body.classList.add('ios')
}
var isAndroid = !!navigator.platform && /android/i.test(navigator.platform);
if(isAndroid) {
  document.body.classList.add('android')
}

// center arrows on load
document.addEventListener('glider-loaded',centerArrows);
document.addEventListener('glider-refresh',centerArrows);


document.addEventListener('glider-loaded', hideFFScrollBars);
document.addEventListener('glider-refresh', hideFFScrollBars);
function hideFFScrollBars(e){
  if(/firefox/i.test(navigator.userAgent)){
    if (window.innerWidth > 575 && e.target.id !== 'glider-persp'){
      e.target.parentNode.style.height = (e.target.offsetHeight - 17) + 'px'
    }
  }
}

(function ($) {

  var $window = $(window),
    $body = $('body'),
    $main = $('#main');

  // Breakpoints.
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: ['481px', '736px'],
    xsmall: ['361px', '480px'],
    xxsmall: [null, '360px']
  });

  // Play initial animations on page load.
  $window.on('load', function () {
    window.setTimeout(function () {
      $body.removeClass('is-preload');
    }, 100);
  });

  // Nav.
  var $nav = $('#nav');

  if ($nav.length > 0) {

    // Shrink effect.
    $main
      .scrollex({
        mode: 'top',
        enter: function () {
          $nav.addClass('alt');
        },
        leave: function () {
          $nav.removeClass('alt');
        },
      });

    // Links.
    var $nav_a = $nav.find('a');

    $nav_a
      .scrolly({
        speed: 1000,
        offset: function () { return $nav.height(); }
      })
      .on('click', function () {

        var $this = $(this);

        // External link? Bail.
        if ($this.attr('href').charAt(0) != '#') return;

        // Deactivate all links.
        $nav_a.removeClass('active active-locked');

        // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
        $this.addClass('active active-locked');


      })
      .each(function () {

        var $this = $(this),
          id = $this.attr('href'),
          $section = $(id);

        // No section for this link? Bail.
        if ($section.length < 1)
          return;

        // Scrollex.
        $section.scrollex({
          mode: 'middle',
          initialize: function () {

            // Deactivate section.
            if (browser.canUse('transition'))
              $section.addClass('inactive');

          },
          enter: function () {

            // Activate section.
            $section.removeClass('inactive');

            // No locked links? Deactivate all links and activate this section's one.
            if ($nav_a.filter('.active-locked').length == 0) {

              $nav_a.removeClass('active');
              $this.addClass('active');
              document.getElementById('nav').scrollLeft += $this.offset().left - 120;

            }

            // Otherwise, if this section's link is the one that's locked, unlock it.
            else if ($this.hasClass('active-locked'))
              $this.removeClass('active-locked');

          }
        });

      });

  }

  // Scrolly.
  $('.scrolly').scrolly({
    speed: 1000
  });

  $('#nav a').add('.smooth-scroll').off().on('click', function (e) {
    e.preventDefault();
    scrollIt($($(this).attr('href'))[0].offsetTop - 58)
    return false;
  });
  $('.collapse-control').on('click', function (e) {
    var ele = $('#' + $(this).attr('data-collapse'));
    ele.toggleClass('in');
    return false;
  });

  $('.glider-next,.glider-prev').on('click', function () {
    typeof ga !== 'undefined' && ga('send', 'event', 'Arrow Click', $(this).parents('.glider-contain').data('name'), $(this).hasClass('glider-prev') ? 'Previous' : 'Next')
  });
  $('.glider-dot').on('click', function () {
    typeof ga !== 'undefined' && ga('send', 'event', 'Dot Click', $(this).parents('.glider-contain').data('name'), $(this).data('index'))
  });

  $(document).on('click','.glider-slide h1', clickEffect);
})($);

function scrollIt(destination, duration = 350, easing = 'linear', callback) {

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  function scroller() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }(time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }
    requestAnimationFrame(scroller);
  }

  scroller();
}

// make sure click still works
function clickEffect(e){
  var d=document.createElement("div");
  d.className="clickEffect";
  d.style.top=e.clientY+"px";d.style.left=e.clientX+"px";
  document.body.appendChild(d);
  d.addEventListener('animationend',function(){d.parentElement.removeChild(d);}.bind(this));
}

function centerArrows(e){
  var
    glider = e.target._glider,
    arrows = glider.arrows,
    height = glider.ele.clientHeight;

  if (arrows){
    ['prev','next'].forEach(function(v){
      if (arrows[v]){
        var top = (height - arrows[v].clientHeight) / 2;
        arrows[v].style.top = top + 'px';
      }
    });
  }
}