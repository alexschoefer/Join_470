const ATTitleRef = document.getElementById('add-task-title');
const ATDescriptionRef = document.getElementById('add-task-description');
const ATDueDateRef = document.getElementById('add-task-due-date');
const ATButtonPrioButtonUrgentRef = document.getElementById('add-task-prio-button-urgent');
const ATButtonPrioButtonMediumRef = document.getElementById('add-task-prio-button-medium');
const ATButtonPrioButtonLowRef = document.getElementById('add-task-prio-button-low');
const ATAssignToRef = document.getElementById('add-task-assign-to');
const ATCategoryRef = document.getElementById('add-task-category');
const ATSubtasksRef = document.getElementById('add-task-subtasks');
const ATButtonAddTaskRef = document.getElementById('add-task-button-create-task');
const ATButtonCancelRef = document.getElementById('add-task-cancel-button');


function addTaskPrioButtonClick(buttonState) {
//   ATPrioButtonDefaultState(); 
  console.log(buttonState);
  
    switch (buttonState) {
        case 'urgent':
        ATButtonPrioButtonUrgentRef.classList.add("add-task-priority-button-urgent-active");
        break;
        case 'medium':
        ATButtonPrioButtonMediumRef.classList.add("add-task-priority-button-medium-active");
        break;
        case 'low':
        ATButtonPrioButtonLowRef.classList.add("add-task-priority-button-low-active");
        break;
        default:
        return;
    }
 
}

function ATPrioButtonDefaultState() {
    ATButtonPrioButtonUrgentRef.classList.remove("add-task-priority-button-urgent-active");
    ATButtonPrioButtonMediumRef.classList.remove("add-task-priority-button-medium-active");
    ATButtonPrioButtonLowRef.classList.remove("add-task-priority-button-low-active");
}
