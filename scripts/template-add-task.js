
function addSubtaskTemplate() {
    return `<div id="add-task-subtask-template" class="add-task-subtask-style">
                 <input id="ATSubtask-container" type="text" title="ATSubtask-container" class="ATSubtask-container"
                     value="what ever you say!">
                 <div class="add-task-subtasks-icons" id="add-task-subtasks-icons">
                     <div id="add-task-subtasks-icon-edit" class="add-task-subtasks-icon-edit" onclick="editAddTaskSubtask()">
                     </div>
                     <div id="add-task-subtasks-icons-divider" class="add-task-subtasks-icons-divider">
                     </div>
                     <div id="add-task-subtasks-icon-delete" class="add-task-subtasks-icon-delete" onclick="deleteAddTaskSubtask()">
                     </div>
                 </div>
             </div>`}