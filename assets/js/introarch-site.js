/* introarchitecture.it.com — navigation, header state and gentle reveals. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("ia-js");

  /* Local preview (opened from disk): folder links like "service/" would show a
     directory listing, so point them at the folder's index.html. On a real web
     server this block does nothing and clean URLs stay unchanged. */
  if (window.location.protocol === "file:") {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var raw = a.getAttribute("href");
      if (/^(https?:|mailto:|tel:|#)/i.test(raw)) return;
      var hashAt = raw.indexOf("#");
      var path = hashAt > -1 ? raw.slice(0, hashAt) : raw;
      var hash = hashAt > -1 ? raw.slice(hashAt) : "";
      if (path === "" ) return;
      if (path === "." || path === "..") path += "/";
      if (path.charAt(path.length - 1) === "/") {
        if (path.charAt(0) === "/") return; /* root-absolute (404 page) needs a server */
        a.setAttribute("href", path + "index.html" + hash);
      }
    });
  }

  var head = document.querySelector(".ia-head");
  var burger = document.querySelector(".ia-burger");
  var nav = document.getElementById("ia-nav");

  function setHeadHeight() {
    if (head) doc.style.setProperty("--ia-head-h", head.offsetHeight + "px");
  }
  setHeadHeight();
  window.addEventListener("resize", setHeadHeight);

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("ia-locked");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      if (open) { closeMenu(); return; }
      setHeadHeight();
      nav.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Close menu");
      document.body.classList.add("ia-locked");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) closeMenu();
    });
  }

  if (head) {
    var onScroll = function () { head.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var risers = document.querySelectorAll(".ia-rise");
  if ("IntersectionObserver" in window && risers.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    risers.forEach(function (el) { io.observe(el); });
  } else {
    risers.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Respect reduced-motion: keep videos paused on the poster frame */
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("video[autoplay]").forEach(function (v) { v.pause(); v.removeAttribute("autoplay"); });
  }

  var yr = document.querySelectorAll("[data-year]");
  yr.forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
