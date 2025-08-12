/**
 * Initializes all event listeners for the Add Task form.
 */
function addTaskEventInit() {
  initInputValidationEvents();
  initSubtaskInputEvents();
  initAddTaskButtonEvent();
  initDropdownEvents();
  initDueDateInputEvent();
  initDocumentClickEvents();
  initCalendarIconEvent();
}


/**
 * Initializes input validation events for title and due date.
 */
function initInputValidationEvents() {
  ATTitleRef.addEventListener("input", checkRequiredFieldsAndToggleButton);
  ATDueDateRef.addEventListener("input", checkRequiredFieldsAndToggleButton);
  ATTitleRef.addEventListener("blur", validateTitle);
  ATDueDateRef.addEventListener("blur", validateDueDate);
}


/**
 * Initializes events for the subtask input field.
 */
function initSubtaskInputEvents() {
  ATSubtaskInput.addEventListener("focus", showClearAndDoneButtons);
  ATSubtaskInput.addEventListener("blur", hideClearAndDoneButtons);
  ATSubtaskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTaskAddSubtask();
    }
  });
}


/**
 * Initializes the event for the Add Task button.
 */
function initAddTaskButtonEvent() {
  ATButtonAddTaskRef.addEventListener("click", function (event) {
    if (!validateAddTaskInputs()) {
      event.preventDefault();
    } else {
      sendAddTaskData();
    }
  });
}


/**
 * Initializes dropdown open/close events.
 */
function initDropdownEvents() {
  categoryDropdownSelected.addEventListener("click", function (event) {
    event.stopPropagation();
    categoryDropdownOpen = !categoryDropdownOpen;
    categoryDropdownMenu.style.display = categoryDropdownOpen ? "block" : "none";
    categoryDropdownArrow.classList.toggle("open", categoryDropdownOpen);
  });

  dropdownSelected.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownOpen = !dropdownOpen;
    dropdownMenu.style.display = dropdownOpen ? "block" : "none";
    dropdownArrow.classList.toggle("open", dropdownOpen);
  });
}


/**
 * Initializes the due date input event for styling.
 */
function initDueDateInputEvent() {
  ATdueDateInput.addEventListener("input", function () {
    if (this.value) {
      this.classList.add("date-selected");
    } else {
      this.classList.remove("date-selected");
    }
  });
}


/**
 * Initializes document click events to close dropdowns when clicking outside.
 */
function initDocumentClickEvents() {
  document.addEventListener("click", function (e) {
    if (!customDropdownWrapper.contains(e.target)) {
      dropdownMenu.style.display = "none";
      dropdownArrow.classList.remove("open");
      dropdownOpen = false;
    }
    if (!categoryDropdownWrapper.contains(e.target)) {
      categoryDropdownMenu.style.display = "none";
      categoryDropdownArrow.classList.remove("open");
      categoryDropdownOpen = false;
    }
  });
}


/**
 * Initializes the calendar icon click event to focus the date input.
 */
function initCalendarIconEvent() {
  const calendarIcon = document.querySelector(".calendar-icon");
  if (calendarIcon) {
    calendarIcon.addEventListener("click", function () {
      const input = document.getElementById("add-task-due-date-input");
      input.focus();
      if (input.showPicker) input.showPicker();
    });
  }
}
