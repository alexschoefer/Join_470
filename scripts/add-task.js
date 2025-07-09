const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/";
const ATTitleRef = document.getElementById("add-task-title-input");
const ATDescriptionRef = document.getElementById("add-task-description-textarea");
const ATDueDateRef = document.getElementById("add-task-due-date-input");
const ATButtonPrioButtonUrgentRef = document.getElementById("add-task-prio-button-urgent");
const ATButtonPrioButtonMediumRef = document.getElementById("add-task-prio-button-medium");
const ATButtonPrioButtonLowRef = document.getElementById("add-task-prio-button-low");
const ATAssignToRef = document.getElementById("add-task-assign-to");
const ATCategoryRef = document.getElementById("add-task-category");
const ATSubtasksRef = document.getElementById("add-task-subtasks");
const ATSubtaskInput = document.getElementById("add-task-subtasks-input");
const ATButtonAddTaskRef = document.getElementById("add-task-button-create-task");
const ATButtonCancelRef = document.getElementById("add-task-cancel-button");
const allSubtasks = document.getElementById("allSubtasks");
const ATButtonUrgentRef = document.getElementById('add-task-prio-button-urgent');
const ATButtonUrgentPicRef = document.getElementById('add-task-prio-button-urgent-picture');
const ATButtonMediumRef = document.getElementById('add-task-prio-button-medium');
const ATButtonMediumPicRef = document.getElementById('add-task-prio-button-medium-picture');
const ATButtonLowRef = document.getElementById('add-task-prio-button-low');
const ATButtonLowPicRef = document.getElementById('add-task-prio-button-low-picture');
const ATSubtasksInputDivRef = document.getElementById('add-task-subtasks-input-div');
const ATSubtasksIconAddRef = document.getElementById('add-task-subtasks-icon-add')
let prioButtonState = "Medium";
let subtasks = [];
let subtasksObject = {};


function addTaskInit() {
    createTaskButtonRequiredFieldsNotOK();
// contacts trigger
}

async function sendAddTaskData() {
    saveUserInputsForFirebase();
    resetAddTaskForm();
    startTaskAddedFinishAnimation();
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
    let subtasks = getSubtasksArray();
    let responseData = await postAddTaskDataToFirebase(
        title,
        description,
        date,
        priority,
        status,
        assignTo,
        category,
        subtasks
    );
}

async function checkIdAmount() {
    let response = await fetch(fetchURLDataBase + "/tasks" + ".json");
    let data = await response.json();
    let id = Object.keys(data).length + 1;
    return id;
}

function subtasksToArray() {

    const inputData = document.getElementById("add-task-subtasks-input").value;
    if (inputData == "") {
        return;
    }
    subtasks.push(inputData);
}

async function postAddTaskDataToFirebase(
    title,
    description,
    date,
    priority,
    status,
    assignTo,
    category,
    subtasks
) {
    let res = await fetch(fetchURLDataBase + "/tasks.json");
    let data = await res.json();

    let existingIds = data ? Object.keys(data).map((id) => parseInt(id)) : [];
    let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    console.log(assignTo);

    let newTask = {
        title: title,
        description: description,
        priority: priority,
        status: status,
        dueDate: date,
        subtasks: subtasks,
        assigned: assignTo,
        category: category,
        id: nextId,
    };
    let response = await fetch(`${fetchURLDataBase}/tasks/${nextId}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });
    const responseData = await response.json();
    return responseData;

}

function getSubtasksArray() {
    const subtaskInputs = document.querySelectorAll(".ATSubtask-container");
    subtasks = [];
    subtaskInputs.forEach((input) => {
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
    allSubtasks.innerHTML = "";
    ATSubtaskInput.value = "";
}

function addTaskPrioButtonClick(state) {

    if (state == 'Urgent') {
        holdButtonUrgent();
    }
    if (state == 'Medium') {
        holdButtonMedium();
    }
    if (state == 'Low') {
        holdButtonLow();
    }
}

function holdButtonUrgent() {
    ATButtonLowPicRef.classList.remove('add-task-priority-button-low-pic-pressed');
    ATButtonMediumPicRef.classList.remove('add-task-priority-button-medium-pic-pressed');
    ATButtonUrgentPicRef.classList.add('add-task-priority-button-urgent-pic-pressed');
    ATButtonUrgentRef.classList.add('add-task-priority-button-urgent');
    ATButtonMediumRef.classList.remove('add-task-priority-button-medium');
    ATButtonLowRef.classList.remove('add-task-priority-button-low');
}

function holdButtonMedium() {
    ATButtonUrgentPicRef.classList.remove('add-task-priority-button-urgent-pic-pressed');
    ATButtonLowPicRef.classList.remove('add-task-priority-button-low-pic-pressed');
    ATButtonMediumPicRef.classList.add('add-task-priority-button-medium-pic-pressed');
    ATButtonUrgentRef.classList.remove('add-task-priority-button-urgent');
    ATButtonMediumRef.classList.add('add-task-priority-button-medium');
    ATButtonLowRef.classList.remove('add-task-priority-button-low');
}

function holdButtonLow() {
    ATButtonUrgentPicRef.classList.remove('add-task-priority-button-urgent-pic-pressed');
    ATButtonMediumPicRef.classList.remove('add-task-priority-button-medium-pic-pressed');
    ATButtonLowPicRef.classList.add('add-task-priority-button-low-pic-pressed');
    ATButtonUrgentRef.classList.remove('add-task-priority-button-urgent');
    ATButtonMediumRef.classList.remove('add-task-priority-button-medium');
    ATButtonLowRef.classList.add('add-task-priority-button-low');
}

function resetAddTaskSubtaskInput() {
    ATSubtaskInput.value = "";
}

function addTaskAddSubtask() {
    subtasksToArray();
    subtaskRender();
    resetAddTaskSubtaskInput();
    ADSShowIcons();
}

function subtaskRender() {
    allSubtasks.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtaski = subtasks[i];
        allSubtasks.innerHTML += `<div id="add-task-subtask-template${i}" class="add-task-subtask-style">
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
}


function deleteAddTaskSubtask(index) {
    subtasks.splice(index, 1);
    subtaskRender();
}

function startTaskAddedFinishAnimation() {
    const animationContainer = document.getElementById("add-task-finish-animation");
    animationContainer.classList.remove('d_none');
    setTimeout(() => {
        window.location.href = "./board.html";
    }, 1000);
}

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

function validateCategory() {
    if (!ATCategoryRef.value.trim()) {
        ATCategoryRef.classList.add('error');
        document.getElementById('category-required').classList.remove('d_none');
        return false;
    } else {
        ATCategoryRef.classList.remove('error');
        document.getElementById('category-required').classList.add('d_none');
        return true;
    }
}

function validateAddTaskInputs() {
    let valid = true;
    if (!validateTitle()) valid = false;
    if (!validateDueDate()) valid = false;
    if (!validateCategory()) valid = false;
    return valid;
}

ATButtonAddTaskRef.addEventListener('click', function (event) {
    if (!validateAddTaskInputs()) {
        event.preventDefault();
    }
});

ATTitleRef.addEventListener('blur', validateTitle);
ATDueDateRef.addEventListener('blur', validateDueDate);
ATCategoryRef.addEventListener('blur', validateCategory);

function clearAddTaskSubtask() {
    ATSubtaskInput.value = "";
    ATSubtasksIconAddRef.classList.remove('d_none');
}

function getDoneAddTaskSubtask(id) {
    const ATSubSubtaskContainerRef = document.getElementById('ATSubtask-container-' + id);
    const addTaskSubtasksIconDoneRef = document.getElementById('add-task-subtasks-icon-done-' + id);
    const ATSubSubtaskIconEditRef = document.getElementById('add-task-subtasks-icon-edit-' + id);
    const ATSubSubtaskIconsRef = document.getElementById('add-task-subtasks-icons-' + id);
    const ATSubLiRef = document.getElementById('ATSubLi' + id);
    ATSubSubtaskContainerRef.blur();
    ATSubLiRef.classList.remove('d_none');
    ATSubSubtaskIconsRef.classList.remove('fdrr');
    ATSubSubtaskIconEditRef.classList.remove('d_none');
    addTaskSubtasksIconDoneRef.classList.add('d_none');
}

function editAddTaskSubtask(id) {
    const ATSubSubtaskContainerRef = document.getElementById('ATSubtask-container-' + id);
    const ATSubSubtaskIconEditRef = document.getElementById('add-task-subtasks-icon-edit-' + id);
    const ATSubSubtaskIconsRef = document.getElementById('add-task-subtasks-icons-' + id);
    const addTaskSubtasksIconDoneRef = document.getElementById('add-task-subtasks-icon-done-' + id);
    const ATSubLiRef = document.getElementById('ATSubLi' + id);
    ATSubLiRef.classList.add('d_none');
    ATSubSubtaskContainerRef.focus();
    ATSubSubtaskIconsRef.classList.add('fdrr');
    ATSubSubtaskIconEditRef.classList.add('d_none');
    addTaskSubtasksIconDoneRef.classList.remove('d_none');
}

ATSubtaskInput.addEventListener('focus', showClearAndDoneButtons);
ATSubtaskInput.addEventListener('blur', hideClearAndDoneButtons);

function showClearAndDoneButtons() {
    ATSubtasksInputDivRef.classList.remove('d_none');
    ATSubtasksIconAddRef.classList.add('d_none');
}

function hideClearAndDoneButtons() {
    ATSubtasksInputDivRef.classList.add('d_none');
    ATSubtasksIconAddRef.classList.remove('d_none');
}

function getFocusInSubtasksInput() {
    document.getElementById('add-task-subtasks-input').focus();
    ATSubtasksIconAddRef.classList.add('d_none');
}

function ADSShowIcons() {
    document.querySelectorAll('.add-task-subtask-style').forEach(container => {
        const icons = container.querySelector('.add-task-subtasks-icons');
        if (icons) {
            icons.classList.add('d_none');
            container.addEventListener('mouseenter', () => {
                icons.classList.remove('d_none');
            });
            container.addEventListener('mouseleave', () => {
                icons.classList.add('d_none');
            });
        }
    });
}

document.getElementById('add-task-subtasks-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTaskAddSubtask();
    }
});

function checkRequiredFieldsAndToggleButton() {
    const titleFilled = ATTitleRef.value.trim() != "";
    const dueDateFilled = ATDueDateRef.value.trim() != "";
    const categoryFilled = ATCategoryRef.value.trim() != "";

    if (titleFilled && dueDateFilled && categoryFilled) {
        createTaskButtonRequiredFieldsOK();
    } else {
       createTaskButtonRequiredFieldsNotOK();
    }
}

ATTitleRef.addEventListener('input', checkRequiredFieldsAndToggleButton);
ATDueDateRef.addEventListener('input', checkRequiredFieldsAndToggleButton);
ATCategoryRef.addEventListener('input', checkRequiredFieldsAndToggleButton);

function createTaskButtonRequiredFieldsOK() {
    ATButtonAddTaskRef.style.backgroundColor = "var(--black)";
    ATButtonAddTaskRef.disabled = false;
}

function createTaskButtonRequiredFieldsNotOK() {
     ATButtonAddTaskRef.style.backgroundColor = "var(--main-color)";
        ATButtonAddTaskRef.disabled = true;
}

document.querySelector('.calendar-icon').addEventListener('click', function() {
    const input = document.getElementById('add-task-due-date-input');
    input.focus();
    if (input.showPicker) input.showPicker();
});

async function getContactsFromRemoteStorage() {
    let response = await fetch(fetchURLDataBase + '/contacts' + '.json', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }

    });
    const data = await response.json();
    console.log(data);
    return data;
}