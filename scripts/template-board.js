function boardTaskOverlay() {
  return `
  <div id="task-overlay">
              <div class="card-name-overlay">
                <span class="card-name"> User Story </span>
                <span class="close-overlay" onclick="closeContainerOverlay()"
                  ><img src="../assets/icons/close.png"
                /></span>
              </div>
              <div class="card-description card-description-overlay">
                <h1>Kochwelt Page & Recipe Recommender</h1>
                <p>Build start page with recipe recommendation.</p>
              </div>
              <div class="date">
                <span
                  >Due date: <span class="content-value">23/10/2015</span></span
                >
              </div>
              <div class="priority-card date">
                <span>
                  Priority:
                  <span class="content-value"
                    >Medium <img src="../assets/icons/priority-medium.png"
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
function generateTodoHTML(element) {
  return `
         <div class="card todo task" onclick="containerOverlay()" draggable="true" ondragstart="startDragging(${element["id"]})">
                <div class="card-content">
                  <span class="card-name"> User Story </span>
                  <div class="card-description">
                    <h4>Kochwelt Page & Recipe Recommender</h4>
                    <p>Build start page with recipe recommendation...</p>
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
                      <img src="../assets/icons/priority-medium.png" />
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
