async function render() {
  getCurrentDate();
  await getTasks();
  await getTasksInProgress();
  await getTasksAwaitFeedback();
  await getTasksToDo();
  await getTasksDone();
  await getTaskUrgent();
  await getUrgentDate();
}

let tasksURL =
  "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";

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
        (task) => task && task.status === "inProgress"
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
        (task) => task && task.status === "awaitFeedback"
      ).length;
    }
    taskscount.innerText = count;
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
        (task) => task && task.status === "toDo"
      ).length;
    }
    taskscount.innerText = count;
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
        (task) => task && task.status === "done"
      ).length;
    }
    taskscount.innerText = count;
  } catch (error) {
    console.error("Fehler beim Laden der Done:", error);
    taskscount.innerText = "0";
  }
}

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
    console.error("Fehler beim Laden der Urgent Tasks:", error);
    taskscount.innerText = "0";
  }
}

async function getUrgentDate() {
  const el = document.getElementById("deadline-date");

  try {
    const res = await fetch(tasksURL);
    const data = await res.json();

    let frühstesDatum = null;

    for (let key in data) {
      const aufgabe = data[key];
      if (!aufgabe) continue;
      const d = aufgabe.dueDate?.trim();

      if (
        aufgabe.priority === "Urgent" &&
        d &&
        d.length === 8 &&
        !isNaN(Number(d))
      ) {
        const jahr = d.slice(0, 4);
        const monat = d.slice(4, 6);
        const tag = d.slice(6, 8);
        const datum = new Date(Number(jahr), Number(monat) - 1, Number(tag));

        if (frühstesDatum === null || datum < frühstesDatum) {
          frühstesDatum = datum;
        }
      }
    }

    if (frühstesDatum) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      el.innerText = frühstesDatum.toLocaleDateString("en-US", options);
    } else {
      el.innerText = "No Urgent Date";
    }
  } catch (err) {
    console.log("Fehler:", err);
    el.innerText = "Fehler";
  }
}
