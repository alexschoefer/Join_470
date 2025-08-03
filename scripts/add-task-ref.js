/**
 * Initializes all references and state variables for the Add Task form,
 * sets up event listeners, loads contacts and categories.
 * 
 * This function should be called once when the Add Task page is loaded.
 */
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