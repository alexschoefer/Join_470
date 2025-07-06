
let contactsUrl = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";

function ShowBurgerMenu() {
  const menu = document.getElementById("burger-menu");
  menu.classList.toggle("d_none");
  if (!menu.classList.contains("d_none")) {
    document.addEventListener("click", closeWhenClickedOutside);
    const links = menu.querySelectorAll("a");
    links.forEach(link => {
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