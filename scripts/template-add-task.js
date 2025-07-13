
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