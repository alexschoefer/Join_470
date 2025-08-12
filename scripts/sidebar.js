/**
 * Highlights the active sidebar button based on the current page.
 * Compares each menu link's href with the current URL.
 * Adds or removes the "active" class accordingly.
 * @returns {void}
 */
function initSidebar() {
  const currentPage = window.location.pathname.split("/").pop();
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

/**
 * Navigates to the link inside a clicked button without default behavior.
 * Prevents default event and redirects manually via the anchor's href.
 * @param {Event} event - The click event from the button.
 * @returns {void}
 */
function goTo(event) {
  event.preventDefault();
  const button = event.currentTarget;
  const link = button.querySelector("a");
  if (link && link.href) {
    window.location.href = link.href;
  }
}
