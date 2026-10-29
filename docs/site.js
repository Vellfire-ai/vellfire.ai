// VellFire.Ai site: nav, theme toggle, flame icons and the sign-up modal that gates every download button.
// Where sign-ups are sent. Change this one line after deploying the Worker (see DEPLOY.md).
const SIGNUP_ENDPOINT = "https://signup.vellfire.ai/api/signup";
const DL_SETUP = "https://github.com/Vellfire-ai/vellfire.ai/releases/latest/download/VellFireAi_Setup.exe";
const DL_PORTABLE = "https://github.com/Vellfire-ai/vellfire.ai/releases/latest/download/VellFireAi_Portable.exe";

window.vfStartDownload = url => { const a = document.createElement("a"); a.href = url; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove(); };

(() => {
  const $ = id => document.getElementById(id);
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

  // ---- download links: fill in the release URLs ----
  document.querySelectorAll("a[data-dl='setup']").forEach(a => { a.dataset.dl = DL_SETUP; });
  document.querySelectorAll("a[data-dl='portable']").forEach(a => { a.dataset.dl = DL_PORTABLE; });

  // ---- the sign-up modal (one copy, injected on every page that has a download button) ----
  if (!document.querySelector("a[data-dl]")) return;
  const m = document.createElement("div"); m.className = "vfm"; m.id = "vfm"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-labelledby", "vfmT");
  m.innerHTML = '<form id="vff" novalidate>'
    + '<h2 id="vfmT">Before you download</h2><p class="sub">Tell us who you are so we can send your licence key. Takes 20 seconds.</p>'
    + '<label class="f">Name *<input type="text" id="vfName" maxlength="100" autocomplete="name"><span class="err" id="eName"></span></label>'
    + '<label class="f">Email *<input type="email" id="vfEmail" maxlength="200" autocomplete="email"><span class="err" id="eEmail"></span></label>'
    + '<label class="f">Country *<select id="vfCountry"><option value="">Choose...</option></select><span class="err" id="eCountry"></span></label>'
    + '<label class="f">How did you hear about us? (optional)<input type="text" id="vfSource" maxlength="200"></label>'
    + '<label class="chk"><input type="checkbox" id="vfPriv"><span>I agree to the <a href="privacy.html" target="_blank" rel="noopener">privacy notice</a> *</span></label><span class="err" id="ePriv"></span>'
    + '<label class="chk"><input type="checkbox" id="vfMkt"><span>Email me product updates</span></label>'
    + '<div class="msg" id="vfMsg" aria-live="polite"></div>'
    + '<div class="row"><button type="button" id="vfCancel">Cancel</button><button type="submit" class="go" id="vfGo">Continue to download</button></div></form>';
  document.body.appendChild(m);
  const M = $("vfm"), F = $("vff");
  const COUNTRIES = ["United Kingdom","Ireland","United States","Canada","Australia","New Zealand","Germany","France","Spain","Italy","Netherlands","Sweden","Norway","Denmark","Switzerland","India","Singapore","South Africa","United Arab Emirates","Other"];
  COUNTRIES.forEach(c => { const o = document.createElement("option"); o.value = o.textContent = c; $("vfCountry").appendChild(o); });
  let file = "";
  document.querySelectorAll("a[data-dl]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); file = a.dataset.dl; $("vfMsg").textContent = ""; $("vfMsg").className = "msg"; $("vfGo").disabled = false; M.classList.add("on"); $("vfName").focus(); }));
  const close = () => M.classList.remove("on");
  $("vfCancel").onclick = close; document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  const set = (id, t) => { $(id).textContent = t; };
  F.addEventListener("submit", async e => {
    e.preventDefault();
    const d = { name: $("vfName").value.trim(), email: $("vfEmail").value.trim(), country: $("vfCountry").value, source: $("vfSource").value.trim(), marketing_optin: $("vfMkt").checked, privacy_accepted: $("vfPriv").checked };
    let ok = true;
    set("eName", d.name ? "" : "Please enter your name."); if (!d.name) ok = false;
    const em = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email); set("eEmail", em ? "" : "Please enter a valid email address."); if (!em) ok = false;
    set("eCountry", d.country ? "" : "Please choose your country."); if (!d.country) ok = false;
    set("ePriv", d.privacy_accepted ? "" : "You need to agree to the privacy notice to continue."); if (!d.privacy_accepted) ok = false;
    if (!ok) return;
    const msg = $("vfMsg"), go = $("vfGo"); go.disabled = true; msg.className = "msg"; msg.textContent = "Sending...";
    try {
      const r = await fetch(SIGNUP_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      msg.className = "msg ok"; msg.textContent = "Thanks, your download is starting";
      window.vfStartDownload(file); setTimeout(close, 4000);
    } catch (err) {   // 29 Oct: never block a download if the sign-up service is unreachable
      msg.className = "msg ok"; msg.textContent = "Thanks, your download is starting";
      window.vfStartDownload(file); setTimeout(close, 4000);
    }
  });
})();
