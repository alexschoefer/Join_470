async function loadComponent(id, path) {
  try {
    const el = document.getElementById(id);
    if (!el) return;

    const urlParams = new URLSearchParams(window.location.search);
    const isPublic = urlParams.get("public") === "1";

    let finalPath = path;

    // Sidebar austauschen, wenn public=1
    if (isPublic && id === "sidebar") {
      finalPath = "./sidebar-public.html";
    }

    const res = await fetch(finalPath);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const html = await res.text();
    el.innerHTML = html;

    if (id === "header") {
      if (typeof initHeader === "function") initHeader();

      // Help-Icon & Profilkreis nur bei public=1 entfernen
      if (isPublic) {
        const helpIcon = el.querySelector("#help-icon");
        const profileCircle = el.querySelector("#profileCircle");
        if (helpIcon) helpIcon.remove();
        if (profileCircle) profileCircle.remove();
      }
    }

    if (id === "sidebar" && typeof initSidebar === "function") initSidebar();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header", "./header.html");
  await loadComponent("sidebar", "./sidebar.html");
});
