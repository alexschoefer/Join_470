/**
 * Loads an HTML file asynchronously and inserts it into the given element.
 * Also calls initHeader() or initSidebar() if the ID matches.
 * Logs an error if loading fails.
 * @param {string} id - The ID of the target DOM element.
 * @param {string} path - The path to the HTML file.
 * @returns {Promise<void>}
 */
async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    if (id === "header" && typeof initHeader === "function") {
      initHeader();
    }
    if (id === "sidebar" && typeof initSidebar === "function") {
      initSidebar();
    }
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
  }
}

/**
 * Loads the header and sidebar components after the DOM is ready.
 * Uses loadComponent() to fetch and inject HTML content.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header", "./header.html");
  await loadComponent("sidebar", "./sidebar.html");
});
