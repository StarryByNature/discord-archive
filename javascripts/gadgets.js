(function () {
  function getSkinLabel() {
    return document.body.classList.contains("skin-xpvista") ? "XP/Vista" :
           document.body.classList.contains("skin-win95") ? "Win95" :
           "Default";
  }

  function formatClock(d) {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  }

  function updateClock() {
    const el = document.getElementById("archive-clock");
    if (!el) return;
    el.textContent = formatClock(new Date());
  }

  function getNavLinks() {
    // Primary navigation links in the left sidebar
    const links = Array.from(document.querySelectorAll(".md-nav--primary a.md-nav__link"))
      .map(a => a.getAttribute("href"))
      .filter(Boolean);

    // Normalize and keep unique
    const unique = [];
    const seen = new Set();
    for (const href of links) {
      // Ignore search page and same-page anchors
      if (href.includes("search/")) continue;
      if (href.startsWith("#")) continue;

      // Ignore section toggles (these sometimes have href="#" or empty)
      if (href === "#" || href === "") continue;

      // Store
      if (!seen.has(href)) {
        seen.add(href);
        unique.push(href);
      }
    }
    return unique;
  }

  function estimateSections() {
    // Count top-level groups in the primary sidebar
    // This is a "best effort" heuristic and works well for archives
    const topItems = document.querySelectorAll(".md-nav--primary > .md-nav__list > .md-nav__item");
    // subtract 1 if "Home" is present as the first item
    let count = topItems.length;
    const homeLink = document.querySelector('.md-nav--primary a.md-nav__link[href="./"], .md-nav--primary a.md-nav__link[href="/"], .md-nav--primary a.md-nav__link[href="index/"], .md-nav--primary a.md-nav__link[href="index.html"]');
    if (homeLink && count > 0) count -= 1;
    return Math.max(count, 0);
  }

  function pickRandomThreadUrl() {
    const links = getNavLinks();

    // Filter down to "leaf-ish" pages:
    // Most MkDocs pages end with "/" (pretty URLs), sometimes ".html"
    const candidates = links.filter(h =>
      (h.endsWith("/") || h.endsWith(".html")) &&
      !h.includes("#")
    );

    if (candidates.length === 0) return null;

    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }

  function updateGadget() {
    const sectionsEl = document.getElementById("archive-sections");
    const threadsEl = document.getElementById("archive-threads");
    const themeEl = document.getElementById("archive-theme");

    if (themeEl) themeEl.textContent = getSkinLabel();

    const links = getNavLinks();
    if (threadsEl) threadsEl.textContent = String(links.length);

    if (sectionsEl) sectionsEl.textContent = String(estimateSections());
  }

  function wireRandomButton() {
    const btn = document.getElementById("archive-random-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const url = pickRandomThreadUrl();
      if (!url) return;
      window.location.href = url;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateGadget();
    wireRandomButton();
    updateClock();
    setInterval(updateClock, 30 * 1000);

    // If the user switches skin, update the label
    const obs = new MutationObserver(() => updateGadget());
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  });
})();