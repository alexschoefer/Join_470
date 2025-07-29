function addTaskInit() {
  window.ATTitleRef = document.getElementById("add-task-title-input");
  window.ATDescriptionRef = document.getElementById(
    "add-task-description-textarea"
  );
  window.ATDueDateRef = document.getElementById("add-task-due-date-input");
  window.ATButtonPrioButtonUrgentRef = document.getElementById(
    "add-task-prio-button-urgent"
  );
  window.ATButtonPrioButtonMediumRef = document.getElementById(
    "add-task-prio-button-medium"
  );
  window.ATButtonPrioButtonLowRef = document.getElementById(
    "add-task-prio-button-low"
  );
  window.ATAssignToRef = document.getElementById("add-task-assign-to");
  window.ATSubtasksRef = document.getElementById("add-task-subtasks");
  window.ATSubtaskInput = document.getElementById("add-task-subtasks-input");
  window.ATButtonAddTaskRef = document.getElementById(
    "add-task-button-create-task"
  );
  window.ATButtonCancelRef = document.getElementById("add-task-cancel-button");
  window.allSubtasks = document.getElementById("allSubtasks");
  window.ATButtonUrgentRef = document.getElementById(
    "add-task-prio-button-urgent"
  );
  window.ATButtonUrgentPicRef = document.getElementById(
    "add-task-prio-button-urgent-picture"
  );
  window.ATButtonMediumRef = document.getElementById(
    "add-task-prio-button-medium"
  );
  window.ATButtonMediumPicRef = document.getElementById(
    "add-task-prio-button-medium-picture"
  );
  window.ATButtonLowRef = document.getElementById("add-task-prio-button-low");
  window.ATButtonLowPicRef = document.getElementById(
    "add-task-prio-button-low-picture"
  );
  window.ATSubtasksInputDivRef = document.getElementById(
    "add-task-subtasks-input-div"
  );
  window.ATSubtasksIconAddRef = document.getElementById(
    "add-task-subtasks-icon-add"
  );
  window.dropdownSelected = document.getElementById("customDropdownSelected");
  window.dropdownMenu = document.getElementById("add-task-assigned-to-select");
  window.dropdownArrow = document.getElementById("customDropdownArrow");
  window.dropdownSelectedText = document.getElementById(
    "customDropdownSelectedText"
  );
  window.chosenDiv = document.getElementById(
    "add-task-assigned-to-chosen-initials"
  );
  window.categoryDropdownSelected = document.getElementById(
    "categoryDropdownSelected"
  );
  window.categoryDropdownMenu = document.getElementById(
    "add-task-category-select"
  );
  window.categoryDropdownArrow = document.getElementById(
    "categoryDropdownArrow"
  );
  window.categoryDropdownWrapper = document.getElementById(
    "categoryDropdownWrapper"
  );
  window.categoryRequired = document.getElementById("category-required");
  window.customDropdownWrapper = document.getElementById(
    "customDropdownWrapper"
  );
  window.ATdueDateInput = document.getElementById("add-task-due-date-input");
  window.ATcategory = document.getElementById("categoryDropdownSelectedText");

  window.categoryDropdownOpen = false;
  window.dropdownOpen = false;
  window.prioButtonState = "Medium";
  window.subtasks = [""];
  window.subtasksObject = {};
  window.assignedCheckbox = [];
  window.resultContactList = [];
  // if (typeof addTaskValidationInit === "function") addTaskValidationInit();
  if (typeof addTaskEventInit === "function") addTaskEventInit();

  getContactsFromRemoteStorage();
  loadCategoryOptions();
}

/**
 * Initialisiert das Add-Task-Formular, lädt Kontakte und Kategorien.
 */
// function addTaskInit() {
// getContactsFromRemoteStorage();
// loadCategoryOptions();
// }

/**
 * Initialisiert das Add-Task-Formular, lädt Kontakte und Kategorien.
 */
async function sendAddTaskData() {
  saveUserInputsForFirebase();
  startTaskAddedFinishAnimation();
  setTimeout(() => {
    resetAddTaskForm();
  }, 1100);
}

/**
 * Sammelt alle Benutzereingaben aus dem Formular und sendet sie an Firebase.
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
  await postAddTaskDataToFirebase(
    title,
    description,
    date,
    priority,
    status,
    assignTo,
    category,
    subtasks,
    colorTo
  );
}

/**
 * Sendet die neue Task an Firebase.
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
 * @returns {Promise<Object>} Die gespeicherte Task
 */
async function postAddTaskDataToFirebase(
  title,
  description,
  date,
  priority,
  status,
  assignTo,
  category,
  subtasks,
  colorTo
) {
  const nextId = await getNextTaskId();
  const assigned = combineAssignedWithColors(assignTo, colorTo);
  const newTask = buildTaskData(
    nextId,
    title,
    description,
    date,
    priority,
    status,
    assigned,
    category,
    subtasks
  );
  return await sendTaskToFirebase(nextId, newTask);
}

/**
 * Sendet ein Task-Objekt an Firebase.
 * @async
 * @param {number} nextId - Die ID der neuen Task.
 * @param {Object} newTask - Das Task-Objekt.
 * @returns {Promise<Object>} Die gespeicherte Task
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
 * Setzt den Status der Prio-Buttons und ruft die passende Styling-Funktion auf.
 * @param {string} state - "Urgent", "Medium" oder "Low"
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
 * Fügt ein neues Subtask hinzu, setzt das Subtask-Eingabefeld zurück. und rendert die Liste neu.
 */
function addTaskAddSubtask() {
  subtasksToArray();
  ATSubtaskInput.value = "";
  ADSShowIcons();
}

/**
 * Holt den aktuellen Wert aus dem Subtask-Eingabefeld und fügt ihn dem Subtask-Array hinzu.
 */
function subtasksToArray() {
  const inputData = document.getElementById("add-task-subtasks-input").value;
  subtasks.push(inputData);
  subtaskRender();
}

/**
 * Rendert alle Subtasks im DOM.
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
 * Entfernt ein Subtask anhand des Index und rendert die Liste neu.
 * @param {number} index - Index des zu löschenden Subtasks.
 */
function deleteAddTaskSubtask(index) {
  subtasks.splice(index, 1);
  subtaskRender(index);
}

/**
 * Startet die Abschlussanimation nach dem Hinzufügen einer Task.
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
 * Leert das Subtask-Eingabefeld und zeigt das Plus-Icon wieder an.
 */
function clearAddTaskSubtask() {
  ATSubtaskInput.value = "";
  ATSubtasksIconAddRef.classList.remove("d_none");
}

/**
 * Setzt den aktuellen Subtask als "done" zurück in die normale Ansicht.
 * @param {number} id - Die ID des Subtasks.
 */
function getDoneAddTaskSubtask(id) {
  const ATSubSubtaskContainerRef = document.getElementById(
    "ATSubtask-container-" + id
  );
  const addTaskSubtasksIconDoneRef = document.getElementById(
    "add-task-subtasks-icon-done-" + id
  );
  const ATSubSubtaskIconEditRef = document.getElementById(
    "add-task-subtasks-icon-edit-" + id
  );
  const ATSubSubtaskIconsRef = document.getElementById(
    "add-task-subtasks-icons-" + id
  );
  const ATSubLiRef = document.getElementById("ATSubLi" + id);
  ATSubSubtaskContainerRef.blur();
  ATSubLiRef.classList.remove("d_none");
  ATSubSubtaskIconsRef.classList.remove("fdrr");
  ATSubSubtaskIconEditRef.classList.remove("d_none");
  addTaskSubtasksIconDoneRef.classList.add("d_none");
}

/**
 * Aktiviert den Bearbeitungsmodus für ein Subtask.
 * @param {number} id - Die ID des Subtasks.
 */
function editAddTaskSubtask(id) {
  const ATSubSubtaskContainerRef = document.getElementById(
    "ATSubtask-container-" + id
  );
  const ATSubSubtaskIconEditRef = document.getElementById(
    "add-task-subtasks-icon-edit-" + id
  );
  const ATSubSubtaskIconsRef = document.getElementById(
    "add-task-subtasks-icons-" + id
  );
  const addTaskSubtasksIconDoneRef = document.getElementById(
    "add-task-subtasks-icon-done-" + id
  );
  const ATSubLiRef = document.getElementById("ATSubLi" + id);
  ATSubLiRef.classList.add("d_none");
  ATSubSubtaskContainerRef.focus();
  ATSubSubtaskIconsRef.classList.add("fdrr");
  ATSubSubtaskIconEditRef.classList.add("d_none");
  addTaskSubtasksIconDoneRef.classList.remove("d_none");
}

/**
 * Zeigt die "Clear" und "Done" Buttons für das Subtask-Eingabefeld an.
 */
function showClearAndDoneButtons() {
  ATSubtasksInputDivRef.classList.remove("d_none");
  ATSubtasksIconAddRef.classList.add("d_none");
}

/**
 * Blendet die "Clear" und "Done" Buttons für das Subtask-Eingabefeld aus.
 */
function hideClearAndDoneButtons() {
  ATSubtasksInputDivRef.classList.add("d_none");
  ATSubtasksIconAddRef.classList.remove("d_none");
}

/**
 * Setzt den Fokus in das Subtask-Eingabefeld und blendet das Plus-Icon aus.
 */
function getFocusInSubtasksInput() {
  document.getElementById("add-task-subtasks-input").focus();
  ATSubtasksIconAddRef.classList.add("d_none");
}

/**
 * Steuert das Anzeigen und Verstecken der Subtask-Icons beim Hovern über Subtasks.
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
 * Setzt das gesamte Add-Task-Formular zurück.
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
  loadCategoryOptions();
}

/**
 * Erstellt eine Kategorie-Option für das Dropdown-Menü.
 * @param {Object} cat - Kategorie-Objekt mit value und label.
 * @returns {HTMLElement} Das erzeugte Option-Element.
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
 * Lädt die verfügbaren Kategorien in das Dropdown-Menü.
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
