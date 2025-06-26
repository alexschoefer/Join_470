function render() {
  getCurrentDate();
}

function getCurrentDate() {
  const greating = document.getElementById("dategreating");
  const now = new Date();
  const hour = now.getHours();

  if (hour <= 12) {
    greating.innerHTML = "Good Morning";
  } else if (hour <= 18 && hour > 12) {
    greating.innerHTML = "Good Afternoon";
  } else if (hour > 18) {
    greating.innerHTML = "Good Evening";
  }
}
