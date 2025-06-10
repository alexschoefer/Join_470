let addTaskPrioButtonState = "";

const atButtonPriorityUrgentRef = document.getElementById('add-task-priority-urgent');
const atButtonPriorityMediumRef = document.getElementById('add-task-priority-medium');
const atButtonPriorityLowRef = document.getElementById('add-task-priority-low');


function addTaskInit() {

}
// die buttons müssen dynamisch aus dem Template geladen werden !!!!
function addTaskPrioButton(buttonType) {
    if (!atButtonPriorityUrgentRef || !atButtonPriorityMediumRef || !atButtonPriorityLowRef) return;

    if (buttonType === "urgent") {
        atButtonPriorityUrgentRef.style.backgroundColor = "var(--button-urgent)";
        atButtonPriorityMediumRef.style.backgroundColor = "var(--white)";
        atButtonPriorityLowRef.style.backgroundColor = "var(--white)";
        addTaskPrioButtonState = buttonType;
    }
    if (buttonType === "medium") {
        atButtonPriorityUrgentRef.style.backgroundColor = "var(--white)";
        atButtonPriorityMediumRef.style.backgroundColor = "var(--button-medium)";
        atButtonPriorityLowRef.style.backgroundColor = "var(--white)";
        addTaskPrioButtonState = buttonType;
    }
    if (buttonType === "low") {
        atButtonPriorityUrgentRef.style.backgroundColor = "var(--white)";
        atButtonPriorityMediumRef.style.backgroundColor = "var(--white)";
        atButtonPriorityLowRef.style.backgroundColor = "var(--button-low)";
        addTaskPrioButtonState = buttonType;
    }
    console.log(buttonType);
    
}