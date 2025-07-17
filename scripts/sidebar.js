function aktive() {
  const currentFile = window.location.pathname.split("/").pop();
  console.log("Aktuelle Datei:", currentFile); // Testausgabe

  const activeLink = document.querySelector(`a[href="./${currentFile}"]`);
  if (activeLink) {
    activeLink.parentElement.classList.add("active");
  } else {
    console.warn("Kein aktiver Menüpunkt gefunden für:", currentFile);
  }
}

// Aufruf
document.addEventListener("DOMContentLoaded", aktive);

console.log("Hallo");
