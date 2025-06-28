const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/"
const ATTitleRef = document.getElementById('add-task-title-input');
const ATDescriptionRef = document.getElementById('add-task-description-textarea');
const ATDueDateRef = document.getElementById('add-task-due-date-input');
const ATButtonPrioButtonUrgentRef = document.getElementById('add-task-prio-button-urgent');
const ATButtonPrioButtonMediumRef = document.getElementById('add-task-prio-button-medium');
const ATButtonPrioButtonLowRef = document.getElementById('add-task-prio-button-low');
const ATAssignToRef = document.getElementById('add-task-assign-to');
const ATCategoryRef = document.getElementById('add-task-category');
const ATSubtasksRef = document.getElementById('add-task-subtasks');
const ATSubtaskInput = document.getElementById('add-task-subtasks-input');
const ATButtonAddTaskRef = document.getElementById('add-task-button-create-task');
const ATButtonCancelRef = document.getElementById('add-task-cancel-button');
const allSubtasks = document.getElementById('allSubtasks');
let prioButtonState = 0;
let subtasks = [];
let subtasksObject = {};
let arrayOFsubtasksObjects = [];

async function sendAddTaskData() {
    saveUserInputsForFirebase();

}

async function checkIdAmount() {
    let response = await fetch(fetchURLDataBase + '/taskData' + ".json");
    let data = await response.json();
    let id = Object.keys(data).length + 1;
    return id;
}

function saveUserInputsForFirebase() {
    // event.preventDefault();
    // let id = checkIdAmount();
    let title = ATTitleRef.value;
    let description = ATDescriptionRef.value;
    let date = ATDueDateRef.value;
    let priority = prioButtonState;
    let status = "toDo";
    let assignTo = ATAssignToRef.value;
    let category = getAddTaskCategory();
    let subtasks = subtasksToArray();
    postAddTaskDataToFirebase(title, description, date, priority, status, assignTo, category, subtasks);
}


async function postAddTaskDataToFirebase(title, description, date, priority, status, assignTo, category, subtasks) {
    let response = await fetch(fetchURLDataBase + '/taskData' + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "id": await checkIdAmount(),
                "title": title,
                "description": description,
                "priority": priority,
                "status": status,
                "dueDate": date,
                "subtasks": subtasks,
                "assigned": assignTo,
                "category": category,
            }
        )
    });
    resetAddTaskForm();
    return responseToJson = await response.json();
}




function resetAddTaskForm() {
    ATSubtaskInput.value = "";
}

function addTaskPrioButtonClick(state) {
    prioButtonState = state;
}

function getAddTaskCategory() {
    let category = ATCategoryRef.value;
    return category;
}

function subtasksToArray() {
    const inputData = document.getElementById('add-task-subtasks-input').value;
    subtasks.push(inputData);
    return inputData;
}


function addTaskAddSubtask() {
    subtasksToArray();
    subtaskRander();
    resetAddTaskForm();
}

function subtaskRander() {
    allSubtasks.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtaski = subtasks[i];
        allSubtasks.innerHTML += `<div id="add-task-subtask-template" class="add-task-subtask-style">
                 <input id="ATSubtask-container-${i}" type="text" title="ATSubtask-container" class="ATSubtask-container"
                     value="${subtaski}">
                 <div class="add-task-subtasks-icons" id="add-task-subtasks-icons-${i}">
                     <div id="add-task-subtasks-icon-edit-${i}" class="add-task-subtasks-icon-edit" onclick="editAddTaskSubtask(${i})">
                     </div>
                     <div id="add-task-subtasks-icons-divider" class="add-task-subtasks-icons-divider">
                     </div>
                     <div id="add-task-subtasks-icon-delete-${i}" class="add-task-subtasks-icon-delete" onclick="deleteAddTaskSubtask(${i})">
                     </div>
                 </div>
             </div>`

    }
}

function editAddTaskSubtask() {
    // Logic to edit a subtask
}

function deleteAddTaskSubtask(index) {
    subtasks.splice(index, 1);
    subtaskRander();
    // Logic to delete a subtask
}