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
const ATButtonAddTaskRef = document.getElementById('add-task-button-create-task');
const ATButtonCancelRef = document.getElementById('add-task-cancel-button');
let prioButtonState = 0;

// 'function addTaskPrioButtonClick(buttonState) {
//     ATPrioButtonDefaultState();
//   console.log(buttonState);

//     switch (buttonState) {
//         case 'urgent':
//         ATButtonPrioButtonUrgentRef.classList.add("add-task-priority-button-urgent-active");
//         break;
//         case 'medium':
//         ATButtonPrioButtonMediumRef.classList.add("add-task-priority-button-medium-active");
//         break;
//         case 'low':
//         ATButtonPrioButtonLowRef.classList.add("add-task-priority-button-low-active");
//         break;
//         default:
//         return;
//     }

// }

// function ATPrioButtonDefaultState() {
//     ATButtonPrioButtonUrgentRef.classList = "add-task-priority-button-urgent-active" ?  ATButtonPrioButtonUrgentRef.classList.remove("add-task-priority-button-urgent-active") : 
//     ATButtonPrioButtonMediumRef.classList = ("add-task-priority-button-medium-active") ;

//     ATButtonPrioButtonMediumRef.classList.remove("add-task-priority-button-medium-active");
//     ATButtonPrioButtonLowRef.classList.remove("add-task-priority-button-low-active");
// }'

async function sendAddTaskData() {
   saveUserInputsForFirebase();

}

async function checkIdAmount() {
    
    let response = await fetch(fetchURLDataBase + '/taskData' + ".json");
    let data = await response.json();
    let id = Object.keys(data).length + 1;
    return id;
}

function subtasksToArray() {

let subtasks = [
      { title: "Save selected theme in localStorage", done: true },
      { title: "Save selected theme in localStorage", done: false },
      { title: "Load and apply theme on page load", done: false },
    ];

}

function assignedToArray() {
    let assigned = ["Alan Turing", "Shafi Goldwasser"];
   return assigned;
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
    let category = ATCategoryRef.value;
    let subtasks = ATSubtasksRef.value;
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
                "category": getAddTaskCategory()
            }
        )
    });   
    resetAddTaskForm();
    return responseToJson = await response.json();
}




function resetAddTaskForm() {
    document.getElementById('add-task-title').value = '';
    document.getElementById('add-task-description-textarea').value = '';
    document.getElementById('add-task-due-date-input').value = '';
    // document.getElementById('add-task-assign-to').value = '';
    document.getElementById('add-task-category').value = '';
    document.getElementById('add-task-subtasks-input').value = '';
    // ATButtonPrioButtonUrgentRef.classList.remove("add-task-priority-button-urgent-active");
    // ATButtonPrioButtonMediumRef.classList.remove("add-task-priority-button-medium-active");
    // ATButtonPrioButtonLowRef.classList.remove("add-task-priority-button-low-active");
}

function addTaskPrioButtonClick(state) {
    prioButtonState = state;
}

function getAddTaskCategory() {
    let category = ATCategoryRef.value;
    return category;
}
