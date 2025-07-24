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
    console.error(`Fehler beim Laden von ${path}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Header zuerst
  await loadComponent("header", "./header.html");

  // Sidebar danach
  await loadComponent("sidebar", "./sidebar.html");
});
