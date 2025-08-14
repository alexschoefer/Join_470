/**
 * Validates the title input field for a new task.
 * Shows an error message if the field is empty.
 * @returns {boolean} true if the field is filled, otherwise false.
 */
function validateTitle() {
    if (!ATTitleRef.value.trim()) {
        ATTitleRef.classList.add('error');
        document.getElementById('title-required').classList.remove('d_none');
        return false;
    } else {
        ATTitleRef.classList.remove('error');
        document.getElementById('title-required').classList.add('d_none');
        return true;
    }
}


/**
 * Validates the due date input field for a new task.
 * Shows an error message if the field is empty or the date is in the past.
 * @returns {boolean} true if the field is filled and the date is valid, otherwise false.
 */
function validateDueDate() {
    const input = document.getElementById('add-task-due-date-input');
    const errorMsg = document.getElementById('due-date-required');
    if (!input) return false;

    if (!isDueDateFilled(input, errorMsg)) return false;
    if (!isDueDateInFuture(input, errorMsg)) return false;

    clearDueDateError(input, errorMsg);
    return true;
}


/**
 * Checks if the due date input is filled.
 * Shows an error message if not.
 * @param {HTMLInputElement} input - The due date input element.
 * @param {HTMLElement} errorMsg - The error message element.
 * @returns {boolean} true if filled, otherwise false.
 */
function isDueDateFilled(input, errorMsg) {
    if (!input.value) {
        input.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = "This field is required.";
            errorMsg.classList.remove('d_none');
        }
        return false;
    }
    return true;
}


/**
 * Checks if the due date is today or in the future.
 * Shows an error message if the date is in the past.
 * @param {HTMLInputElement} input - The due date input element.
 * @param {HTMLElement} errorMsg - The error message element.
 * @returns {boolean} true if the date is valid, otherwise false.
 */
function isDueDateInFuture(input, errorMsg) {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare only date

    if (selectedDate < today) {
        input.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = "You have to choose right date";
            errorMsg.classList.remove('d_none');
        }
        return false;
    }
    return true;
}


/**
 * Clears the error state and hides the error message for the due date input.
 * @param {HTMLInputElement} input - The due date input element.
 * @param {HTMLElement} errorMsg - The error message element.
 */
function clearDueDateError(input, errorMsg) {
    input.classList.remove('error');
    if (errorMsg) errorMsg.classList.add('d_none');
}


/**
 * Validates whether a category has been selected.
 * Shows an error message if the default category is still selected.
 * @returns {boolean} true if a category is selected, otherwise false.
 */
function validateCategory() {
    const selectedText = ATcategory.textContent;
    const defaultText = 'Select a category';
    if (selectedText === defaultText) {
        categoryDropdownSelected.classList.add('error');
        categoryRequired.classList.remove('d_none');
        return false;
    } else {
        categoryDropdownSelected.classList.remove('error');
        categoryRequired.classList.add('d_none');
        return true;
    }
}


/**
 * Validates all input fields for adding a task.
 * @returns {boolean} true if all fields are valid, otherwise false.
 */
function validateAddTaskInputs() {
    let valid = true;
    if (!validateTitle()) valid = false;
    if (!validateDueDate()) valid = false;
    if (!validateCategory()) valid = false;
    if(valid == true){
         initAddTaskButtonEvent();
    }
    return valid;
}