function render() {
  getCurrentDate();
  getTasks();
  getTasksInProgress();
  getTasksAwaitFeedback();
  getTasksToDo();
  getTasksDone();
}

let tasksURL =
  "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
console.log(tasksURL);
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

async function getTasks() {
  const taskscount = document.getElementById("tasks-in-board");

  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    count = Object.keys(data).length;
    taskscount.innerText = count;
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
    taskscount.innerText = "0";
  }
}

async function getTasksInProgress() {
  const taskscount = document.getElementById("tasks-in-progress");

  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task.status === "inProgress"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
    taskscount.innerText = "0";
  }
}

async function getTasksAwaitFeedback() {
  const taskscount = document.getElementById("tasks-await-feedback");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task.status === "awaitFeedback"
      ).length;
      taskscount.innerText = count;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
    taskscount.innerText = "0";
  }
}

async function getTasksToDo() {
  const taskscount = document.getElementById("to-do");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task.status === "toDo"
      ).length;
      taskscount.innerText = count;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Todo:", error);
    taskscount.innerText = "0";
  }
}

async function getTasksDone() {
  const taskscount = document.getElementById("done");
  try {
    const response = await fetch(tasksURL);
    const data = await response.json();
    let count = 0;
    if (data) {
      count = Object.values(data).filter(
        (task) => task.status === "done"
      ).length;
      taskscount.innerText = count;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Done:", error);
    taskscount.innerText = "0";
  }
}