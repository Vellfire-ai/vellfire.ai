// Interactive Features component: one <div class="ftabs" data-ftabs> per page; this script fills it in.
// Keyboard: Left/Right/Home/End move between tabs (aria tablist). Mocks respect prefers-reduced-motion via CSS.
(() => {
  const TABS = [
    {id: "charts", label: "Charts", title: "Charts that take orders from you", lines: ["Candles, Heikin-Ashi, area. Any timeframe, your indicators.", "Drawing tools on hotkeys; alert lines you drag straight on the chart.", "Grids of 1 to 6 charts, each one floatable to another screen."], img: "img/feat_charts.png", alt: "Chart room with two charts and alert lines"},
    {id: "scanner", label: "Scanner", title: "Screens in your words", lines: ["Build a screen in plain words or a formula, save it, run it on your universe.", "One click shows which results fit your rules.", "Columns you resize, reorder, sort and hide."], img: "img/feat_screener.png", alt: "Screener with saved screens and results"},
    {id: "montage", label: "Montage / ladder", title: "Montage, ladder, tape", lines: ["Level 2 ladder and time and sales beside a 1-minute chart.", "Buy, short, peel, flatten on hotkeys. A stop on every order, sized from your risk.", "Entry, stop and targets drawn on the chart as you trade."], img: "img/feat_trade.png", alt: "Trade screen with a live paper position, stop and targets, Level 2 ladder"},
    {id: "heatmap", label: "Heatmap", title: "Heatmap built in. One platform.", lines: ["See the order book's walls right next to your chart and order ticket. No second app.", "Level 2 size drawn behind the candles: thin book in blue, big walls glowing orange and white.", "One click on the Trade chart, using your broker's depth data."], mock: "heat"},
    {id: "backtest", label: "Backtester", title: "Test before you trust", lines: ["Describe a test in plain words or build the rules yourself.", "Daily to 1-minute bars, honest costs, compared with random entries and buy-and-hold.", "Every value is checked for look-ahead before anything runs."], img: "img/feat_backtest.png", alt: "Test my idea backtester"},
    {id: "journal", label: "Journal", title: "Every trade, graded", lines: ["Paper trades log themselves: calendar, reports, insights, playbook per setup.", "Net R, win rate, drawdown, rules kept and a discipline score.", "The nightly review keeps the lessons."], img: "img/feat_journal.png", alt: "Journal dashboard with equity curve and score"},
    {id: "claude", label: "Claude helper", title: "A coach that reads your rulebook", lines: ["Set me up asks a few questions and builds your workspace.", "Ask for a screen, a chart, a page tune-up or a review of your day.", "It can never place an order or loosen a limit."], img: "img/feat_claude.png", alt: "Claude panel building a workspace"},
    {id: "addons", label: "Add-ons", title: "Your own tab, two files", lines: ["manifest.json + index.html in your data folder.", "Reads quotes, bars, the Montage stock and your watchlist through a sealed bridge.", "Never orders, settings or keys."], mock: "addon"},
  ];
  const MOCKS = {
    heat: () => {
      const rows = 14, cols = 22, cells = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const d = Math.abs(r - 7), wall = (r === 3 || r === 10) && c > 6, hot = wall ? 4 : d < 2 ? 3 : d < 4 ? 2 : d < 6 ? 1 : 0;
        cells.push(`<i class="h${hot}" style="animation-delay:${(c * -0.18).toFixed(2)}s"></i>`);
      }
      const ladder = ["1,100", "600", "900", "4,800", "300", "700", "1,200", "500", "4,400", "800", "600", "1,000", "300", "900"];
      return `<div class="mk mk-heat" aria-label="Animated mock of the order-book heatmap and ladder"><div class="hm" style="--cols:${cols}">${cells.join("")}<div class="px"></div></div>`
        + `<div class="lad">${ladder.map((s, i) => `<div class="${i < 7 ? "ask" : "bid"}"><span>${s}</span><b>${(245.12 + (7 - i) * 0.05).toFixed(2)}</b></div>`).join("")}</div>`
        + `<div class="mk-cap">Order-book heatmap · mock, not live data</div></div>`;
    },
    addon: () => `<div class="mk mk-addon" aria-label="Animated mock of an add-on tab"><div class="win"><div class="bar"><span></span><span></span><span></span><em>Opening Range · read-only add-on</em></div>`
      + `<pre class="code"><span class="k">const</span> q = <span class="k">await</span> vf.quote(<span class="s">"DEMO1"</span>);\n<span class="k">const</span> b = <span class="k">await</span> vf.bars(<span class="s">"DEMO1"</span>, <span class="s">"5m"</span>);\nvf.onSymbolChange(show);   <span class="c">// follows the Montage</span></pre>`
      + `<div class="out"><div class="sym">DEMO1</div><div class="state">ABOVE the opening range</div><div class="row"><span>15-min high</span><b>246.80</b></div><div class="row"><span>15-min low</span><b>244.95</b></div><div class="row"><span>Last</span><b class="tick">247.65</b></div></div></div>`
      + `<div class="mk-cap">Add-on tab · mock, not live data</div></div>`,
  };
  document.querySelectorAll("[data-mock]").forEach(el => { const f = MOCKS[el.dataset.mock]; if (f) el.innerHTML = f(); });
  document.querySelectorAll("[data-ftabs]").forEach((root, n) => {
    const only = (root.dataset.ftabs || "").split(",").map(s => s.trim()).filter(Boolean);
    const tabs = only.length ? TABS.filter(t => only.includes(t.id)) : TABS;
    const list = document.createElement("div"); list.className = "ftab-list"; list.setAttribute("role", "tablist"); list.setAttribute("aria-label", "Features");
    const panels = document.createElement("div"); panels.className = "ftab-panels";
    tabs.forEach((t, i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "ftab"; b.id = `ftab${n}-${t.id}`; b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0); b.setAttribute("aria-controls", `fpanel${n}-${t.id}`); b.tabIndex = i === 0 ? 0 : -1; b.textContent = t.label; list.appendChild(b);
      const p = document.createElement("div"); p.className = "ftab-panel"; p.id = `fpanel${n}-${t.id}`; p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", b.id); p.hidden = i !== 0;
      p.innerHTML = `<div class="ftab-text"><h3><svg class="fl"><use href="#flameIcon"/></svg>${t.title}</h3><ul>${t.lines.map(l => `<li>${l}</li>`).join("")}</ul></div>`
        + `<div class="ftab-media">${t.img ? `<img class="shot" src="${t.img}" alt="${t.alt}" loading="lazy">` : MOCKS[t.mock]()}</div>`;
      panels.appendChild(p);
    });
    root.append(list, panels);
    const btns = [...list.children];
    const show = i => { btns.forEach((b, k) => { const on = k === i; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; panels.children[k].hidden = !on; }); btns[i].scrollIntoView({block: "nearest", inline: "center", behavior: "smooth"}); };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => show(i));
      b.addEventListener("keydown", e => {
        const k = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: btns.length - 1}[e.key];
        if (k === undefined) return;
        e.preventDefault(); const j = (k + btns.length) % btns.length; show(j); btns[j].focus();
      });
    });
    // deep link: #tab=journal
    const m = location.hash.match(/tab=([a-z]+)/); if (m) { const j = tabs.findIndex(t => t.id === m[1]); if (j >= 0) show(j); }
  });
})();
