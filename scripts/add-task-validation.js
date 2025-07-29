/**
 * Validiert das Titel-Eingabefeld für eine neue Aufgabe.
 * Zeigt eine Fehlermeldung an, wenn das Feld leer ist.
 * @returns {boolean} true, wenn das Feld ausgefüllt ist, sonst false.
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
 * Validiert das Fälligkeitsdatum-Eingabefeld für eine neue Aufgabe.
 * Zeigt eine Fehlermeldung an, wenn das Feld leer ist.
 * @returns {boolean} true, wenn das Feld ausgefüllt ist, sonst false.
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
 * Validiert, ob eine Kategorie ausgewählt wurde.
 * Zeigt eine Fehlermeldung an, wenn die Standard-Kategorie noch ausgewählt ist.
 * @returns {boolean} true, wenn eine Kategorie ausgewählt ist, sonst false.
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
 * Validiert alle Eingabefelder für das Hinzufügen einer Aufgabe.
 * @returns {boolean} true, wenn alle Felder gültig sind, sonst false.
 */
function validateAddTaskInputs() {
    let valid = true;
    if (!validateTitle()) valid = false;
    if (!validateDueDate()) valid = false;
    if (!validateCategory()) valid = false;
    return valid;
}
