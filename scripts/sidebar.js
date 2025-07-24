function initSidebar() {
  const currentPage = window.location.pathname.split("/").pop(); // z.B. 'add-task.html'

  const buttons = document.querySelectorAll(".menu-selection-button");

  buttons.forEach((button) => {
    const link = button.querySelector("a");
    if (!link) return;

    const href = link.getAttribute("href").replace("./", "");

    if (href === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function goTo(event) {
  event.preventDefault();
  const button = event.currentTarget;
  const link = button.querySelector("a");
  if (link && link.href) {
    window.location.href = link.href;
  }
}
