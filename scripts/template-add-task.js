
function addSubtaskTemplate(i, subtaski) {
    return `<div id="add-task-subtask-template${i}" class="add-task-subtask-style">
                <li class="ATSubLi" id="ATSubLi${i}"></li>                 <input id="ATSubtask-container-${i}" type="text" title="ATSubtask-container" class="ATSubtask-container"
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

function getInitialsTemplate(contact) {
    return `
        <div class="ATContact-option-intials-container" style="background-color: ${contact.color}; display:inline-flex; margin-right:4px;">
            <div class="ATContact-option-initials">${contact.initial}</div>
        </div>
    `;
}

function getAssignedContactTemplate(contact, i, you) {
    return `
        <div class="ATcustom-dropdown-option" data-index="${i}" onclick="assignedCheckboxClick(event, ${i})">
            <div class="ATContact-option-intials-container" style="background-color: ${contact.color};">
                <div class="ATContact-option-initials">${contact.initial}</div>
            </div>
            <div class="ATContact-option-name">${contact.name} ${you}</div>
            <div id="ATContact-option-checkbox${i}" class="ATContact-option-checkbox"></div>
        </div>
    `;
}