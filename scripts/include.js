/**
 * Gibt den aktuellen Dateinamen zurück.
 * @returns {string}
 */
function getCurrentFile() {
  const p = window.location.pathname;
  const f = p.substring(p.lastIndexOf("/") + 1);
  return f || "index.html";
}

/**
 * Markiert Sidebar-Links als aktiv.
 */
function markSidebarActive() {
  const cur = getCurrentFile();
  const pub = document.body.classList.contains("public");
  document.querySelectorAll("#sidebar a").forEach((a) => {
    const f =
      new URL(a.getAttribute("href"), location.href).pathname
        .split("/")
        .pop() || "index.html";
    if (f !== cur) return;
    if (pub && a.classList.contains("legal-information-button-public-btn"))
      a.classList.add("active");
    else a.parentElement?.classList?.add("active");
  });
}

/**
 * Prüft Public-Mode über URL-Param.
 * @returns {boolean}
 */
function isPublicMode() {
  return new URLSearchParams(location.search).get("public") === "1";
}

/**
 * Wählt den zu ladenden Pfad.
 * @param {HTMLElement} el
 * @param {string} def
 * @param {boolean} pub
 * @param {string} id
 * @returns {string}
 */
function choosePath(el, def, pub, id) {
  const d = el.getAttribute("data-component") || def;
  if (!el.getAttribute("data-component") && pub && id === "sidebar")
    return "./sidebar-public.html";
  return d;
}

/**
 * Holt HTML als Text.
 * @param {string} path
 * @returns {Promise<string>}
 */
async function fetchHTML(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`HTTP error! Status: ${r.status}`);
  return r.text();
}

/**
 * Initialisiert Sidebar nach dem Einfügen.
 * @param {boolean} pub
 */
function afterSidebar(pub) {
  if (pub) document.body.classList.add("public");
  if (typeof initSidebar === "function") initSidebar();
  markSidebarActive?.();
}

/**
 * Initialisiert Header nach dem Einfügen.
 * @param {HTMLElement} el
 * @param {boolean} pub
 */
function afterHeader(el, pub) {
  if (pub) {
    el.querySelector(".header-user-content")?.remove();
    document.body.classList.add("public");
    el.querySelector("#help-icon")?.remove();
    el.querySelector("#profileCircle")?.remove();
    el.querySelector("#burger-menu")?.remove();
  }
  if (typeof initHeader === "function") initHeader();
}

/**
 * Lädt und setzt ein Fragment.
 * @param {string} id
 * @param {string} def
 */
async function loadComponent(id, def) {
  const el = document.getElementById(id);
  if (!el) return;
  const pub = isPublicMode();
  const path = choosePath(el, def, pub, id);
  el.innerHTML = await fetchHTML(path);
  if (id === "sidebar") afterSidebar(pub);
  if (id === "header") afterHeader(el, pub);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header", "./header.html");
  await loadComponent("sidebar", "./sidebar.html");
});
