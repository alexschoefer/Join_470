function boardTaskOverlay(task, priorityImg, assigned, subtasks, color) {
  return `
  <div id="task-overlay">
              <div class="card-name-overlay">
                <span style="background-color: ${color}"   class="card-name">${task.category}</span>
                <span class="close-overlay" onclick="closeContainerOverlay()"
                  ><img src="../assets/icons/close.png"
                /></span>
              </div>
              <div class="card-description card-description-overlay">
                <h1>${task.title}</h1>
                <p>${task.description}</p>
              </div>
              <div class="date">
                <span
                  >Due date: <span class="content-value">${task.dueDate}</span></span
                >
              </div>
              <div class="priority-card date">
                <span>
                  Priority:
                  <span class="content-value"
                    >${task.priority}<img src="${priorityImg}"
                  /></span>
                </span>
              </div>
              <div class="assigned-overlay-card">
                <span class="assigned-list">Assigned To:</span>
                <div class="content">
                ${assigned}
                </div>
              </div>
              <div class="subtasks">
                <span class="subtasks-title">Subtasks</span>
                <div class="subtasks-input">
                 ${subtasks}
                </div>
              </div>
              <div class="tasks-functionen">
                <div class="functionen">
                  <span class="delete"
                    ><div class="icon-delete"></div>
                    Delete</span
                  >
                  <span class="split"></span>
                  <span class="edit"
                    ><div class="icon-edit"></div>
                    Edit</span
                  >
                </div>
              </div>
            </div>`;
}
function generateTodoHTML(task, priorityImg, assigned, color) {
  return `
         <div class="card todo task" draggable="true" data-task='${JSON.stringify(
           task
         )}' ondragstart="startDragging(${task.id})">
                <div class="card-content">
                    <div class="card-name-container">
                  <span style="background-color: ${color}" class="card-name"> ${
    task.category
  }</span>
  <div class="card-drop-down-button">
  <img src="../assets/icons/drop-down.png" />
  </div>
                </div>
                  <div class="card-description">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                  </div>
                  <div class="progress-bar">
                    <div class="bar"><span class="col-bar"></span></div>
                    <span id="nr-progress-tasks">0/0</span>
                  </div>
                  <div class="assignees-priority"> 
                  <div class="card-assigned-initials">
                  ${assigned}
                  </div>
                    
                    <div class="prioriti">
                      <img src="${priorityImg}" />
                    </div>
                  </div>
                </div>
              </div>
    `;
}
function templeteNotTasks(name) {
  return `
                 <div class="not-task">
                  <p>No tasks ${formatName(name)}</p>
                </div>`;
}
function editTasksOfBoard(id) {
  return `
                        <div class="add-task-form-div">
                         <span class="close-overlay" onclick="closeContainerOverlay()"
                           ><img src="../assets/icons/close.png"
                            /></span>
                        <div class="add-task-form-div-container">
                            <div class="add-task-form-left">
                                <div class="add-task-form-left-title">
                                    <p class="label-add-task">Title<span class="red-asterix-required">*</span></p>
                                    <input type="text" id="add-task-title-input" class="add-task-input-style"
                                        placeholder="Enter a Title" required autocomplete="off">
                                    <span id="title-required" class="required-text d_none">This field is required</span>
                                </div>
                                <div class="add-task-form-left-description">
                                    <p for="add-task-description" class="label-add-task label-corrector-bottom">
                                        Description
                                    </p>
                                    <div class="description-flex-wrapper">
                                        <textarea id="add-task-description-textarea"
                                            class="add-task-input-textarea-style"
                                            placeholder="Enter a Description"></textarea>
                                        <span class="desription-ico"></span>
                                    </div>
                                    <span id="mobile-required-text-no-asterix-description"
                                        class="mobile-required-text-no-asterix"></span>
                                </div>
                                <div class="add-task-form-left-due-date">
                                    <p class="label-add-task label-corrector-bottom">Due date<span
                                            class="red-asterix-required">*</span></p>
                                    <div class="add-task-due-date-wrapper">
                                        <input type="date" title="due-date" id="add-task-due-date-input"
                                            class="add-task-input-style" />
                                        <span class="calendar-icon"
                                            onclick="document.getElementById('add-task-due-date-input').focus();"></span>
                                    </div>
                                    <span id="due-date-required" class="required-text d_none">This field is
                                        required</span>
                                </div>
                            </div>
                            <div class="add-task-form-right">
                                <div class="add-task-form-right-priority">
                                    <span class="label-add-task-black">Priority</span>

                                    <div class="add-task-priority-buttons">
                                        <button onclick="addTaskPrioButtonClick('Urgent')"
                                            id="add-task-prio-button-urgent" class="add-task-priority-button"
                                            type="button">
                                            Urgent
                                            <div id="add-task-prio-button-urgent-picture"
                                                class="add-task-priority-button-urgent-image"></div>
                                        </button>

                                        <button onclick="addTaskPrioButtonClick('Medium')"
                                            id="add-task-prio-button-medium"
                                            class="add-task-priority-button add-task-priority-button-medium"
                                            type="button">
                                            <span class="">Medium</span>
                                            <div id="add-task-prio-button-medium-picture"
                                                class="add-task-priority-button-medium-image add-task-priority-button-medium-pic-pressed">
                                            </div>
                                        </button>

                                        <button onclick="addTaskPrioButtonClick('Low')" id="add-task-prio-button-low"
                                            class="add-task-priority-button" type="button">
                                            Low
                                            <div id="add-task-prio-button-low-picture"
                                                class="add-task-priority-button-low-image"></div>
                                        </button>
                                    </div>
                                </div>
                                <div class="add-task-form-right-select-contacts">
                                    <p class="label-add-task">Assigned to</p>
                                    <div class="ATcustom-dropdown-wrapper" id="customDropdownWrapper">
                                        <div class="ATcustom-dropdown-selected" id="customDropdownSelected">
                                            <span id="customDropdownSelectedText">Kontakt wählen</span>
                                            <span class="ATcustom-dropdown-arrow" id="customDropdownArrow"></span>
                                        </div>
                                        <div class="ATcustom-dropdown" id="add-task-assigned-to-select"
                                            style="display: none;">
                                            <!-- Hier werden die Optionen per JS eingefügt -->
                                        </div>
                                    </div>
                                    <div id="add-task-assigned-to-chosen-initials"
                                        class="add-task-assigned-to-chosen-initials"></div>
                                </div>
                                <div class="add-task-form-right-category">
                                    <p class="label-add-task label-corrector-bottom-category">Category<span
                                            class="red-asterix-required">*</span></p>
                                    <div class="ATcustom-dropdown-wrapper" id="categoryDropdownWrapper">
                                        <div class="ATcustom-dropdown-selected error" id="categoryDropdownSelected">
                                            <span id="categoryDropdownSelectedText">Select a category</span>
                                            <span class="ATcustom-dropdown-arrow" id="categoryDropdownArrow"></span>
                                        </div>
                                        <div class="ATcustom-dropdown-category" id="add-task-category-select"
                                            style="display: none;">
                                            <!-- Optionen per JS -->
                                        </div>
                                    </div>
                                    <!-- <select id="add-task-category" title="add-task-category"
                                        class="add-task-input-style" required>
                                        <option value="">Select a category</option>
                                        <option value="Technical Task" class="label-add-task">
                                            Technical Task
                                        </option>
                                        <option value="User Story" class="label-add-task">
                                            User Story
                                        </option>
                                    </select> -->
                                    <span id="category-required" class="required-text d_none">This field is
                                        required</span>
                                </div>
                                <div class="add-task-form-right-subtasks">
                                    <p class="label-add-task">Subtasks</p>
                                    <div class="add-task-subtask-input-wrapper">
                                        <div class="add-task-subtasks-input-style">
                                            <input type="text"
                                                class="add-task-placeholder-style add-task-input-placeholder-style "
                                                id="add-task-subtasks-input" placeholder="Add new subtask"
                                                autocomplete="off" />
                                            <div id="add-task-subtasks-icon-add" class="add-task-subtasks-icon-add "
                                                onclick="getFocusInSubtasksInput()">
                                            </div>
                                            <div id="add-task-subtasks-input-div"
                                                class="df add-task-subtasks-input-div d_none">
                                                <div id="add-task-subtasks-icon-clear"
                                                    class="add-task-subtasks-icon-clear"
                                                    onmousedown="clearAddTaskSubtask()">
                                                </div>
                                                <div class="add-task-subtasks-icons-divider">
                                                </div>
                                                <div id="add-task-subtasks-icon-done"
                                                    class="add-task-subtasks-icon-done"
                                                    onmousedown="addTaskAddSubtask()">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul id="allSubtasks" class="allSubtasks"></ul>
                     </div>
                     <div class="task-button-overlay">
                       <button type="button" id="add-task-button-create-task" onclick="valueTasksToEditTasks(${id})"
                           class="label-add-task add-task-button-create"><span
                               class="add-task-button-create-text">OK</span>
                           <div class="label-add-task add-task-button-create-capsule">
                               <img class="add-task-button-create-icon"
                                   src="../assets/icons/add-task-check-white.png" alt="nike">
                           </div>
                       </button>
                    
                    `;
}

function addTasks() {
  return `
    <div id="task-overlay" class="add-task-overlay">
              <div class="card-name-overlay">
 <div class="add-task-title">
                        <label for="ATF" class="add-task-h1">Add Task</label>
                    </div>
                <span class="close-overlay" onclick="closeContainerOverlay()"
                  ><img src="../assets/icons/close.png"
                /></span>
              </div>
             <div class="add-task-content">
                    <form action="" class="add-task-form" id="ATF">
                        <div class="add-task-form-div-container">
                            <div class="add-task-form-left">
                                <div class="add-task-form-left-title">
                                    <p class="label-add-task">Title<span class="red-asterix-required">*</span></p>
                                    <input type="text" id="add-task-title-input" class="add-task-input-style"
                                        placeholder="Enter a Title" required autocomplete="off">
                                    <span id="title-required" class="required-text d_none">This field is required</span>
                                </div>
                                <div class="add-task-form-left-description">
                                    <p for="add-task-description" class="label-add-task label-corrector-bottom">
                                        Description
                                    </p>
                                    <div class="description-flex-wrapper">
                                        <textarea id="add-task-description-textarea"
                                            class="add-task-input-textarea-style"
                                            placeholder="Enter a Description"></textarea>
                                        <span class="desription-ico"></span>
                                    </div>
                                    <span id="mobile-required-text-no-asterix-description"
                                        class="mobile-required-text-no-asterix"></span>
                                </div>
                                <div class="add-task-form-left-due-date">
                                    <p class="label-add-task label-corrector-bottom">Due date<span
                                            class="red-asterix-required">*</span></p>
                                    <div class="add-task-due-date-wrapper">
                                        <input type="date" title="due-date" id="add-task-due-date-input"
                                            class="add-task-input-style" />
                                        <span class="calendar-icon"
                                            onclick="document.getElementById('add-task-due-date-input').focus();"></span>
                                    </div>
                                    <span id="due-date-required" class="required-text d_none">This field is
                                        required</span>
                                </div>
                            </div>
                            <div class="add-task-center-dividor"></div>
                            <div class="add-task-form-right">
                                <div class="add-task-form-right-priority">
                                    <span class="label-add-task-black">Priority</span>

                                    <div class="add-task-priority-buttons">
                                        <button onclick="addTaskPrioButtonClick('Urgent')"
                                            id="add-task-prio-button-urgent" class="add-task-priority-button"
                                            type="button">
                                            Urgent
                                            <div id="add-task-prio-button-urgent-picture"
                                                class="add-task-priority-button-urgent-image"></div>
                                        </button>

                                        <button onclick="addTaskPrioButtonClick('Medium')"
                                            id="add-task-prio-button-medium"
                                            class="add-task-priority-button add-task-priority-button-medium"
                                            type="button">
                                            <span class="">Medium</span>
                                            <div id="add-task-prio-button-medium-picture"
                                                class="add-task-priority-button-medium-image add-task-priority-button-medium-pic-pressed">
                                            </div>
                                        </button>

                                        <button onclick="addTaskPrioButtonClick('Low')" id="add-task-prio-button-low"
                                            class="add-task-priority-button" type="button">
                                            Low
                                            <div id="add-task-prio-button-low-picture"
                                                class="add-task-priority-button-low-image"></div>
                                        </button>
                                    </div>
                                </div>
                                <div class="add-task-form-right-select-contacts">
                                    <p class="label-add-task">Assigned to</p>
                                    <div class="ATcustom-dropdown-wrapper" id="customDropdownWrapper">
                                        <div class="ATcustom-dropdown-selected" id="customDropdownSelected">
                                            <span id="customDropdownSelectedText">Kontakt wählen</span>
                                            <span class="ATcustom-dropdown-arrow" id="customDropdownArrow"></span>
                                        </div>
                                        <div class="ATcustom-dropdown" id="add-task-assigned-to-select"
                                            style="display: none;">
                                            <!-- Hier werden die Optionen per JS eingefügt -->
                                        </div>
                                    </div>
                                    <div id="add-task-assigned-to-chosen-initials"
                                        class="add-task-assigned-to-chosen-initials"></div>
                                </div>
                                <div class="add-task-form-right-category">
                                    <p class="label-add-task label-corrector-bottom-category">Category<span
                                            class="red-asterix-required">*</span></p>
                                    <div class="ATcustom-dropdown-wrapper" id="categoryDropdownWrapper">
                                        <div class="ATcustom-dropdown-selected error" id="categoryDropdownSelected">
                                            <span id="categoryDropdownSelectedText">Select a category</span>
                                            <span class="ATcustom-dropdown-arrow" id="categoryDropdownArrow"></span>
                                        </div>
                                        <div class="ATcustom-dropdown-category" id="add-task-category-select"
                                            style="display: none;">
                                            <!-- Optionen per JS -->
                                        </div>
                                    </div>
                                    <!-- <select id="add-task-category" title="add-task-category"
                                        class="add-task-input-style" required>
                                        <option value="">Select a category</option>
                                        <option value="Technical Task" class="label-add-task">
                                            Technical Task
                                        </option>
                                        <option value="User Story" class="label-add-task">
                                            User Story
                                        </option>
                                    </select> -->
                                    <span id="category-required" class="required-text d_none">This field is
                                        required</span>
                                </div>
                                <div class="add-task-form-right-subtasks">
                                    <p class="label-add-task">Subtasks</p>
                                    <div class="add-task-subtask-input-wrapper">
                                        <div class="add-task-subtasks-input-style">
                                            <input type="text"
                                                class="add-task-placeholder-style add-task-input-placeholder-style "
                                                id="add-task-subtasks-input" placeholder="Add new subtask"
                                                autocomplete="off" />
                                            <div id="add-task-subtasks-icon-add" class="add-task-subtasks-icon-add "
                                                onclick="getFocusInSubtasksInput()">
                                            </div>
                                            <div id="add-task-subtasks-input-div"
                                                class="df add-task-subtasks-input-div d_none">
                                                <div id="add-task-subtasks-icon-clear"
                                                    class="add-task-subtasks-icon-clear"
                                                    onmousedown="clearAddTaskSubtask()">
                                                </div>
                                                <div class="add-task-subtasks-icons-divider">
                                                </div>
                                                <div id="add-task-subtasks-icon-done"
                                                    class="add-task-subtasks-icon-done"
                                                    onmousedown="addTaskAddSubtask()">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="allSubtasks" class="allSubtasks"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="add-task-form-buttons">
                            <div>
                                <span class="label-add-task"><span class="red-asterix-required">*</span>This field is
                                    required
                                </span>
                            </div>
                            <div id="add-task-finish-animation" class="add-task-finish-animation d_none">
                                <div id="add-task-finish-animation" class="add-task-start-overlay-animation">
                                    <div class="add-task-finish-ovelay">
                                        <span class="add-task-finish-ovelay-text">Task Added to Board</span>
                                        <img class="add-task-finish-ovelay-img" src="../assets/icons/board-icon.png"
                                            alt="" />
                                    </div>
                                </div>
                            </div>

                            <div class="add-task-buttons-create-and-clear">
                                <button onclick="closeContainerOverlay()" type="button"
                                    id="label-add-task add-task-button-clear"
                                    class="label-add-task add-task-button-clear">
                                    <span class="add-task-button-clear-text">Cancel </span><img
                                        class="add-task-button-clear-icon"
                                        src="../assets/icons/add-task-iconoir_cancel.svg" alt="close-pic" />
                                </button>
                                <button onclick="sendAddTaskData()" type="button" id="add-task-button-create-task"
                                    class="label-add-task add-task-button-create" disabled="true">
                                    <span class="add-task-button-create-text">Create Task</span>
                                    <div class="label-add-task add-task-button-create-capsule">
                                        <img class="add-task-button-create-icon"
                                            src="../assets/icons/add-task-check-white.png" alt="nike" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
  `;
}
