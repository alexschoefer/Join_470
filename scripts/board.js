let container = document.getElementById("task-card-container");
let shadow = document.getElementById("shadow-container");
let tasks = [];
let updateTasks;
let tasksPriority;
let currentDraggedElement = null;

function openTaskDetails(task) {
  let tasksCards = document.querySelectorAll(".card");
  if (!tasksCards.length) return;
  tasksCards.forEach((card) => {
    card.addEventListener("click", () => {
      let taskData = card.dataset.task;
      if (!taskData) return;
      try {
        let task = JSON.parse(taskData);
        shadow.style.display = "block";
        container.classList.remove("hide-to-right");
        tasksPriority = getImageForPriority(task.priority);
        container.innerHTML = boardTaskOverlay(task, tasksPriority);
        container.classList.add("show-from-right");
        deleteTasksOfOverlay(task.id);
        editTaskOfOverlay(task.id);
      } catch (error) {
        console.error("Error parsing task data:", error);
      }
    });
  });
}

function closeContainerOverlay() {
  shadow.style.display = "none";
  container.classList.remove("show-from-right");
  setTimeout(() => {
    container.innerHTML = "";
  }, 200);
}

async function init() {
  tasks = await getTasksFromRemoteStorage("/tasks");
  if (tasks === undefined) {
    tasks = standartTasks;
    await saveTasksToRemoteStorage("/tasks", tasks);
  }
  updateTask();
  openTaskDetails();
}

async function updateTask() {
  let columns = ["toDo", "inProgress", "awaitFeedback", "done"];
  columns.forEach((col) => {
    let filtered = tasks.filter((t) => t && t.status === col);
    let container = document.getElementById(col);
    container.innerHTML = "";
    filtered.forEach((task) => {
      tasksPriority = getImageForPriority(task.priority);
      container.innerHTML += generateTodoHTML(task, tasksPriority);
      openTaskDetails(task);
    });
  });
  enableTiltOnDrag(".task");
  insertTemplateIfEmpty();
}

function startDragging(id) {
  currentDraggedElement = parseInt(id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(category) {
  let taskIndex = tasks.findIndex(
    (task) => task && task.id === currentDraggedElement
  );
  if (taskIndex !== -1) {
    tasks[taskIndex].status = category;
    await saveTasksToRemoteStorage("/tasks", tasks);
    updateTask();
  }
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
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

function enableTiltOnDrag(selector) {
  let elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    el.addEventListener("dragstart", () => {
      el.classList.add("tilt-on-drag");
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("tilt-on-drag");
    });
  });
}
// --------------------------------------------------
function deleteTasksOfOverlay(id) {
  let taskCardContainer = document.getElementById("task-overlay");
  let deleteButton = document.getElementsByClassName("delete")[0];
  if (taskCardContainer) {
    deleteButton.addEventListener("click", () => {
      closeContainerOverlay();
      setTimeout(() => {
        deleteTasksToRemoteStorage(`/tasks/${id}`);
      }, 100);
    });
  }
}
function editTaskOfOverlay(id) {
  let taskOverlay = document.getElementById("task-card-container");
  let taskCardContainer = document.getElementById("task-overlay");
  let editButton = document.getElementsByClassName("edit")[0];
  if (taskCardContainer) {
    editButton.addEventListener("click", () => {
      taskOverlay.innerHTML = "";
      taskOverlay.innerHTML = editTasksOfBoard(id);
    });
  }
}
async function valueTasksToEditTasks(id) {
  let title = document.getElementById("add-task-title-input").value;
  let description = document.getElementById(
    "add-task-description-textarea"
  ).value;
  let date = document.getElementById("add-task-due-date-input").value;
  let subtasks = document.getElementById("add-task-subtasks-input").value;
  updateTasks = {
    title: title,
    description: description,
    date: date,
    subtasks: subtasks,
  };
  await editTasksToRemoteStorage(`/tasks/${id}`, updateTasks);
  closeContainerOverlay();
}
function getImageForPriority(priority) {
  const imageMap = {
    Medium: "../assets/icons/priority-medium.png",
    Low: "../assets/icons/low-medium.png",
    Urgent: "../assets/icons/urgent-medium.png",
  };
  return imageMap[priority] || "../assets/icons/low-icon.png";
}
