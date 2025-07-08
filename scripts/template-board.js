function boardTaskOverlay(task, priorityImg) {
  return `
  <div id="task-overlay">
              <div class="card-name-overlay">
                <span class="card-name">${task.category}</span>
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
                    >Medium <img src="${priorityImg}"
                  /></span>
                </span>
              </div>
              <div class="assigned-overlay-card">
                <span class="assigned-list">Assigned To:</span>
                <div class="content">
                  <div class="assigned-content">
                    <span class="logo"> JL </span>
                    <span class="name">Judtih Lütke</span>
                  </div>
                  <div class="assigned-content">
                    <span class="logo"> MN </span>
                    <span class="name">Miriam Neumann</span>
                  </div>
                </div>
              </div>
              <div class="subtasks">
                <span class="subtasks-title">Subtasks</span>
                <div class="subtasks-input">
                  <div class="subtask-container">
                    <input
                      class="checkbox"
                      type="checkbox"
                      id="1"
                      name="task1"
                      value="task1"
                    />
                    <label> Implement Recipe Recommendation</label><br />
                  </div>
                  <div class="subtask-container">
                    <input
                      class="checkbox"
                      type="checkbox"
                      id="2"
                      name="task2"
                      value="task2"
                    />
                    <label> Start Page Layout</label><br />
                  </div>
                  <div class="subtask-container">
                    <input
                      class="checkbox"
                      type="checkbox"
                      id="3"
                      name="task3"
                      value="task3"
                    />
                    <label> Implement User Authentication</label><br /><br />
                  </div>
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
function generateTodoHTML(task,priorityImg) {
  return `
         <div class="card todo task" draggable="true" data-task='${JSON.stringify(
           task
         )}' ondragstart="startDragging(${task.id})">
                <div class="card-content">
                  <span class="card-name"> ${task.category}</span>
                  <div class="card-description">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                  </div>
                  <div class="progress-bar">
                    <div class="bar"><span class="col-bar"></span></div>
                    <span class="nr-progress-tasks">1/2 Subtasks</span>
                  </div>
                  <div class="assignees-priority"> 
                    <div class="assignees">
                      <span class="exemplu">MN</span>
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
                            <div class="add-task-form-left">
                                <div class="add-task-form-left-title">
                                    <p for="add-task-title" class="label-add-task">Title<span
                                            class="red-asterix-required">*</span></p>
                                    <input type="text" id="add-task-title-input"
                                        class="add-task-input-style add-task-placeholder-style"
                                        placeholder="Enter a Title" required>
                                </div>
                                <div class="add-task-form-left-description">
                                    <p for="add-task-description" class="label-add-task">Description</p>
                                    <textarea name="add-task-description" id="add-task-description-textarea"
                                        class="add-task-input-textarea-style add-task-placeholder-style"
                                        placeholder="Enter a Description" rows="4" cols="50"></textarea>
                                    <span id="mobile-required-text-no-asterix-description"
                                        class="mobile-required-text-no-asterix"></span>
                                </div>
                                <div class="add-task-form-left-title">
                                    <p class="label-add-task">Due Date<span class="red-asterix-required">*</span></p>
                                    <div class="add-task-due-date-wraper">
                                        <input name="add-task-due-date" type="date" id="add-task-due-date-input"
                                            class="add-task-input-style add-task-due-date-input"
                                            placeholder="dd/mm/yyyy" required>
                                    </div>
                                </div>
                            </div>
                            <div class="add-task-form-right">
                                <div class="add-task-form-right-priority">
                                    <span class="label-add-task-black">Priority</span>

                                    <div class="add-task-priority-buttons">
                                        <button  id="add-task-prio-button-urgent"
                                            class="add-task-priority-button add-task-priority-button-urgent" 
                                            type="button">Urgent<img class="add-task-priority-button-medium-image"
                                                src="../assets/icons/add-task-prio-capa-2-urgent-default.svg"
                                                alt="urgent-button"></img></button>
                                        <button  id="add-task-prio-button-medium"
                                            class="add-task-priority-button add-task-priority-button-medium"
                                            type="button"><span class="">Medium</span><img
                                                class="add-task-priority-button-medium-image"
                                                src="../assets/icons/add-task-prio-capa-2-medium-default.svg"
                                                alt="urgent-button"></img></button>
                                        <button id="add-task-prio-button-low"
                                            class="add-task-priority-button add-task-priority-button-low"
                                            type="button">Low<img class="add-task-priority-button-image"
                                                src="../assets/icons/add-task-prio-capa-2-low-default.svg"
                                                alt="urgent-button"></img></button>
                                    </div>
                                </div>
                                <div class="add-task-form-right-select-contacts">
                                    <p class="label-add-task">Assigned to</p>
                                    <select name="add-task-assigned-to" 
                                        class="add-task-input-style add-task-placeholder-black"
                                        placeholder="Select contacts to assign">
                                        <option id="add-task-assigned-to" value="contactToChoose"
                                            class="label-add-task add-task-placeholder-black">Select contacts to assign
                                        </option>
                                        <option value="saab" class="label-add-task add-task-placeholder-black">dynamic
                                            data</option>
                                    </select>
                                </div>
                                <div class="add-task-form-right-category">
                                    <label class="label-add-task">Category<span
                                            class="red-asterix-required">*</span></label>
                                    <select name="add-task-category" type="text"
                                        class="label-add-task add-task-input-style" id="add-task-category"
                                        class="add-task-placeholder-black" placeholder="Select task category" required>
                                        <option value="technicalTask" class="label-add-task">Technical Task</option>
                                        <option value="userStory" class="label-add-task">User Story</option>
                                    </select>
                                </div>
                                <div class="add-task-form-right-subtasks">
                                    <p class="label-add-task">Subtasks</p>
                                    <div class="add-task-subtask-input-wrapper">
                                        <div class="add-task-input-style">
                                            <input type="text"
                                                class="add-task-placeholder-style add-task-input-placeholder-style"
                                                id="add-task-subtasks-input" placeholder="Add new subtask">
                                            <div id="add-task-subtasks-icon-add" class="add-task-subtasks-icon-add">
                                                <img src="../assets/icons/add-task-subtasks-add.svg" alt="icon-add">
                                            </div>
                                        </div>

                                    </div>

                                    <div class="add-task-subtasks-icons" id="add-task-subtasks-icons">
                                        <div id="add-task-subtasks-icon-delete" class="add-task-subtasks-icon-delete">
                                        </div>
                                        <div id="add-task-subtasks-icons-divider"
                                            class="add-task-subtasks-icons-divider"></div>
                                        <div id="add-task-subtasks-icon-add" class="add-task-subtasks-icon-add"></div>
                                    </div>
                                    <div id="allSubtasks" class="allSubtasks"></div>

                                </div>
                            </div>
                         </div>
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
                     </div>
                    `;
}
