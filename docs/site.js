// VellFire.Ai site: nav, theme toggle, flame icons, contact links.
// 25 Nov: no public downloads. Any leftover a[data-dl] link becomes the "More details" email link.
// The one contact address. Every <a data-mail> on the site is filled from here.
const CONTACT_EMAIL = "hello@vellfire.ai";

(() => {
  // ---- contact address, beta ribbon, help search, section sub-nav ----
  document.querySelectorAll("a[data-mail]").forEach(a => { const s = a.dataset.mail; a.href = "mailto:" + CONTACT_EMAIL + (s ? "?subject=" + encodeURIComponent(s) : ""); if (!a.dataset.keep) a.textContent = CONTACT_EMAIL; });
  const rib = document.querySelector(".ribbon");
  if (rib) { let hid = false; try { hid = localStorage.getItem("vfRibbon") === "off"; } catch (e) {} if (hid) rib.remove(); else { const x = rib.querySelector(".x"); if (x) x.addEventListener("click", () => { rib.remove(); try { localStorage.setItem("vfRibbon", "off"); } catch (e) {} }); } }
  const q = document.querySelector("#helpSearch");
  if (q) q.addEventListener("input", () => {
    const t = q.value.trim().toLowerCase();
    document.querySelectorAll(".faq details").forEach(d => { const hit = !t || d.textContent.toLowerCase().includes(t); d.hidden = !hit; if (t && hit) d.open = true; });
    document.querySelectorAll(".faq-group").forEach(g => { g.hidden = !!t && ![...g.querySelectorAll("details")].some(d => !d.hidden); });
  });
  const sub = document.querySelector(".subnav");
  if (sub && "IntersectionObserver" in window) {
    const links = [...sub.querySelectorAll("a")], secs = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }); }, {rootMargin: "-40% 0px -55% 0px"});
    secs.forEach(s => io.observe(s));
  }
  // ---- shared flame icon (an SVG symbol + gradient, used by every .fl icon) ----
  const defs = document.createElement("div");
  defs.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="flameGrad" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff3d2e"/><stop offset=".55" stop-color="#ff8a00"/><stop offset="1" stop-color="#ffd23f"/></linearGradient>'
    + '<symbol id="flameIcon" viewBox="0 0 24 24"><path d="M12 2c1 4 4.5 5.5 4.5 10.2 0 1.6-.5 3-1.4 4.1.3-2.4-.6-4.3-2.3-5.6-.1 2.1-.9 3.4-2.1 4.4-.5-.6-.8-1.4-.8-2.3-2 1.5-2.9 3.3-2.9 5.3C6.2 19.7 8.9 22 12 22c3.9 0 7-3 7-7.3C19 8.4 14.7 6.5 12 2z"/></symbol></defs></svg>';
  document.body.prepend(defs.firstChild);
  document.querySelectorAll(".fl").forEach(s => { s.innerHTML = '<use href="#flameIcon"/>'; });

  // ---- nav: current page + mobile burger + theme toggle ----
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach(a => { if ((a.getAttribute("href") || "").toLowerCase() === here) a.setAttribute("aria-current", "page"); });
  const burger = document.querySelector(".burger"), nav = document.querySelector(".nav");
  if (burger && nav) burger.addEventListener("click", () => { nav.classList.toggle("open"); burger.setAttribute("aria-expanded", nav.classList.contains("open")); });
  const theme = document.querySelector(".theme");
  const applyTheme = t => { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); if (theme) theme.textContent = (t || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")) === "dark" ? "☀ Light" : "☾ Dark"; };
  let saved = null; try { saved = localStorage.getItem("vfTheme"); } catch (e) {}
  applyTheme(saved);
  if (theme) theme.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = cur === "dark" ? "light" : "dark"; applyTheme(next); try { localStorage.setItem("vfTheme", next); } catch (e) {}
  });

  // ---- no downloads: any leftover download link becomes the "More details" email link ----
  document.querySelectorAll("a[data-dl]").forEach(a => { a.removeAttribute("data-dl"); a.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("More details"); a.textContent = "Get in touch"; });
  document.querySelectorAll("[data-when-dl]").forEach(e => { e.hidden = true; });
  document.querySelectorAll("[data-when-hold]").forEach(e => { e.hidden = false; });
})();
