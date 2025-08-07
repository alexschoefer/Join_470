/**
 * Returns an array of column definitions mapping container elements to statuses.
 * @returns {{container: Element, status: string}[]} Array of column objects
 */
function getColumns() {
  return [
    { container: toDoContainer, status: "toDo" },
    { container: inProgressContainer, status: "inProgress" },
    { container: awaitFeedbackContainer, status: "awaitFeedback" },
    { container: doneContainer, status: "done" },
  ];
}

/**
 * Starts dragging for the given task id.
 * @param {number|string} id - Task identifier
 */
function startDragging(id) {
  currentDraggedElement = +id;
}

/**
 * Checks if drag-and-drop should be enabled based on viewport width.
 * @returns {boolean} True if enabled
 */
function isDragDropEnabled() {
  return window.innerWidth > 1441;
}

/**
 * Allows drop if drag-and-drop is enabled.
 * @param {DragEvent} ev - Drag event
 */
function allowDrop(ev) {
  if (!isDragDropEnabled()) return;
  ev.preventDefault();
}

/**
 * Moves the current dragged task to a new category and persists change.
 * @async
 * @param {string} category - Target status/category
 */
async function moveTo(category) {
  let idx = tasks.findIndex((t) => t && t.id === currentDraggedElement);
  if (idx > -1) {
    tasks[idx].status = category;
    await saveTasksToRemoteStorage("/tasks", tasks);
    updateTask();
  }
}

/**
 * Highlights the drag area of the given column id.
 * @param {string} id - Column container id
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes highlight from the drag area of the given column id.
 * @param {string} id - Column container id
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Inserts an empty placeholder in columns with no tasks.
 */
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

/**
 * Enables tilt animation on dragstart and dragend for card elements.
 * @param {string} selector - CSS selector for draggable elements
 */
function enableTiltOnDrag(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    let containers = document.querySelectorAll(".card-drag-drop-container");
    el.addEventListener("dragstart", () => {
      el.classList.add("tilt-on-drag");
      containers.forEach((c) => {
        c.style.height = c.offsetHeight + 250 + "px";
        c.style.boxShadow = "inset 0 0 0 2px rgba(0,0,0,0.15)";
      });
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("tilt-on-drag");
      containers.forEach((c) => {
        c.style.height = "auto";
        c.style.boxShadow = "";
      });
    });
  });
}

/**
 * Sets draggable attribute on all task elements based on viewport.
 */
function updateDraggables() {
  document
    .querySelectorAll(".task")
    .forEach((el) => (el.draggable = isDragDropEnabled()));
}

/**
 * Attaches dropdown (action menu) toggles to all cards.
 */
function attachToCardDropdown(card) {
  let btn = card.querySelector(".card-drop-down-button");
  if (!btn || btn.dataset._dropdownAttached) return;
  btn.dataset._dropdownAttached = "true";
  btn.addEventListener("click", (e) => handleDropdownClick(e, card, btn));
}

/**
 * Handles click on dropdown button: positions and shows menu.
 * @param {MouseEvent} e - Click event
 * @param {Element} card - Task card element
 * @param {Element} btn - Dropdown button
 */
function handleDropdownClick(e, card, btn) {
  e.stopPropagation();
  closeCurrentActionMenu();
  if (card.contains(currentOpenMenu)) return;
  let menu = createActionMenu(card);
  positionMenu(menu, btn, card);
  card.appendChild(menu);
  currentOpenMenu = menu;
  setTimeout(
    () =>
      document.addEventListener("click", (ev) => outsideClick(ev, menu, btn)),
    0
  );
}
