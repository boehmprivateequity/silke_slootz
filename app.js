/* Gemeinsames Skript für index.html und index2.html */
(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var DICT = window.DICT || {};
  var META = document.body.dataset.meta || "meta";

  // Deutsch steht im HTML und wird hier als Wörterbuch eingelesen
  var de = DICT.de = DICT.de || {};
  $$("[data-i18n]").forEach(function (e) { if (!(e.dataset.i18n in de)) de[e.dataset.i18n] = e.textContent; });
  $$("[data-i18n-attr]").forEach(function (e) {
    var p = e.dataset.i18nAttr.split(":");
    if (!(p[1] in de)) de[p[1]] = e.getAttribute(p[0]);
  });
  de[META + ".title"] = document.title;
  de[META + ".desc"] = $('meta[name="description"]').content;

  var lang = "de";
  function t(key) { return (DICT[lang] && DICT[lang][key]) || de[key] || ""; }
  function waUrl(text) { return "https://wa.me/491791239006?text=" + encodeURIComponent(text); }

  function setLang(l) {
    lang = DICT[l] ? l : "de";
    root.lang = lang;
    document.title = t(META + ".title");
    $('meta[name="description"]').content = t(META + ".desc");
    $$("[data-i18n]").forEach(function (e) { e.textContent = t(e.dataset.i18n); });
    $$("[data-i18n-attr]").forEach(function (e) {
      var p = e.dataset.i18nAttr.split(":");
      e.setAttribute(p[0], t(p[1]));
    });
    $$("[data-wa]").forEach(function (a) { a.href = waUrl(t("wa.hello")); });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    var st = $(".status");
    if (st) st.textContent = "";
  }

  // Startsprache: Link (?lang=), sonst letzte Wahl, sonst Deutsch
  var START = "de";
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  setLang(new URLSearchParams(location.search).get("lang") || saved || START);
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.dataset.lang);
      try { localStorage.setItem("lang", lang); } catch (e) {}
    });
  });

  // Menü am Handy
  var nav = $("#nav"), burger = $(".burger");
  function menu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", function () { menu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) menu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { menu(false); burger.focus(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".header")) menu(false); });
  $(".header").addEventListener("focusout", function (e) {
    if (e.relatedTarget && !e.relatedTarget.closest(".header")) menu(false);
  });

  if ($("#gallery")) gallery();
  if ($(".page")) pages();
  if ($("#request")) request();
  observers();

  // Galerie "Mein Weg"
  function gallery() {
    var gal = $("#gallery"), arrows = $$("[data-scroll]");
    function update() {
      arrows[0].disabled = gal.scrollLeft < 8;
      arrows[1].disabled = gal.scrollLeft + gal.clientWidth > gal.scrollWidth - 8;
    }
    arrows.forEach(function (b) {
      b.addEventListener("click", function () {
        var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
        gal.scrollBy({ left: (gal.firstElementChild.offsetWidth + 20) * Number(b.dataset.scroll), behavior: calm ? "auto" : "smooth" });
      });
    });
    gal.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  // Ebenen: pro Adresse (#quelle, #seelen ...) eine eigene Seite
  function pages() {
    var all = $$(".page"), main = $("#main"), first = true;
    function show() {
      var id = location.hash.slice(1);
      if (id === "main") return;
      var target = all.filter(function (p) { return p.id === id; })[0] || all[0];
      all.forEach(function (p) { p.hidden = p !== target; });
      $$("#nav [aria-current]").forEach(function (a) { a.setAttribute("aria-current", target === all[0] ? "page" : "true"); });
      window.scrollTo({ top: 0, behavior: "instant" });
      if (!first) (target.querySelector("h1, h2") || main).focus({ preventScroll: true });
      first = false;
    }
    window.addEventListener("hashchange", show);
    show();
  }

  function observers() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var rev = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(function (e) { rev.observe(e); });

    var dockBar = $("#dock");
    if (!dockBar) return;
    var links = $$("#nav a");
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + e.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section").forEach(function (s) { spy.observe(s); });

    // Kontaktleiste ausblenden, solange Start oder Kontakt zu sehen sind
    var seen = {};
    var dock = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      dockBar.classList.toggle("away", !!(seen.start || seen.kontakt));
    });
    dock.observe($("#start"));
    dock.observe($("#kontakt"));
  }

  // Anfrage: öffnet WhatsApp mit vorbereitetem Text
  function request() {
    var name = $("#f-name"), err = $("#f-name-e"), status = $(".status");
    function invalid(on) {
      err.hidden = !on;
      if (on) name.setAttribute("aria-invalid", "true"); else name.removeAttribute("aria-invalid");
    }
    name.addEventListener("input", function () { if (name.value.trim()) invalid(false); });
    $("#request").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!name.value.trim()) { invalid(true); name.focus(); return; }
      invalid(false);
      var lines = [t("wa.name") + " " + name.value.trim() + ".", t("wa.topic") + " " + t($("#f-topic").value)];
      var msg = $("#f-msg").value.trim();
      if (msg) lines.push("", msg);
      var a = document.createElement("a");
      a.href = waUrl(lines.join("\n"));
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = t("fo.link");
      status.textContent = t("fo.ok") + " ";
      status.appendChild(a);
      a.click();
    });
  }
})();
