/**
 * Toggles the visibility of the burger menu.
 * Adds event listeners to close the menu on outside click or link click.
 * @returns {void}
 */
function showBurgerMenu() {
  const menu = document.getElementById("burger-menu");
  const profileCircle = document.getElementById("profileCircle");
  menu.classList.toggle("d_none");
  if (!menu.classList.contains("d_none")) {
    profileCircle.classList.add("active");
    document.addEventListener("click", closeWhenClickedOutside);
    const links = menu.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", closeBurgerMenu);
    });
  } else {
    profileCircle.classList.remove("active");
  }
}

/**
 * Hides the burger menu and removes the outside click listener.
 * @returns {void}
 */
function closeBurgerMenu() {
  const menu = document.getElementById("burger-menu");
  const profileCircle = document.getElementById("profileCircle");
  menu.classList.add("d_none");
  profileCircle.classList.remove("active");
  document.removeEventListener("click", closeWhenClickedOutside);
}

/**
 * Closes the burger menu if the click occurs outside the menu or guest icon.
 * @param {MouseEvent} event - The click event.
 * @returns {void}
 */
function closeWhenClickedOutside(event) {
  const menu = document.getElementById("burger-menu");
  const guestIcon = document.getElementById("profileCircle");
  if (!menu.contains(event.target) && !guestIcon.contains(event.target)) {
    closeBurgerMenu();
  }
}

/**
 * Sets the user's initials in the header based on localStorage data.
 * Defaults to "G" if no name is found or parsing fails.
 * Updates the #initials element with the result.
 * @returns {void}
 */
function render() {
  const userData = localStorage.getItem("loggedInUser");
  let initials = "G";
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      if (parsedData.name) {
        initials = getInitials(parsedData.name);
      }
    } catch (err) {
      console.error("Error parsing loggedInUser:", err);
    }
  }
  const initialsElement = document.getElementById("initials");
  if (initialsElement) {
    initialsElement.textContent = initials;
  }
}

/**
 * Extracts up to two uppercase initials from a full name.
 * @param {string} name - The full name.
 * @returns {string} The resulting initials.
 */
function getInitials(name) {
  const nameParts = name.trim().split(" ");
  let initials = "";
  for (let i = 0; i < nameParts.length && i < 2; i++) {
    initials += nameParts[i].charAt(0).toUpperCase();
  }
  return initials;
}

/**
 * Logs the user out by clearing related localStorage entries.
 * Removes "loggedInUser" and "showWelcomeOnce".
 * @returns {void}
 */
function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("showWelcomeOnce");
}

/**
 * Initializes the header by displaying the user's initials.
 * Extracts initials from the logged-in user's name in localStorage.
 * Updates the #initials element.
 * @returns {void}
 */
function initHeader() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const initialsEl = document.getElementById("initials");
  if (!initialsEl || !user?.name) return;
  const initials = user.name
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");
  initialsEl.innerText = initials;
}
