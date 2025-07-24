async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;

    // Aktive Navigation setzen, wenn Sidebar geladen ist
    if (path.includes("sidebar.html") && typeof aktive === "function") {
      aktive();
    }

    // Header-Funktionen, wenn nötig
    if (path.includes("header.html") && typeof render === "function") {
      render();
    }
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Header zuerst
  await loadComponent("header", "./header.html");

  // Sidebar danach
  await loadComponent("sidebar", "./sidebar.html");
});
