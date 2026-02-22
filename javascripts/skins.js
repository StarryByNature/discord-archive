(function () {
  const KEY = "archive-skin";
  const SKINS = ["win95", "xpvista"];

  function applySkin(skin) {
    const body = document.body;
    SKINS.forEach(s => body.classList.remove(`skin-${s}`));
    body.classList.add(`skin-${skin}`);
    localStorage.setItem(KEY, skin);

    const label = document.getElementById("skin-label");
    if (label) label.textContent = skin === "win95" ? "Windows 95" : "Windows XP/Vista";
  }

  // Make available to onclick handlers
  window.setArchiveSkin = function (skin) {
    if (!SKINS.includes(skin)) return;
    applySkin(skin);
  };

  // Initial load
  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(KEY);
    applySkin(SKINS.includes(saved) ? saved : "win95");
  });
})();