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

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "/Join_470/html/header.html");
  loadComponent("sidebar", "/Join_470/html/sidebar.html");
});
