let container = document.getElementById("task-card-container");
let currentOpenMenu = null;
let shadow = document.getElementById("shadow-container");
let tasks = [];
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


/**
 * Creates and appends a task card element to the appropriate column.
 * Also opens its details overlay and updates its subtask progress bar.
 * @param {Object} task - Task object from tasks list
 * @param {string} task.status - Status of the task (toDo, inProgress, etc.)
 * @param {Object[]} task.subtasks - Array of subtask objects
 */
function appendTaskToBoard(task) {
  let card = createCardElement(task);
  let area = getColumns()
    .find((c) => c.status === task.status)
    ?.container.querySelector(".drag-area");
  if (!area) return;
  area.appendChild(card);
  openTaskDetails();
  updateSubtaskProgress(task.subtasks, card);
}


/**
 * Clears existing task and placeholder nodes from each provided column.
 * @param {{container: Element}[]} cols - Array of column objects
 */
function clearColumns(cols) {
  cols.forEach(({ container }) => {
    container
      .querySelector(".drag-area")
      ?.querySelectorAll(".task, .empty-placeholder")
      .forEach((n) => n.remove());
  });
}


/**
 * Generates a DOM element for a task card based on its data.
 * @param {Object} task - Task object
 * @returns {Element} The card element
 */
function createCardElement(task) {
  let assignedHtml = getInitialsList(task.assigned);
  let html = generateTodoHTML(
    task,
    getImageForPriority(task.priority),
    assignedHtml,
    getColoredLabels(task.category)
  );
  let template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/**
 * Filters and processes a list of tasks, executing a callback for each match.
 * @param {Object[]} list - Array of task objects
 * @param {string} filter - Lowercase search filter text
 * @param {function(Object): void} cb - Callback to execute for each matching task
 */
function processTasks(list, filter, cb) {
  list
    .filter((t) => t && (!filter || t.title.toLowerCase().startsWith(filter)))
    .forEach(cb);
}


/**
 * Refreshes the task board by clearing and re-appending tasks based on current filter.
 */
function updateBoardContent() {
  clearColumns(getColumns());
  processTasks(tasks, currentFilter, appendTaskToBoard);
  enableTiltOnDrag(".task");
  insertTemplateIfEmpty();
}


// Search input filter handling
searchInput.addEventListener("input", () => {
  let q = searchInput.value.trim().toLowerCase();
  currentFilter = q.length >= 3 ? q : "";
  updateBoardContent();
});


/**
 * Initializes application: loads tasks, saves defaults if missing,
 * and updates UI handlers.
 * @async
 */
async function init() {
  pushDummyTasksToRemoteStorage();
  let loadedTasks = await getTasksFromRemoteStorage("/tasks");
  if (!loadedTasks || loadedTasks.length === 0) {
    tasks = standartTasks;
    await saveTasksToRemoteStorage("/tasks", tasks);
  } else {
    tasks = loadedTasks;
  }
  updateTask();
  openTaskDetails();
  attachAddTaskHandlers();
}


/**
 * Populates a column container with tasks matching its status.
 * @param {string} col - Status name corresponding to column id
 */
function populateColumn(col) {
  let cont = document.getElementById(col);
  cont.innerHTML = "";
  tasks
    .filter((t) => t && t.status === col)
    .forEach((task) => {
      contactColor = JSON.stringify(task.color);
      tasksPriority = getImageForPriority(task.priority);
      cont.innerHTML += generateTodoHTML(
        task,
        tasksPriority,
        getInitialsList(task.assigned),
        getColoredLabels(task.category),
        contactColor
      );
      openTaskDetails(task);
      updateSubtaskProgress(task.subtasks, cont.lastElementChild);
    });
}


/**
 * Updates all columns, drag settings, placeholders, and dropdown menus.
 * @async
 */
async function updateTask() {
  ["toDo", "inProgress", "awaitFeedback", "done"].forEach(populateColumn);
  enableTiltOnDrag(".task");
  insertTemplateIfEmpty();
  attachDropdownsToCards();
}


/**
 * Attaches click handlers to "Add Task" buttons to open overlay or navigate.
 */
function attachAddTaskHandlers() {
  let addBtn = document.querySelector(".add-task");
  let plusButtons = document.querySelectorAll(".add-task-icon");
  if (!addBtn) return;
  let handler = (e) => {
    if (window.innerWidth <= 1020) {
      e.preventDefault();
      window.location.href = "../html/add-task.html";
    } else {
      openAddTaskOverlay(e);
    }
  };
  addBtn.addEventListener("click", handler);
  plusButtons.forEach((btn) => btn.addEventListener("click", handler));
}


/**
 * Converts internal status names to human-readable labels.
 * @param {string} name - Status key
 * @returns {string} Formatted status label
 */
function formatName(name) {
  let map = {
    toDo: "To Do",
    inProgress: "In Progress",
    awaitFeedback: "Await Feedback",
    done: "Done",
  };
  return map[name] || name;
}


/**
 * Customizes "Add Task" form submit to handle editing existing tasks.
 * @param {number|string} id - Task id being edited
 */
function initAddTaskForm(id) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      let oldBtn = document.getElementById("add-task-button-create-task");
      if (!oldBtn) return;
      let newBtn = oldBtn.cloneNode(true);
      newBtn.onclick = () => valueTasksToEditTasks(id);
      oldBtn.replaceWith(newBtn);
      preFillTaskForm(id);
    });
  });
}


/**
 * Maps priority levels to corresponding icon image URLs.
 * @param {string} priority - Priority label (e.g., "Medium", "Low", "Urgent")
 * @returns {string} URL of priority icon
 */
function getImageForPriority(priority) {
  let imageMap = {
    Medium: "../assets/icons/priority-medium.png",
    Low: "../assets/icons/low-medium.png",
    Urgent: "../assets/icons/urgent-medium.png",
  };
  return imageMap[priority] || imageMap.Low;
}


/**
 * Returns a hex color code for a given task category.
 * @param {string} category - Task category name
 * @returns {string} Hex color string
 */
function getColoredLabels(category) {
  if (category === "User Story") return "#0038FF";
  if (category === "Technical Task") return "#1FD7C1";
  return "";
}


/**
 * Updates the visual progress bar and text for subtasks within a task card.
 * @param {Object[]} subtasks - Array of subtask objects
 * @param {Element} container - Card element containing subtask UI
 */
function updateSubtaskProgress(subtasks, container) {
  // Sicherstellen, dass subtasks ein Array ist
  if (!Array.isArray(subtasks)) {
    subtasks = []; // Leeres Array, um Absturz zu vermeiden
  }

  let total = subtasks.length;
  let doneCount = subtasks.filter((s) => s.done).length;
  let pct = total ? (doneCount / total) * 100 : 0;

  const bar = container.querySelector(".col-bar");
  const progressText = container.querySelector("#nr-progress-tasks");

  if (bar) bar.style.width = pct + "%";
  if (progressText) progressText.textContent = `${doneCount}/${total} Subtasks`;
}


/**
 * Generates HTML string for a list of subtasks with checkboxes.
 * @param {{title: string, done: boolean}[]} subtasks - List of subtask objects
 * @returns {string} HTML markup string
 */
function generateSubtaskHTML(subtasks) {
  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    return "";
  }
  return subtasks
    .map(
      (st, i) => `
    <div class="subtask-container">
      <input type="checkbox" class="checkbox" id="${i + 1}" ${
        st.done ? "checked" : ""
      }/>
      <label>${st.title}</label>
    </div>`
    )
    .join("");
}


/**
 * Closes the currently open action menu if present.
 */
function closeCurrentActionMenu() {
  if (currentOpenMenu) {
    currentOpenMenu.remove();
    currentOpenMenu = null;
  }
}


/**
 * Positions an action menu relative to its trigger button and card.
 * @param {Element} menu - Menu element to position
 * @param {Element} btn - Button that triggered the menu
 * @param {Element} card - Card containing the button/menu
 */
function positionMenu(menu, btn, card) {
  menu.style.position = "absolute";
  menu.style.top = `${btn.offsetTop + btn.offsetHeight + 6}px`;
  let offsetRight = card.offsetWidth - (btn.offsetLeft + btn.offsetWidth);
  menu.style.right = `${offsetRight}px`;
}


/**
 * Sets up click listener to close menu when clicking outside.
 * @param {MouseEvent} ev - Click event
 * @param {Element} menu - Menu element
 * @param {Element} btn - Button that opened menu
 */
function outsideClick(ev, menu, btn) {
  if (!menu.contains(ev.target) && ev.target !== btn) {
    closeCurrentActionMenu();
    document.removeEventListener("click", (ev) => outsideClick(ev, menu, btn));
  }
}


/**
 * Builds HTML options for moving a task between statuses.
 * @param {string} currentStatus - Task's current status
 * @returns {string} HTML string for menu options
 */
function buildMoveOptions(currentStatus) {
  let flow = ["toDo", "inProgress", "awaitFeedback", "done"];
  let labels = {
    toDo: "To-do",
    inProgress: "In progress",
    awaitFeedback: "Review",
    done: "Done",
  };
  let idx = flow.indexOf(currentStatus);
  let prev = idx > 0 ? flow[idx - 1] : null;
  let next = idx < flow.length - 1 ? flow[idx + 1] : null;
  if (!prev && !next)
    return ["toDo", "awaitFeedback"]
      .map(
        (status) =>
          `<div class="menu-option" data-status="${status}"><span class="arrow">${
            status === "toDo" ? "↑" : "↓"
          }</span> ${labels[status]}</div>`
      )
      .join("");
  return [prev, next]
    .filter(Boolean)
    .map(
      (status) =>
        `<div class="menu-option" data-status="${status}"><span class="arrow">${
          status === prev ? "↑" : "↓"
        }</span> ${labels[status]}</div>`
    )
    .join("");
}


/**
 * Attaches click listeners to menu options to move tasks between statuses.
 * @param {Element} menu - Action menu element
 * @param {Element} card - Task card element containing data-task attribute
 */
function attachMenuListeners(menu, card) {
  menu.querySelectorAll(".menu-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      let newStatus = opt.dataset.status;
      let task = JSON.parse(card.dataset.task);
      if (task.status === newStatus) return closeCurrentActionMenu();
      task.status = newStatus;
      let i = tasks.findIndex((t) => t && t.id === task.id);
      if (i > -1) {
        tasks[i] = task;
        editTasksToRemoteStorage(`/tasks/${task.id}`, task)
          .then(updateTask)
          .catch(console.error);
      }
      closeCurrentActionMenu();
    });
  });
}


/**
 * Safely retrieves the status field from a card's data-task JSON.
 * @param {Element} card - Task card element
 * @returns {string} Task status or empty string on error
 */
function getTaskStatus(card) {
  try {
    return JSON.parse(card.dataset.task).status;
  } catch {
    return "";
  }
}

