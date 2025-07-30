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
 * Shows an error message if the field is empty.
 * @returns {boolean} true if the field is filled, otherwise false.
 */
function validateDueDate() {
    if (!ATDueDateRef.value.trim()) {
        ATDueDateRef.classList.add('error');
        document.getElementById('due-date-required').classList.remove('d_none');
        return false;
    } else {
        ATDueDateRef.classList.remove('error');
        document.getElementById('due-date-required').classList.add('d_none');
        return true;
    }
}


/**
 * Validates whether a category has been selected.
 * Shows an error message if the default category is still selected.
 * @returns {boolean} true if a category is selected, otherwise false.
 */
function validateCategory() {
    console.log('validateCategory aufgerufen');
    const selectedText = ATcategory.textContent;
    console.log('Kategorie:', selectedText);
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
    return valid;
}
