let container = document.getElementById("task-card-container");
let shadow = document.getElementById("shadow-container");
let tasks = [];
let updateTasks;
let tasksPriority;
let currentDraggedElement = null;
let subtasksContent;
let colorLabels;
let contactColor;
let searchInput = document.getElementById("searchInput");
let currentFilter = "";
let toDoContainer = document.querySelector(".to-do");
let inProgressContainer = document.querySelector(".in-progress");
let awaitFeedbackContainer = document.querySelector(".await-feedback");
let doneContainer = document.querySelector(".done");
let addTaskScriptInjected = false;
function updateBoardContent() {
  let cols = [
    { container: toDoContainer, emptyText: "No tasks To do" },
    { container: inProgressContainer, emptyText: "No tasks In Progress" },
    { container: awaitFeedbackContainer, emptyText: "No tasks Await Feedback" },
    { container: doneContainer, emptyText: "No tasks Done" },
  ];
  cols.forEach(({ container }) => {
    let dropArea = container.querySelector(".drag-area");
    if (dropArea) {
      dropArea
        .querySelectorAll(".task, .empty-placeholder")
        .forEach((node) => node.remove());
    }
  });

  tasks
    .filter((task) => {
      return (
        task &&
        (!currentFilter || task.title.toLowerCase().startsWith(currentFilter))
      );
    })
    .forEach((task) => {
      let card = createCardElement(task);

      let dropArea;
      switch (task.status) {
        case "toDo":
          dropArea = toDoContainer.querySelector(".drag-area");
          break;
        case "inProgress":
          dropArea = inProgressContainer.querySelector(".drag-area");
          break;
        case "awaitFeedback":
          dropArea = awaitFeedbackContainer.querySelector(".drag-area");
          break;
        case "done":
          dropArea = doneContainer.querySelector(".drag-area");
          break;
        default:
          return;
      }
      dropArea.appendChild(card);
      openTaskDetails();
      updateSubtaskProgress(task.subtasks, card);
    });

  enableTiltOnDrag(".task");
  insertTemplateIfEmpty();
}

searchInput.addEventListener("input", () => {
  let q = searchInput.value.trim().toLowerCase();
  currentFilter = q.length >= 3 ? q : "";
  updateBoardContent();
});
function createCardElement(task) {
  let html = generateTodoHTML(
    task,
    getImageForPriority(task.priority),
    getInitialsList(task.assigned.name),
    getColoredLabels(task.category)
  );
  let template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function openAddTaskOverlay() {
  if (!container) return;
  container.innerHTML = addTasks();
  let old = document.getElementById("add-task-script");
  if (old) old.remove();
  let s = document.createElement("script");
  s.id = "add-task-script";
  s.src = "../scripts/add-task.js";
  s.async = false;
  s.onload = () => {
    if (typeof window.addTaskInit === "function") {
      window.addTaskInit();
    }
  };
  document.body.appendChild(s);
  container.classList.add("show-from-right");
  shadow.style.display = "block";
}

function openTaskDetails() {
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
        colorLabels = getColoredLabels(task.category);
        tasksPriority = getImageForPriority(task.priority);
        let assigned = generateAssignedCardOverlay(task.assigned);
        subtasksContent = generateSubtaskHTML(task.subtasks);
        container.innerHTML = boardTaskOverlay(
          task,
          tasksPriority,
          assigned,
          subtasksContent,
          colorLabels
        );
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
  }, 500);
}

async function init() {
  tasks = await getTasksFromRemoteStorage("/tasks");
  if (tasks === undefined) {
    tasks = standartTasks;
    await saveTasksToRemoteStorage("/tasks", tasks);
  }
  updateTask();
  openTaskDetails();
  let addBtn = document.querySelector(".add-task");
  let plusButton = document.querySelectorAll(".add-task-icon");
  if (addBtn) {
    addBtn.addEventListener("click", openAddTaskOverlay);
    plusButton.forEach((btn) => {
      btn.addEventListener("click", openAddTaskOverlay);
    });
  }
}

async function updateTask() {
  let columns = ["toDo", "inProgress", "awaitFeedback", "done"];
  columns.forEach((col) => {
    let filtered = tasks.filter((t) => t && t.status === col);
    let container = document.getElementById(col);
    container.innerHTML = "";
    filtered.forEach((task) => {
      contactColor = JSON.stringify(task.color);
      tasksPriority = getImageForPriority(task.priority);
      let assigned = getInitialsList(task.assigned);
      colorLabels = getColoredLabels(task.category);
      container.innerHTML += generateTodoHTML(
        task,
        tasksPriority,
        assigned,
        colorLabels,
        contactColor
      );
      openTaskDetails(task);
      let lastTask = container.lastElementChild;
      updateSubtaskProgress(task.subtasks, lastTask);
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
  document.querySelectorAll(".drag-area").forEach((area) => {
    area.querySelectorAll(".empty-placeholder").forEach((n) => n.remove());
    if (!area.querySelector(".task")) {
      let html = templeteNotTasks(area.id);
      let wrapper = document.createElement("div");
      wrapper.classList.add("empty-placeholder");
      wrapper.innerHTML = html;
      area.appendChild(wrapper);
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
  let cardContainer = document.querySelectorAll(".card-drag-drop-container");
  let elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    el.addEventListener("dragstart", () => {
      el.classList.add("tilt-on-drag");
      cardContainer.forEach((container) => {
        container.style.height = container.offsetHeight + 250 + "px";
        container.style.boxShadow = "inset 0 0 0 2px rgba(0, 0, 0, 0.15)";
      });
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("tilt-on-drag");
      cardContainer.forEach((container) => {
        container.style.height = "auto";
        container.style.boxShadow = "";
      });
    });
  });
}

function deleteTasksOfOverlay(id) {
  let deleteButton = document.querySelector(".delete");
  if (!deleteButton) return;
  deleteButton.addEventListener("click", async () => {
    closeContainerOverlay();
    try {
      await deleteTasksToRemoteStorage(`/tasks/${id}`);
      tasks = tasks.filter((task) => task && task.id !== id);
      updateTask();
    } catch (error) {
      console.error(error);
    }
  });
}

//------------------------------------------------------------------------------------
//unter sind die Funktionen für das Editieren von Tasks

function initAddTaskForm(id) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (typeof window.addTaskInit === "function") {
        window.addTaskInit();
      }

      const oldBtn = document.getElementById("add-task-button-create-task");
      if (oldBtn) {
        const newBtn = oldBtn.cloneNode(true);
        newBtn.onclick = () => valueTasksToEditTasks(id);
        oldBtn.replaceWith(newBtn);
      }

      preFillTaskForm(id);
    });
  });
}
function editTaskOfOverlay(id) {
  let currentEditId = id;
  const taskOverlay = document.getElementById("task-card-container");
  const taskCardContainer = document.getElementById("task-overlay");
  const editButton = document.getElementsByClassName("edit")[0];
  if (taskCardContainer) {
    editButton.addEventListener("click", () => {
      taskOverlay.innerHTML = "";
      taskOverlay.innerHTML = editTasksOfBoard(id);
      injectAddTask(currentEditId);
    });
  }
}

function injectAddTask(currentEditId) {
  const old = document.getElementById("add-task-script");
  const script = document.createElement("script");
  if (!old) {
    script.id = "add-task-script";
    script.src = "../scripts/add-task.js";
    script.onload = () => {
      initAddTaskForm(currentEditId);
    };
  }
  document.body.appendChild(script);
  shadow.style.display = "block";
  container.classList.add("show-from-right");
}

function preFillTaskForm(id) {
  console.log(tasks);

  let task = tasks.find((t) => t?.id === id);

  if (!task) return;
  document.getElementById("add-task-title-input").value = task.title;
  document.getElementById("add-task-description-textarea").value =
    task.description;
  const dateInput = document.getElementById("add-task-due-date-input");
  dateInput.value = task.date;
  if (dateInput.value) dateInput.classList.add("date-selected");
  addTaskPrioButtonClick(task.priority);
  const categoryText = document.getElementById("categoryDropdownSelectedText");
  categoryText.textContent = task.category;
  getContactsFromRemoteStorage().then(() => {
    resultContactList.forEach((contact, i) => {
      if (task.assigned.includes(contact.name)) {
        assignedCheckbox[i].checkbox = true;
        const checkboxDiv = document.getElementById(
          "ATContact-option-checkbox" + i
        );
        if (checkboxDiv) {
          checkboxDiv.classList.remove("ATContact-option-checkbox");
          checkboxDiv.classList.add("ATContact-option-checkbox-checked");
        }
      }
    });
    updateChosenInitials();
  });

  subtasks = task.subtasks.map((st) => st.title);
  subtaskRender();
}

async function valueTasksToEditTasks(id) {
  const title = document.getElementById("add-task-title-input").value.trim();
  const description = document
    .getElementById("add-task-description-textarea")
    .value.trim();
  const date = document.getElementById("add-task-due-date-input").value.trim();
  const category = document
    .getElementById("categoryDropdownSelectedText")
    .textContent.trim();
  const assigned = getAssignedContacts();
  const priority = prioButtonState;
  const subtasksArray = getSubtasksArray();

  let isValid = true;

  if (!title) {
    document.getElementById("add-task-title-input").classList.add("error");
    document.getElementById("title-required").classList.remove("d_none");
    isValid = false;
  }

  if (!date) {
    document.getElementById("add-task-due-date-input").classList.add("error");
    document.getElementById("due-date-required").classList.remove("d_none");
    isValid = false;
  }

  if (category === "Select a category") {
    document.getElementById("categoryDropdownSelected").classList.add("error");
    document.getElementById("category-required").classList.remove("d_none");
    isValid = false;
  }
  const selected = getAssignedContacts();
  const assignedWithColor = selected.map((item) => {
    const name = typeof item === "string" ? item : item.name;
    const dummy = contactsDummy.find((c) => c.name === name);
    const color = dummy ? dummy.profilcolor : "#000000";
    return { name, color };
  });

  if (!isValid) return;
  const updatedTask = {
    id,
    title,
    description,
    date: date,
    priority,
    status: tasks.find((t) => t?.id === id)?.status || "toDo",
    category,
    assigned: assignedWithColor,
    subtasks: subtasksArray,
  };
  await editTasksToRemoteStorage(`/tasks/${id}`, updatedTask);
  const index = tasks.findIndex((t) => t?.id === id);
  if (index !== -1) {
    tasks[index] = updatedTask;
  }
  closeContainerOverlay();
  updateTask();
}

// --------------------------------------------------------------------------------------------------

function getImageForPriority(priority) {
  let imageMap = {
    Medium: "../assets/icons/priority-medium.png",
    Low: "../assets/icons/low-medium.png",
    Urgent: "../assets/icons/urgent-medium.png",
  };
  return imageMap[priority] || "../assets/icons/low-medium.png";
}

function generateAssignedCardOverlay(assignedList) {
  if (!Array.isArray(assignedList)) return "";

  let result = "";
  for (let i = 0; i < assignedList.length; i++) {
    let person = assignedList[i];
    let name = person?.name;
    if (typeof name !== "string" || !name.trim()) continue;

    let initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    result += `
      <div class="assigned-content" >
        <span class="logo" style="background-color: ${person.color}">${initials}</span>
        <span class="name">${name}</span>
      </div>
    `;
  }
  return result;
}

function getInitialsList(assignedList) {
  if (!Array.isArray(assignedList)) return "";

  return assignedList

    .filter((person) => person && typeof person.name === "string")
    .map((person) => {
      let initials = person.name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
      return `
        <div class="assignees" style="background-color: ${person.color}">
          <span>${initials}</span>
        </div>
      `;
    })
    .join("");
}

function updateSubtaskProgress(subtasksVolume, container) {
  let total = subtasksVolume.length;
  let completed = subtasksVolume.filter((t) => t.done === true).length;

  let percent = total === 0 ? 0 : (completed / total) * 100;

  container.querySelector(".col-bar").style.width = percent + "%";
  container.querySelector(
    "#nr-progress-tasks"
  ).textContent = `${completed}/${total} Subtasks`;
}

function generateSubtaskHTML(subtasks) {
  return subtasks
    .map((subtask, index) => {
      let checked = subtask.done ? "checked" : "";
      let id = index + 1;
      return `
      <div class="subtask-container">
        <input
          class="checkbox"
          type="checkbox"
          id="${id}"
          name="task${id}"
          value="task${id}"
          ${checked}
        />
        <label> ${subtask.title}</label><br />
      </div>
    `;
    })
    .join("");
}
function getColoredLabels(items) {
  let color = "";
  if (items === "User Story") {
    color = "#0038FF";
  } else if (items === "Technical Task") {
    color = "#1FD7C1";
  }
  return color;
}
