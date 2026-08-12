/* ALTRE MENTI — script condiviso
   Pannello accessibilità, menu mobile, cookie banner, moduli. */
(function () {
  "use strict";

  var html = document.documentElement;
  var CHIAVE = "altrementi-a11y";

  /* ---------- Preferenze di accessibilità ---------- */
  function leggiPreferenze() {
    try { return JSON.parse(localStorage.getItem(CHIAVE)) || {}; }
    catch (e) { return {}; }
  }
  function salvaPreferenze(p) {
    try { localStorage.setItem(CHIAVE, JSON.stringify(p)); } catch (e) {}
  }
  function applicaPreferenze(p) {
    html.classList.toggle("font-grande", p.testo === 1);
    html.classList.toggle("font-molto-grande", p.testo === 2);
    html.classList.toggle("alto-contrasto", !!p.contrasto);
    html.classList.toggle("riduci-animazioni", !!p.riduciAnimazioni);
  }
  var pref = leggiPreferenze();
  applicaPreferenze(pref);

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Pannello accessibilità ---------- */
    var apri = document.getElementById("apri-a11y");
    var pannello = document.getElementById("pannello-a11y");
    var chiudi = document.getElementById("chiudi-a11y");

    function aggiornaBottoni() {
      pannello.querySelectorAll("[data-testo]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(Number(b.dataset.testo) === (pref.testo || 0)));
      });
      var bc = pannello.querySelector("[data-contrasto]");
      var ba = pannello.querySelector("[data-animazioni]");
      if (bc) bc.setAttribute("aria-pressed", String(!!pref.contrasto));
      if (ba) ba.setAttribute("aria-pressed", String(!!pref.riduciAnimazioni));
    }

    if (apri && pannello) {
      apri.addEventListener("click", function () {
        var aperto = !pannello.hidden;
        pannello.hidden = aperto;
        apri.setAttribute("aria-expanded", String(!aperto));
        if (!aperto) { aggiornaBottoni(); (chiudi || pannello).focus(); }
      });
      if (chiudi) chiudi.addEventListener("click", function () {
        pannello.hidden = true;
        apri.setAttribute("aria-expanded", "false");
        apri.focus();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !pannello.hidden) {
          pannello.hidden = true;
          apri.setAttribute("aria-expanded", "false");
          apri.focus();
        }
      });
      pannello.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.testo !== undefined) pref.testo = Number(b.dataset.testo);
        if (b.dataset.contrasto !== undefined) pref.contrasto = !pref.contrasto;
        if (b.dataset.animazioni !== undefined) pref.riduciAnimazioni = !pref.riduciAnimazioni;
        applicaPreferenze(pref);
        salvaPreferenze(pref);
        aggiornaBottoni();
      });
      aggiornaBottoni();
    }

    /* ---------- Menu mobile ---------- */
    var bottoneMenu = document.getElementById("apri-menu");
    var nav = document.getElementById("nav-principale");
    if (bottoneMenu && nav) {
      bottoneMenu.addEventListener("click", function () {
        var aperto = nav.classList.toggle("aperto");
        bottoneMenu.setAttribute("aria-expanded", String(aperto));
        bottoneMenu.textContent = aperto ? "Chiudi menu ✕" : "Menu ☰";
      });
    }

    /* ---------- Cookie banner ---------- */
    var banner = document.getElementById("banner-cookie");
    var okCookie = document.getElementById("accetta-cookie");
    if (banner) {
      var visto = false;
      try { visto = localStorage.getItem("altrementi-cookie") === "ok"; } catch (e) {}
      if (!visto) banner.hidden = false;
      if (okCookie) okCookie.addEventListener("click", function () {
        try { localStorage.setItem("altrementi-cookie", "ok"); } catch (e) {}
        banner.hidden = true;
      });
    }

    /* ---------- Anno corrente nel footer ---------- */
    document.querySelectorAll(".anno-corrente").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
