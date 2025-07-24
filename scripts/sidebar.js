function aktive() {
  const currentPage = window.location.pathname.split("/").pop();

  const buttons = document.querySelectorAll(".menu-selection-button");

  buttons.forEach((button) => {
    const link = button.querySelector("a");
    if (!link) return;

    const href = link.getAttribute("href").replace("./", "");

    if (href === currentPage) {
      button.classList.add("active");
    }
  });
}
