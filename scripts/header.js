function ShowBurgerMenu() {
  const menu = document.getElementById("burger-menu");
  menu.classList.toggle("d_none");
  if (!menu.classList.contains("d_none")) {
    document.addEventListener("click", closeWhenClickedOutside);
    const links = menu.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", CloseBurgerMenu);
    });
  }
}

function CloseBurgerMenu() {
  const menu = document.getElementById("burger-menu");
  menu.classList.add("d_none");
  document.removeEventListener("click", closeWhenClickedOutside);
}

function closeWhenClickedOutside(event) {
  const menu = document.getElementById("burger-menu");
  const guestIcon = document.getElementById("profileCircle");
  if (!menu.contains(event.target) && !guestIcon.contains(event.target)) {
    CloseBurgerMenu();
  }
}

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
      console.error("Fehler beim Parsen von loginUser:", err);
    }
  }

  const initialsElement = document.getElementById("initials");
  if (initialsElement) {
    initialsElement.textContent = initials;
  }
}

function getInitials(name) {
  const nameParts = name.trim().split(" ");
  let initials = "";
  for (let i = 0; i < nameParts.length && i < 2; i++) {
    initials += nameParts[i].charAt(0).toUpperCase();
  }
  return initials;
}

function logout() {
  localStorage.removeItem("loggedInUser");
}
