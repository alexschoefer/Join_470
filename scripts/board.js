// const BASE_URL = "https://join-470-default-rtdb.firebaseio.com";

// let card = {
//   tasks: [
//     {
//       name: "Kochwelt Page & Recipe Recommender",
//       description: "Build start page with recipe recommendation.",
//       due_date: "2025-06-25",
//       priority: "normal",
//       assigned: ["Ana Popescu", "Ion Ionescu"],
//       category: "Technical Task",
//       subtasks: [
//         { title: "Add login Formular", done: false },
//         { title: "Validation", done: false },
//       ],
//     },
//     {
//       name: "Design the Homepage",
//       description: "Create a wireframe for the main landing page",
//       due_date: "2025-07-01",
//       priority: "medium",
//       assigned: ["Maria Georgescu"],
//       category: "Technical Task ",
//       subtasks: [
//         { title: "Wireframe", done: true },
//         { title: "Prototip", done: false },
//       ],
//     },
//   ],
// };

// function onloadFunc() {
//   postCard("/card", card);
// }
// onloadFunc();

// async function loadData(path = "") {
//   let response = await fetch(BASE_URL + path + ".json");
//   let responseToJson = await response.json();
//   return responseToJson;
// }

// async function postCard(path = "", data = {}) {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   return (responseToJson = await response.json());
// }
let currentDraggedElement;
let container = document.getElementById("task-card-container");
let shadow = document.getElementById("shadow-container");

function containerOverlay() {
  shadow.style.display = "block";
  container.classList.remove("hide-to-right");
  container.innerHTML = boardTaskOverlay();
  container.classList.add("show-from-right");
}
function closeContainerOverlay() {
  shadow.style.display = "none";
  container.classList.remove("show-from-right");
  setTimeout(() => {
    container.innerHTML = "";
  }, 200);
}

let todos = [
  {
    id: 0,
    name: "Kochwelt Page & Recipe Recommender",
    category: "toDo",
  },
  {
    id: 1,
    name: "Kochwelt Page & Recipe Recommender",
    category: "toDo",
  },
  {
    id: 2,
    name: "Design the Homepage",
    category: "inProgress",
  },
  {
    id: 3,
    name: "Implement User Authentication",
    category: "awaitFeedback",
  },
  {
    id: 4,
    name: "Implement User Authentication",
    category: "done",
  },
];

function updateTask() {
  let categories = ["toDo", "inProgress", "awaitFeedback", "done"];

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let tasks = todos.filter((t) => t.category == category);
    let container = document.getElementById(category);
    container.innerHTML = "";
    for (let j = 0; j < tasks.length; j++) {
      let element = tasks[j];
      container.innerHTML += generateTodoHTML(element);
    }
  }
  enableTiltOnDrag(".task");
  insertTemplateIfEmpty();
}
function insertTemplateIfEmpty() {
  let dragAreas = document.querySelectorAll(".drag-area");
  dragAreas.forEach((area) => {
    if (area.innerHTML.trim() === "") {
      area.innerHTML = templeteNotTasks(area.id);
    }
  });
}
function formatName(name) {
  let map = {
    toDo: "To Do",
    inProgress: "In Progress",
    awaitFeedback: "Await Feedback",
    done: "Done",
  };
  return map[name] || name;
}

function startDragging(id) {
  currentDraggedElement = id;
}
function allowDrop(ev) {
  ev.preventDefault();
}
function moveTo(category) {
  todos[currentDraggedElement]["category"] = category;
  updateTask();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}
function enableTiltOnDrag(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    el.addEventListener("dragstart", () => {
      el.classList.add("tilt-on-drag");
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("tilt-on-drag");
    });
  });
}
