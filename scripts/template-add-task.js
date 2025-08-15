/**
 * Generates the HTML template for a subtask entry in the Add Task form.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} subtaski - The subtask text value.
 * @returns {string} The HTML string for the subtask template.
 */
function addSubtaskTemplate(i, subtaski) {
    return `<div id="add-task-subtask-template${i}" class="add-task-subtask-style">
    <div id="add-task-li-container" class="add-task-li-container">
        <li class="ATSubLi" id="ATSubLi${i}"></li>
    </div>
      <input id="ATSubtask-container-${i}" type="text" title="ATSubtask-container" class="ATSubtask-container"
                     value="${subtaski}">
                 <div class="add-task-subtasks-icons d_none" id="add-task-subtasks-icons-${i}">
                     <div id="add-task-subtasks-icon-edit-${i}" class="add-task-subtasks-icon-edit" onclick="editAddTaskSubtask(${i})">
                     </div>
                     <div id="add-task-subtasks-icon-done-${i}" class="add-task-subtasks-icon-done d_none" onclick="getDoneAddTaskSubtask(${i})">
                     </div>
                     <div class="add-task-subtasks-icons-divider">
                     </div>
                     <div id="add-task-subtasks-icon-delete-${i}" class="add-task-subtasks-icon-delete" onclick="deleteAddTaskSubtask(${i})">
                     </div>
                 </div>
             </div>`;
}


/**
 * Generates the HTML template for displaying a contact's initials with background color.
 *
 * @param {Object} contact - The contact object containing initials and color.
 * @param {string} contact.initial - The initials of the contact.
 * @param {string} contact.color - The background color for the initials container.
 * @returns {string} The HTML string for the contact initials template.
 */
function getInitialsTemplate(contact) {
    return `
        <div class="ATContact-option-intials-container" style="background-color: ${contact.color}; display:inline-flex; margin-right:4px;">
            <div class="ATContact-option-initials">${contact.initial}</div>
        </div>
    `;
}


/**
 * Generates the HTML template for a contact option in the Add Task form dropdown (desktop version).
 *
 * @param {Object} contact - The contact object containing name, initials, and color.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.initial - The initials of the contact.
 * @param {string} contact.color - The background color for the initials container.
 * @param {number} i - The index of the contact in the list.
 * @param {string} you - Additional label to display (e.g., "(You)").
 * @returns {string} The HTML string for the contact dropdown option.
 */
function getAssignedContactTemplate(contact, i, you) {
    return `
        <div class="ATcustom-dropdown-option" id="ATcustom-dropdown-Mobile-option-${i}" data-index="${i}" onclick="assignedCheckboxClick(event, ${i})">
            <div class="ATContact-option-intials-container" style="background-color: ${contact.color};">
                <div class="ATContact-option-initials">${contact.initial}</div>
            </div>
            <div class="ATContact-option-name" id="ATContact-option-name-${i}">${contact.name} ${you}</div>
            <div id="ATContact-option-checkbox${i}" class="ATContact-option-checkbox"></div>
        </div>
    `;
}


/**
 * Generates the HTML template for a contact option in the Add Task form dropdown (mobile version).
 *
 * @param {Object} contact - The contact object containing name, initials, and color.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.initial - The initials of the contact.
 * @param {string} contact.color - The background color for the initials container.
 * @param {number} i - The index of the contact in the list.
 * @param {string} you - Additional label to display (e.g., "(You)").
 * @returns {string} The HTML string for the contact dropdown option (mobile).
 */
function getAssignedContactMobileTemplate(contact, i, you) {
    return `
        <div class="ATcustom-dropdown-option" id="ATcustom-dropdown-Mobile-option-${i}" data-index="${i}" onclick="assignedCheckboxClick(event, ${i})">
            <div class="ATContact-option-intials-container" style="background-color: ${contact.color};">
                <div class="ATContact-option-initials">${contact.initial}</div>
            </div>
            <div class="ATContact-option-name">${contact.name} ${you}</div>
            <div id="ATContact-option-checkbox${i}" class="ATContact-option-checkbox"></div>
        </div>
    `;
}