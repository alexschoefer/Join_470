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
    resetAddTaskForm();
}

async function saveUserInputsForFirebase() {
    let title = ATTitleRef.value;
    let description = ATDescriptionRef.value;
    let date = ATDueDateRef.value;
    let priority = prioButtonState;
    let status = "toDo";
    let assignTo = "Branislav"; // assignedTo is a part of code, that has to be changed by dynamic version of contacts
    // let assignTo = ATAssignToRef.value;
    let category = ATCategoryRef.value;
    let subtasks = getSubtasksArray();;
    postAddTaskDataToFirebase(title, description, date, priority, status, assignTo, category, subtasks);
}

async function checkIdAmount() {
    let response = await fetch(fetchURLDataBase + '/tasks' + ".json");
    let data = await response.json();
    let id = Object.keys(data).length + 1;
    return id;
}

async function subtasksToArray() {
    const inputData = document.getElementById('add-task-subtasks-input').value;
    if (inputData == "") {
        return;
    }
    subtasks.push(inputData);
}

async function postAddTaskDataToFirebase(title, description, date, priority, status, assignTo, category, subtasks) {
    let response = await fetch(fetchURLDataBase + '/tasks' + ".json", {
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
    return responseToJson = await response.json();
}

function getSubtasksArray() {
    const subtaskInputs = document.querySelectorAll('.ATSubtask-container');
    subtasks = [];
    subtaskInputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            subtasks.push({ title: value, done: false });
        }
    });
    return subtasks;
}

function resetAddTaskForm() {
    ATTitleRef.value = "";
    ATDescriptionRef.value = "";
    ATDueDateRef.value = "";

    ATSubtaskInput.value = "";
    const subtaskInputs = document.querySelectorAll('.ATSubtask-container');
    subtasks = [];
    subtaskInputs.forEach(input => input.value = "");
}

function addTaskPrioButtonClick(state) {
    prioButtonState = state;
}

function resetAddTaskSubtaskInput() {
    ATSubtaskInput.value = "";
}

function addTaskAddSubtask() {
    subtasksToArray();
    subtaskRender();
    resetAddTaskSubtaskInput();
}

function subtaskRender() {
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
    subtaskRender();
}

// function startTaskAddedFinishAnimation() {
//     const logo = document.getElementById("add-task-finish-animation");
//     logo.classList.remove("d_none");
//     logo.classList.remove("add-task-finish-overlay-animation");
//     void logo.offsetWidth;
//     logo.classList.add("add-task-finish-overlay-animation");
//     setTimeout(() => {
//         logo.classList.add("d_none");
//         logo.classList.remove("add-task-finish-overlay-animation");
//     }, 1000);
// }