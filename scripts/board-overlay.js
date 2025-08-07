/**
 * Displays the overlay and prevents background scrolling.
 */
function showOverlay() {
  shadow.style.display = "block";
  document.body.style.overflow = "hidden";
  container.classList.add("show-from-right", "addtask-card-container");
}

/**
 * Initializes the add-task overlay by injecting the form HTML and
 * invoking any page-specific initialization function.
 */
function setupAddTask() {
  container.innerHTML = addTasks();
  if (typeof window.addTaskInit === "function") window.addTaskInit();
}

/**
 * Opens the add-task overlay or navigates to a separate page on small screens.
 * @param {Event} e - Click event that triggered the overlay
 */
function openAddTaskOverlay(e) {
  if (!container) return;
  if (window.innerWidth <= 1020) {
    e?.preventDefault();
    // Navigate to dedicated add-task page on narrow viewports
    return void (window.location.href = "../html/add-task.html");
  }
  setupAddTask();
  showOverlay();
}

/**
 * Parses a task object from a card's data-task attribute.
 * @param {Element} card - DOM element representing the task card
 * @returns {Object|null} Parsed task object or null on failure
 */
function parseTask(card) {
  let data = card.dataset.task;
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing task data:", e);
  }
  return null;
}

/**
 * Renders full task details in the overlay for viewing or editing.
 * @param {Object} task - Task data object
 * @param {Element} card - Source card element for updating progress bar
 */
function displayTaskDetails(task, card) {
  let labels = getColoredLabels(task.category);
  let priorityImg = getImageForPriority(task.priority);
  let assignedHTML = generateAssignedCardOverlay(task.assigned);
  let subtasksHTML = generateSubtaskHTML(task.subtasks);
  container.innerHTML = boardTaskOverlay(
    task,
    priorityImg,
    assignedHTML,
    subtasksHTML,
    labels
  );
}

/**
 * Attaches listeners to subtask checkboxes to update completion state
 * and persist changes to remote storage.
 * @param {Object} task - Task object containing subtasks array
 * @param {Element} card - Original card element for updating UI
 */
function attachSubtaskListeners(task, card) {
  container.querySelectorAll(".subtasks-input .checkbox").forEach((cb, i) => {
    cb.addEventListener("change", async () => {
      task.subtasks[i].done = cb.checked;
      await editTasksToRemoteStorage(`/tasks/${task.id}`, task);
      let idx = tasks.findIndex((t) => t?.id === task.id);
      if (idx > -1) tasks[idx] = task;
      card.dataset.task = JSON.stringify(task);
      updateSubtaskProgress(task.subtasks, card);
    });
  });
}

/**
 * Sets up click handlers on each card to open detailed view overlay.
 */
function openTaskDetails() {
  let cards = document.querySelectorAll(".card");
  if (!cards.length) return;
  cards.forEach((card) =>
    card.addEventListener("click", () => {
      let task = parseTask(card);
      if (!task) return;
      showOverlay();
      displayTaskDetails(task, card);
      deleteTasksOfOverlay(task.id);
      editTaskOfOverlay(task.id);
      attachSubtaskListeners(task, card);
    })
  );
}

/**
 * Closes the overlay, restores scrolling, and clears content after animation.
 */
function closeContainerOverlay() {
  shadow.style.display = "none";
  container.classList.remove("show-from-right", "addtask-card-container");
  document.body.style.overflow = "auto";
  setTimeout(() => {
    container.innerHTML = "";
  }, 500);
}

/**
 * Attaches delete button handler within overlay to remove a task.
 * @param {number|string} id - ID of the task to delete
 */
function deleteTasksOfOverlay(id) {
  let btn = document.querySelector(".delete");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    closeContainerOverlay();
    try {
      await deleteTasksToRemoteStorage(`/tasks/${id}`);
      tasks = tasks.filter((t) => t && t.id !== id);
      updateTask();
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Injects the edit form into the overlay and initializes it.
 * @param {number|string} id - ID of the task to edit
 */
function injectEditForm(id) {
  if (typeof window.addTaskInit === "function") window.addTaskInit();
  requestAnimationFrame(() => initAddTaskForm(id));
  showOverlay();
}

/**
 * Attaches edit button handler within overlay to switch to edit mode.
 * @param {number|string} id - ID of the task being edited
 */
function editTaskOfOverlay(id) {
  let overlay = document.getElementById("task-card-container");
  let btn = document.getElementsByClassName("edit")[0];
  if (overlay && btn) {
    btn.addEventListener("click", () => {
      overlay.innerHTML = editTasksOfBoard(id);
      injectEditForm(id);
    });
  }
}

/**
 * Pre-fills the add/edit task form fields based on existing task data.
 * @param {number|string} id - Task ID to load data for
 */
function preFillTaskForm(id) {
  let task = tasks.find((t) => t?.id === id);
  if (!task) return;
  fillBasicFields(task);
  setupContacts(task);
  setupSubtasks(task);
}

/**
 * Populates basic input fields (title, description, date, priority, category)
 * in the form for a given task.
 * @param {Object} task - Task object with basic properties
 */
function fillBasicFields(task) {
  document.getElementById("add-task-title-input").value = task.title;
  document.getElementById("add-task-description-textarea").value =
    task.description;
  let dateInput = document.getElementById("add-task-due-date-input");
  dateInput.value = task.dueDate;
  if (dateInput.value) dateInput.classList.add("date-selected");
  addTaskPrioButtonClick(task.priority);
  document.getElementById("categoryDropdownSelectedText").textContent =
    task.category;
}

/**
 * Marks already-assigned contacts in the form based on task data.
 * @param {Object} task - Task object containing assigned contacts
 */
function setupContacts(task) {
  getContactsFromRemoteStorage().then(() => {
    resultContactList.forEach((contact, i) => {
      let assignedList = Array.isArray(task.assigned) ? task.assigned : [];
      if (assignedList.some((a) => a.name === contact.name)) {
        assignedCheckbox[i].checkbox = true;
        let cbDiv = document.getElementById("ATContact-option-checkbox" + i);
        if (cbDiv)
          cbDiv.classList.replace(
            "ATContact-option-checkbox",
            "ATContact-option-checkbox-checked"
          );
      }
    });
    updateChosenInitials();
  });
}

/**
 * Renders existing subtasks into the form for editing.
 * @param {Object} task - Task object with subtasks array
 */
function setupSubtasks(task) {
  subtasks = task.subtasks.map((st) => st.title);
  subtaskRender();
}

/**
 * Retrieves current form input values as a task data object.
 * @param {number|string} id - Task ID context (unused here)
 * @returns {{title: string, description: string, dueDate: string, category: string, assigned: Array, priority: string, subtasksArray: Array}}
 */
function getFormValues(id) {
  return {
    title: document.getElementById("add-task-title-input").value.trim(),
    description: document
      .getElementById("add-task-description-textarea")
      .value.trim(),
    dueDate: document.getElementById("add-task-due-date-input").value.trim(),
    category: document
      .getElementById("categoryDropdownSelectedText")
      .textContent.trim(),
    assigned: getAssignedContacts(),
    priority: prioButtonState,
    subtasksArray: getSubtasksArray(),
  };
}

/**
 * Validates required form fields and marks errors in the UI.
 * @param {{title: string, dueDate: string, category: string}} values
 * @returns {boolean} True if form is valid
 */
function validateFormValues({ title, dueDate, category }) {
  let isValid = true;
  if (!title) {
    document.getElementById("add-task-title-input").classList.add("error");
    document.getElementById("title-required").classList.remove("d_none");
    isValid = false;
  }
  if (!dueDate) {
    document.getElementById("add-task-due-date-input").classList.add("error");
    document.getElementById("due-date-required").classList.remove("d_none");
    isValid = false;
  }
  if (category === "Select a category") {
    document.getElementById("categoryDropdownSelected").classList.add("error");
    document.getElementById("category-required").classList.remove("d_none");
    isValid = false;
  }
  return isValid;
}

/**
 * Gathers form values, validates, and submits updates for editing tasks.
 * @param {number|string} id - Task ID to update
 */
function valueTasksToEditTasks(id) {
  let values = getFormValues(id);
  if (!validateFormValues(values)) return;
  let updated = buildUpdatedTask(id, values);
  saveUpdatedTask(id, updated);
}

/**
 * Constructs a new task object from form values for saving.
 * @param {number|string} id - Task ID
 * @param {{title: string, description: string, dueDate: string, category: string, assigned: Array, priority: string, subtasksArray: Array}} values
 * @returns {Object} Task object ready to persist
 */
function buildUpdatedTask(
  id,
  { title, description, dueDate, category, assigned, priority, subtasksArray }
) {
  let oldSubtasks = tasks.find((t) => t.id === id)?.subtasks || [];

  let mergedSubtasks = subtasksArray.map((item) => {
    let text = typeof item === "string" ? item : item.title;
    let prev = oldSubtasks.find((st) => st.title === text);
    let done = prev
      ? prev.done
      : (typeof item === "object" && item.done) || false;
    return { title: text, done };
  });
  return {
    id,
    title,
    description,
    dueDate,
    priority,
    status: tasks.find((t) => t.id === id)?.status || "toDo",
    category,
    assigned: assigned.map((item) => {
      let name = typeof item === "string" ? item : item.name;
      let dummy = contactsDummy.find((c) => c.name === name);
      return { name, color: dummy ? dummy.profilcolor : "#000000" };
    }),
    subtasks: mergedSubtasks,
  };
}

/**
 * Persists the updated task to remote storage and refreshes the UI.
 * @param {number|string} id - Task ID
 * @param {Object} updatedTask - Task object to persist
 */
async function saveUpdatedTask(id, updatedTask) {
  await editTasksToRemoteStorage(`/tasks/${id}`, updatedTask);
  let idx = tasks.findIndex((t) => t?.id === id);
  if (idx > -1) tasks[idx] = updatedTask;
  closeContainerOverlay();
  updateTask();
}

/**
 * Generates HTML for displaying assigned users in the task overlay.
 * @param {Array<{name: string, color: string}>} assignedList
 * @returns {string} HTML string of assigned user entries
 */
function generateAssignedCardOverlay(assignedList) {
  if (!Array.isArray(assignedList)) return "";
  return assignedList
    .map((person) => {
      let initials = person.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();
      return `
      <div class="assigned-content">
        <span class="logo" style="background-color: ${person.color}">${initials}</span>
        <span class="name">${person.name}</span>
      </div>`;
    })
    .join("");
}

/**
 * Generates compact initials badges for assigned users on cards.
 * @param {Array<{name: string, color: string}>} assignedList
 * @returns {string} HTML string of initials badges
 */
function getInitialsList(assignedList) {
  if (!Array.isArray(assignedList)) return "";
  return assignedList
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
      </div>`;
    })
    .join("");
}

// Initialize on page load and bind resize events
window.addEventListener("resize", () => {
  updateDraggables();
  if (container.classList.contains("show-from-right")) {
    closeContainerOverlay();
  }
});
