/* MAT6201 — konu sayfası ilerletmeleri.
   Hepsi isteğe bağlı: JS çalışmazsa sayfa ve menü tam işlevini korur.
   1) Okunan alt bölümü içindekiler menüsünde işaretler, bölümünü açar.
   2) Başlıklara paylaşılabilir bağlantı (#) ekler. */
(function () {
  "use strict";

  var toc = document.querySelector(".toc");
  if (!toc) return;

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var entries = [];

  links.forEach(function (link) {
    var target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target) entries.push({ link: link, target: target });
  });
  if (!entries.length) return;

  /* --- 1. Okunan bölümü işaretle --- */

  var current = null;

  function highlight() {
    var found = null;

    for (var i = 0; i < entries.length; i++) {
      // Başlığı sayfanın üst şeridini geçmiş son bölüm "okunan" bölümdür.
      if (entries[i].target.getBoundingClientRect().top <= 120) found = entries[i];
    }
    // Sayfanın en altındayken son bölüm okunuyor sayılır.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      found = entries[entries.length - 1];
    }
    if (found === current) return;

    if (current) current.link.removeAttribute("aria-current");
    current = found;
    if (!current) return;

    current.link.setAttribute("aria-current", "true");

    var group = current.link.closest("details");
    if (group && !group.open) group.open = true;
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      highlight();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  highlight();

  /* --- 2. Başlık bağlantıları --- */

  document.querySelectorAll(".subsection[id] > h3").forEach(function (heading) {
    var anchor = document.createElement("a");
    anchor.className = "anchor";
    anchor.href = "#" + heading.parentNode.id;
    anchor.textContent = "#";
    anchor.setAttribute("aria-label", "Bu bölüme bağlantı");
    heading.appendChild(anchor);
  });
})();
