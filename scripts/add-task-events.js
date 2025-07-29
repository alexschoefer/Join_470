function addTaskEventInit() {
  ATTitleRef.addEventListener("input", checkRequiredFieldsAndToggleButton);
  ATDueDateRef.addEventListener("input", checkRequiredFieldsAndToggleButton);
  ATTitleRef.addEventListener("blur", validateTitle);
  ATDueDateRef.addEventListener("blur", validateDueDate);
  ATSubtaskInput.addEventListener("focus", showClearAndDoneButtons);
  ATSubtaskInput.addEventListener("blur", hideClearAndDoneButtons);

  ATSubtaskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTaskAddSubtask();
    }
  });

  ATButtonAddTaskRef.addEventListener("click", function (event) {
    if (!validateAddTaskInputs()) {
      event.preventDefault();
    } else {
      sendAddTaskData();
    }
  });

  categoryDropdownSelected.addEventListener("click", function (event) {
    event.stopPropagation();
    categoryDropdownOpen = !categoryDropdownOpen;
    categoryDropdownMenu.style.display = categoryDropdownOpen
      ? "block"
      : "none";
    categoryDropdownArrow.classList.toggle("open", categoryDropdownOpen);
  });

  dropdownSelected.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownOpen = !dropdownOpen;
    dropdownMenu.style.display = dropdownOpen ? "block" : "none";
    dropdownArrow.classList.toggle("open", dropdownOpen);
  });

  ATdueDateInput.addEventListener("input", function () {
    if (this.value) {
      this.classList.add("date-selected");
    } else {
      this.classList.remove("date-selected");
    }
  });

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

  const calendarIcon = document.querySelector(".calendar-icon");
  if (calendarIcon) {
    calendarIcon.addEventListener("click", function () {
      const input = document.getElementById("add-task-due-date-input");
      input.focus();
      if (input.showPicker) input.showPicker();
    });
  }
}
