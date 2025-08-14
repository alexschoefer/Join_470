/**
 * Sends the entered task data to Firebase and starts the finish animation.
 * @async
 */
async function sendAddTaskData() {
  saveUserInputsForFirebase();
  startTaskAddedFinishAnimation();
  setTimeout(() => {
    resetAddTaskForm();
  }, 1100);
}


/**
 * Collects all user inputs from the form and sends them to Firebase.
 * @async
 */
async function saveUserInputsForFirebase() {
  let title = ATTitleRef.value;
  let description = ATDescriptionRef.value;
  let date = ATDueDateRef.value;
  let priority = prioButtonState;
  let status = "toDo";
  let assignTo = getAssignedContacts();
  let colorTo = getAssignedColor();
  let category = ATcategory.textContent;
  let subtasks = getSubtasksArray();
  await postAddTaskDataToFirebase(title, description, date, priority, status, assignTo, category, subtasks, colorTo);
}


/**
 * Sends the new task to Firebase.
 * @async
 * @param {string} title
 * @param {string} description
 * @param {string} date
 * @param {string} priority
 * @param {string} status
 * @param {string[]} assignTo
 * @param {string} category
 * @param {Object[]} subtasks
 * @param {string[]} colorTo
 * @returns {Promise<Object>} The saved task
 */
async function postAddTaskDataToFirebase( title, description, date, priority, status, assignTo, category, subtasks, colorTo) {
  const nextId = await getNextTaskId();
  const assigned = combineAssignedWithColors(assignTo, colorTo);
  const newTask = buildTaskData(
    nextId, title, description, date, priority, status, assigned, category, subtasks
  );
  return await sendTaskToFirebase(nextId, newTask);
}


/**
 * Sends a task object to Firebase.
 * @async
 * @param {number} nextId - The ID of the new task.
 * @param {Object} newTask - The task object.
 * @returns {Promise<Object>} The saved task
 */
async function sendTaskToFirebase(nextId, newTask) {
  let response = await fetch(`${fetchURLDataBase}/tasks/${nextId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });
  return await response.json();
}


/**
 * Sets the state of the prio buttons and calls the corresponding styling function.
 * @param {string} state - "Urgent", "Medium" or "Low"
 */
function addTaskPrioButtonClick(state) {
  prioButtonState = state;
  if (state == "Urgent") {
    holdButtonUrgent();
  }
  if (state == "Medium") {
    holdButtonMedium();
  }
  if (state == "Low") {
    holdButtonLow();
  }
}


/**
 * Applies the "Urgent" priority button styles.
 * Highlights the urgent button and icon, and removes highlight from the others.
 */
function holdButtonUrgent() {
  ATButtonLowPicRef.classList.remove(
    "add-task-priority-button-low-pic-pressed"
  );
  ATButtonMediumPicRef.classList.remove(
    "add-task-priority-button-medium-pic-pressed"
  );
  ATButtonUrgentPicRef.classList.add(
    "add-task-priority-button-urgent-pic-pressed"
  );
  ATButtonUrgentRef.classList.add("add-task-priority-button-urgent");
  ATButtonMediumRef.classList.remove("add-task-priority-button-medium");
  ATButtonLowRef.classList.remove("add-task-priority-button-low");
}


/**
 * Applies the "Medium" priority button styles.
 * Highlights the medium button and icon, and removes highlight from the others.
 */
function holdButtonMedium() {
  ATButtonUrgentPicRef.classList.remove(
    "add-task-priority-button-urgent-pic-pressed"
  );
  ATButtonLowPicRef.classList.remove(
    "add-task-priority-button-low-pic-pressed"
  );
  ATButtonMediumPicRef.classList.add(
    "add-task-priority-button-medium-pic-pressed"
  );
  ATButtonUrgentRef.classList.remove("add-task-priority-button-urgent");
  ATButtonMediumRef.classList.add("add-task-priority-button-medium");
  ATButtonLowRef.classList.remove("add-task-priority-button-low");
}


/**
 * Applies the "Low" priority button styles.
 * Highlights the low button and icon, and removes highlight from the others.
 */
function holdButtonLow() {
  ATButtonUrgentPicRef.classList.remove(
    "add-task-priority-button-urgent-pic-pressed"
  );
  ATButtonMediumPicRef.classList.remove(
    "add-task-priority-button-medium-pic-pressed"
  );
  ATButtonLowPicRef.classList.add("add-task-priority-button-low-pic-pressed");
  ATButtonUrgentRef.classList.remove("add-task-priority-button-urgent");
  ATButtonMediumRef.classList.remove("add-task-priority-button-medium");
  ATButtonLowRef.classList.add("add-task-priority-button-low");
}


/**
 * Adds a new subtask, resets the subtask input field, and re-renders the list.
 */
function addTaskAddSubtask() {
  subtasksToArray();
  ATSubtaskInput.value = "";
  ADSShowIcons();
}


/**
 * Gets the current value from the subtask input field and adds it to the subtask array.
 */
function subtasksToArray() {
  const inputData = document.getElementById("add-task-subtasks-input").value;
  subtasks.push(inputData);
  subtaskRender();
}


/**
 * Renders all subtasks in the DOM.
 */
function subtaskRender() {
  allSubtasks.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    let subtaski = subtasks[i];
    if (subtaski !== "") {
      allSubtasks.innerHTML += addSubtaskTemplate(i, subtaski);
    }
  }
  ADSShowIcons();
}


/**
 * Removes a subtask by index and re-renders the list.
 * @param {number} index - Index of the subtask to delete.
 */
function deleteAddTaskSubtask(index) {
  subtasks.splice(index, 1);
  subtaskRender(index);
}


/**
 * Starts the finish animation after adding a task.
 */
function startTaskAddedFinishAnimation() {
  const animationContainer = document.getElementById(
    "add-task-finish-animation"
  );
  if (animationContainer) {
    animationContainer.classList.remove("d_none");
  }
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 1000);
}


/**
 * Clears the subtask input field and shows the plus icon again.
 */
function clearAddTaskSubtask() {
  ATSubtaskInput.value = "";
  ATSubtasksIconAddRef.classList.remove("d_none");
}


/**
 * Sets the current subtask as "done" and returns to the normal view.
 * @param {number} id - The ID of the subtask.
 */
function getDoneAddTaskSubtask(id) {
  const ATSubSubtaskContainerRef = document.getElementById("ATSubtask-container-" + id);
  const addTaskSubtasksIconDoneRef = document.getElementById("add-task-subtasks-icon-done-" + id);
  const ATSubSubtaskIconEditRef = document.getElementById("add-task-subtasks-icon-edit-" + id);
  const ATSubSubtaskIconsRef = document.getElementById("add-task-subtasks-icons-" + id);
  const ATSubLiRef = document.getElementById("ATSubLi" + id);
  ATSubSubtaskContainerRef.blur();
  ATSubLiRef.classList.remove("d_none");
  ATSubSubtaskIconsRef.classList.remove("fdrr");
  ATSubSubtaskIconEditRef.classList.remove("d_none");
  addTaskSubtasksIconDoneRef.classList.add("d_none");
}


/**
 * Activates the edit mode for a subtask.
 * @param {number} id - The ID of the subtask.
 */
function editAddTaskSubtask(id) {
  const ATSubSubtaskContainerRef = document.getElementById("ATSubtask-container-" + id);
  const ATSubSubtaskIconEditRef = document.getElementById("add-task-subtasks-icon-edit-" + id);
  const ATSubSubtaskIconsRef = document.getElementById("add-task-subtasks-icons-" + id);
  const addTaskSubtasksIconDoneRef = document.getElementById("add-task-subtasks-icon-done-" + id);
  const ATSubLiRef = document.getElementById("ATSubLi" + id);
  ATSubLiRef.classList.add("d_none");
  ATSubSubtaskContainerRef.focus();
  ATSubSubtaskIconsRef.classList.add("fdrr");
  ATSubSubtaskIconEditRef.classList.add("d_none");
  addTaskSubtasksIconDoneRef.classList.remove("d_none");
}


/**
 * Shows the "Clear" and "Done" buttons for the subtask input field.
 */
function showClearAndDoneButtons() {
  ATSubtasksInputDivRef.classList.remove("d_none");
  ATSubtasksIconAddRef.classList.add("d_none");
}


/**
 * Hides the "Clear" and "Done" buttons for the subtask input field.
 */
function hideClearAndDoneButtons() {
  ATSubtasksInputDivRef.classList.add("d_none");
  ATSubtasksIconAddRef.classList.remove("d_none");
}


/**
 * Sets the focus in the subtask input field and hides the plus icon.
 */
function getFocusInSubtasksInput() {
  document.getElementById("add-task-subtasks-input").focus();
  ATSubtasksIconAddRef.classList.add("d_none");
}


/**
 * Controls the display and hiding of subtask icons when hovering over subtasks.
 */
function ADSShowIcons() {
  document.querySelectorAll(".add-task-subtask-style").forEach((container) => {
    const icons = container.querySelector(".add-task-subtasks-icons");
    if (icons) {
      icons.classList.add("d_none");
      container.addEventListener("mouseenter", () => {
        icons.classList.remove("d_none");
      });
      container.addEventListener("mouseleave", () => {
        icons.classList.add("d_none");
      });
    }
  });
}


/**
 * Resets the entire Add Task form.
 */
function resetAddTaskForm() {
  ATTitleRef.value = "";
  ATDescriptionRef.value = "";
  ATDueDateRef.value = "";
  allSubtasks.innerHTML = "";
  ATSubtaskInput.value = "";
  ATcategory.textContent = "Select a category";
  assignedCheckbox.forEach((item) => (item.checkbox = false));
  updateChosenInitials();
  getContactsFromRemoteStorage();
  loadCategoryOptions();
}


/**
 * Creates a category option for the dropdown menu.
 * @param {Object} cat - Category object with value and label.
 * @returns {HTMLElement} The created option element.
 */
function createCategoryOption(cat) {
  const option = document.createElement("div");
  option.className = "ATcustom-dropdown-option";
  option.dataset.value = cat.value;
  option.innerHTML = `<span class="ATContact-option-name">${cat.label}</span>`;
  option.addEventListener("click", function (event) {
    event.stopPropagation();
    ATcategory.textContent = cat.label;
    checkRequiredFieldsAndToggleButton();
    categoryDropdownMenu.style.display = "none";
    categoryDropdownArrow.classList.remove("open");
  });
  return option;
}


/**
 * Loads the available categories into the dropdown menu.
 */
function loadCategoryOptions() {
  categoryDropdownMenu.innerHTML = "";
  const categories = [
    { value: "Technical Task", label: "Technical Task" },
    { value: "User Story", label: "User Story" },
  ];
  categories.forEach((cat) => {
    const option = createCategoryOption(cat);
    categoryDropdownMenu.appendChild(option);
  });
}
