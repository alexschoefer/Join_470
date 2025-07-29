async function render() {
  setGreetingAndName();
  await getTasks();
  await getTasksInProgress();
  await getTasksAwaitFeedback();
  await getTasksToDo();
  await getTasksDone();
  await getTaskUrgent();
  await getUrgentDate();
  enableBoxNavigation();
}

let tasksURL =
  "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";

/**
 * Sets a greeting and user name in the header.
 * Shows only the greeting if the user is a guest.
 * Reads user data from localStorage.
 * Updates #dategreating and #username-text.
 */
function setGreetingAndName() {
  const greetingEl = document.getElementById("dategreating");
  const nameEl = document.getElementById("username-text");
  if (!greetingEl || !nameEl) return;
  const greeting = getCurrentGreeting();
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  const userName = userData?.name;
  const isGuest =
    !userName || ["gast", "guest"].includes(userName.toLowerCase());
  if (!isGuest) {
    greetingEl.innerText = `${greeting},`;
    nameEl.innerText = ` ${userName}`;
  } else {
    greetingEl.innerText = greeting;
    nameEl.innerText = "";
  }
}

/**
 * Returns a greeting based on the current time.
 * Morning: 0–12, Afternoon: 13–18, Evening: 19–23.
 * Uses the local system time.
 * @returns {string} Greeting text
 */
function getCurrentGreeting() {
  const now = new Date();
  const hour = now.getHours();
  if (hour <= 12) return "Good Morning";
  if (hour <= 18) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Sets the current greeting inside #dategreating.
 * Uses getCurrentGreeting() for the text.
 * Updates DOM directly.
 * @returns {void}
 */
function getCurrentDate() {
  const greetingEl = document.getElementById("dategreating");
  greetingEl.innerText = getCurrentGreeting();
}

/**
 * Loads all tasks from the database and counts them.
 * Displays the total in the #tasks-in-board element.
 * Falls back to 0 on error.
 * @returns {Promise<void>}
 */
async function getTasks() {
  const taskscount = document.getElementById("tasks-in-board");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    count = Object.keys(data).length;
    taskscount.innerText = count;
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskscount.innerText = "0";
  }
}

/**
 * Counts all tasks with status "inProgress" from the database.
 * Displays the result in the #tasks-in-progress element.
 * Sets count to 0 on error.
 * @returns {Promise<void>}
 */
async function getTasksInProgress() {
  const taskscount = document.getElementById("tasks-in-progress");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task && task.status === "inProgress"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskscount.innerText = "0";
  }
}

/**
 * Counts all tasks with status "awaitFeedback" from the database.
 * Updates the #tasks-await-feedback element with the count.
 * Sets count to 0 if an error occurs.
 * @returns {Promise<void>}
 */
async function getTasksAwaitFeedback() {
  const taskscount = document.getElementById("tasks-await-feedback");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task && task.status === "awaitFeedback"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskscount.innerText = "0";
  }
}

/**
 * Counts all tasks with status "toDo" from the database.
 * Displays the result in the #to-do element.
 * Falls back to 0 on error.
 * @returns {Promise<void>}
 */
async function getTasksToDo() {
  const taskscount = document.getElementById("to-do");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task && task.status === "toDo"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskscount.innerText = "0";
  }
}

/**
 * Counts all tasks with status "done" from the database.
 * Updates the #done element with the total count.
 * Sets count to 0 if loading fails.
 * @returns {Promise<void>}
 */
async function getTasksDone() {
  const taskscount = document.getElementById("done");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task && task.status === "done"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskscount.innerText = "0";
  }
}

/**
 * Counts all tasks with priority "Urgent" from the database.
 * Displays the number in the #urgent-tasks element.
 * Falls back to 0 if an error occurs.
 * @returns {Promise<void>}
 */
async function getTaskUrgent() {
  const taskscount = document.getElementById("urgent-tasks");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task && task.priority === "Urgent"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskscount.innerText = "0";
  }
}

/**
 * Finds the earliest due date among tasks with priority "Urgent".
 * Displays it in the #deadline-date element using formatDate().
 * If no valid date is found or an error occurs, shows fallback text.
 * @returns {Promise<void>}
 */
async function getUrgentDate() {
  const el = document.getElementById("deadline-date");
  try {
    const res = await fetch(tasksURL);
    const data = await res.json();
    const urgentDates = Object.values(data)
      .filter((t) => t?.priority === "Urgent" && t.date)
      .map((t) => new Date(t.date))
      .filter((d) => !isNaN(d))
      .sort((a, b) => a - b);
    el.innerText = urgentDates.length
      ? formatDate(urgentDates[0])
      : "No Urgent Date";
  } catch (err) {
    console.error("Error loading tasks:", err);
    el.innerText = "Error";
  }
}

/**
 * Formats a Date object into a readable US-style date string.
 * Example output: "October 16, 2022".
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Initializes the app once the DOM is fully loaded.
 * Triggers the main render() function.
 */
document.addEventListener("DOMContentLoaded", () => {
  render();
});

/**
 * Makes all summary boxes clickable and redirects to board page.
 */
function enableBoxNavigation() {
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    box.style.cursor = "pointer";
    box.addEventListener("click", () => {
      window.location.href = "./board.html";
    });
  });
}

/**
 * Displays a welcome overlay on small screens for first-time users.
 * Checks localStorage for the "showWelcomeOnce" flag.
 * Loads the user's name and greeting, unless the user is a guest.
 */
document.addEventListener("DOMContentLoaded", () => {
  const showWelcome = localStorage.getItem("showWelcomeOnce") === "true";
  if (!showWelcome || window.innerWidth >= 700) return;
  localStorage.removeItem("showWelcomeOnce");
  const greeting = getCurrentGreeting();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = user?.name;
  const guest = !name || ["gast", "guest"].includes(name.toLowerCase());
  showWelcomeOverlay(greeting, guest ? "" : name);
});

/**
 * Displays a temporary welcome overlay with a greeting and user name.
 * Fades out automatically after a short delay.
 * @param {string} greeting - The greeting text (e.g., "Good Morning").
 * @param {string} name - The user's name or an empty string for guests.
 */
function showWelcomeOverlay(greeting, name) {
  const o = document.getElementById("welcome-overlay");
  document.getElementById("welcome-text").innerText = `${greeting},`;
  document.getElementById("name-text").innerText = name;
  o.classList.remove("hidden");
  setTimeout(() => o.classList.add("fade-out"), 1500);
  setTimeout(() => {
    o.classList.add("hidden");
    o.classList.remove("fade-out");
  }, 3000);
}
