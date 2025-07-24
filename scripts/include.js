async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
  }
}

// Wenn das HTML-DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", async () => {
  // Header laden und danach render() aufrufen
  await loadComponent("header", "./header.html");

  if (typeof render === "function") {
    render(); // Zeigt Initialen an
  }

  // Sidebar danach laden (kein render nötig)
  await loadComponent("sidebar", "./sidebar.html");
});
