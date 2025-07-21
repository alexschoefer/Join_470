const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/";
const ATTitleRef = document.getElementById("add-task-title-input");
const ATDescriptionRef = document.getElementById("add-task-description-textarea");
const ATDueDateRef = document.getElementById("add-task-due-date-input");
const ATButtonPrioButtonUrgentRef = document.getElementById("add-task-prio-button-urgent");
const ATButtonPrioButtonMediumRef = document.getElementById("add-task-prio-button-medium");
const ATButtonPrioButtonLowRef = document.getElementById("add-task-prio-button-low");
const ATAssignToRef = document.getElementById("add-task-assign-to");
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
const ATSubtasksIconAddRef = document.getElementById('add-task-subtasks-icon-add');
const dropdownSelected = document.getElementById('customDropdownSelected');
const dropdownMenu = document.getElementById('add-task-assigned-to-select');
const dropdownArrow = document.getElementById('customDropdownArrow');
const dropdownSelectedText = document.getElementById('customDropdownSelectedText');
const chosenDiv = document.getElementById('add-task-assigned-to-chosen-initials');
const categoryDropdownSelected = document.getElementById('categoryDropdownSelected');
const categoryDropdownMenu = document.getElementById('add-task-category-select');
const categoryDropdownArrow = document.getElementById('categoryDropdownArrow');
const categoryDropdownWrapper = document.getElementById('categoryDropdownWrapper');
const categoryRequired = document.getElementById('category-required');
const customDropdownWrapper = document.getElementById('customDropdownWrapper');
const ATdueDateInput = document.getElementById('add-task-due-date-input');
const ATcategory = document.getElementById('categoryDropdownSelectedText');

let categoryDropdownOpen = false;
let dropdownOpen = false;
let prioButtonState = "Medium";
let subtasks = [""];
let subtasksObject = {};
let assignedCheckbox = [];
let resultContactList = [];

ATTitleRef.addEventListener('input', checkRequiredFieldsAndToggleButton);
ATDueDateRef.addEventListener('input', checkRequiredFieldsAndToggleButton);
ATTitleRef.addEventListener('blur', validateTitle);
ATDueDateRef.addEventListener('blur', validateDueDate);
ATSubtaskInput.addEventListener('focus', showClearAndDoneButtons);
ATSubtaskInput.addEventListener('blur', hideClearAndDoneButtons);

ATSubtaskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTaskAddSubtask();
    }
});

ATButtonAddTaskRef.addEventListener('click', function (event) {
    if (!validateAddTaskInputs()) {
        event.preventDefault();
    }
    else {
        sendAddTaskData();
    }
});

categoryDropdownSelected.addEventListener('click', function (event) {
    event.stopPropagation();
    categoryDropdownOpen = !categoryDropdownOpen;
    categoryDropdownMenu.style.display = categoryDropdownOpen ? 'block' : 'none';
    categoryDropdownArrow.classList.toggle('open', categoryDropdownOpen);
});

dropdownSelected.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdownOpen = !dropdownOpen;
    dropdownMenu.style.display = dropdownOpen ? 'block' : 'none';
    dropdownArrow.classList.toggle('open', dropdownOpen);
});

ATdueDateInput.addEventListener('input', function () {
    if (this.value) {
        this.classList.add('date-selected');
    } else {
        this.classList.remove('date-selected');
    }
});

document.addEventListener('click', function (e) {
    if (!customDropdownWrapper.contains(e.target)) {
        dropdownMenu.style.display = 'none';
        dropdownArrow.classList.remove('open');
        dropdownOpen = false;
    }
    if (!categoryDropdownWrapper.contains(e.target)) {
        categoryDropdownMenu.style.display = 'none';
        categoryDropdownArrow.classList.remove('open');
        categoryDropdownOpen = false;
    }
});

function addTaskInit() {
    getContactsFromRemoteStorage();
    loadCategoryOptions();
}

async function sendAddTaskData() {
    saveUserInputsForFirebase();
    startTaskAddedFinishAnimation();
     setTimeout(() => {
        resetAddTaskForm();
    }, 1100);
}

async function saveUserInputsForFirebase() {
    let title = ATTitleRef.value;
    let description = ATDescriptionRef.value;
    let date = ATDueDateRef.value;
    let priority = prioButtonState;
    let status = "toDo";
    let assignTo = getAssignedContacts();
    let category = ATcategory.textContent;
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

async function getNextTaskId() {
    let res = await fetch(fetchURLDataBase + "/tasks.json");
    let data = await res.json();
    let existingIds = data ? Object.keys(data).map((id) => parseInt(id)) : [];
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
}

async function postAddTaskDataToFirebase(title, description, date, priority, status, assignTo, category, subtasks) {
    const nextId = await getNextTaskId();
    const newTask = {
        title,
        description,
        priority,
        status,
        dueDate: date,
        subtasks,
        assigned: assignTo,
        category,
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

function addTaskPrioButtonClick(state) {
    prioButtonState = state;
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
    resetAddTaskSubtaskInput();
    ADSShowIcons();
}

function subtasksToArray() {
    const inputData = document.getElementById("add-task-subtasks-input").value;
    subtasks.push(inputData);
    subtaskRender();
}

function subtaskRender() {
    allSubtasks.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtaski = subtasks[i];
        if (subtaski !== "") {
            allSubtasks.innerHTML += addSubtaskTemplate(i, subtaski);
        }
    }
    ADSShowIcons();
}

function deleteAddTaskSubtask(index) {
    subtasks.splice(index, 1);
    subtaskRender(index);
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
     console.log('validateCategory aufgerufen');
    const selectedText = ATcategory.textContent;
     console.log('Kategorie:', selectedText);
    const defaultText = 'Select a category';
    if (selectedText === defaultText) {
        categoryDropdownSelected.classList.add('error');
        categoryRequired.classList.remove('d_none');
        return false;
    } else {
        categoryDropdownSelected.classList.remove('error');
        categoryRequired.classList.add('d_none');
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

function checkRequiredFieldsAndToggleButton() {
    const titleFilled = ATTitleRef.value.trim() != "";
    const dueDateFilled = ATDueDateRef.value.trim() != "";
    const categoryFilled = ATcategory.textContent.trim() != "Select a category";
    if (titleFilled && dueDateFilled && categoryFilled) {       
        ATButtonAddTaskRef.disabled = false;
    } else {
        ATButtonAddTaskRef.disabled = true;
    }
}

document.querySelector('.calendar-icon').addEventListener('click', function () {
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
    await createAddTaskContacts(data);
}

async function createAddTaskContacts(data) {
    resultContactList = [];
    assignedCheckbox = [];
    for (const key in data) {
        const contact = data[key];
        resultContactList.push({ email: contact.email, initial: contact.initial, name: contact.name, phone: contact.phone, color: contact.profilcolor});
        assignedCheckbox.push({ checkbox: false }); 
    }
    await loadAddTaskAssignedTo(resultContactList);
}

function getAssignedContacts() {
    const assigned = [];
    assignedCheckbox.forEach((item, i) => {
        if (item.checkbox) {
            assigned.push(resultContactList[i].name);
        }
    });
    return assigned;
}

async function loadAddTaskAssignedTo(result) {
    const optionToRender = document.getElementById('add-task-assigned-to-select');
    optionToRender.innerHTML = "";
    result.forEach((contact, i) => {
        optionToRender.innerHTML += getAssignedContactTemplate(contact, i);
    });
}

async function assignedCheckboxClick(event, id) {
    event.stopPropagation();
    const ATContactOptionCheckboxRef = document.getElementById('ATContact-option-checkbox' + id);
    if (!assignedCheckbox[id].checkbox) {
        ATContactOptionCheckboxRef.classList.remove('ATContact-option-checkbox');
        ATContactOptionCheckboxRef.classList.add('ATContact-option-checkbox-checked');
        assignedCheckbox[id].checkbox = true;
    } else {
        ATContactOptionCheckboxRef.classList.remove('ATContact-option-checkbox-checked');
        ATContactOptionCheckboxRef.classList.add('ATContact-option-checkbox');
        assignedCheckbox[id].checkbox = false;
    }
    updateChosenInitials();
}

function updateChosenInitials() {
    const parent = chosenDiv.closest('.add-task-form-right-select-contacts');
    chosenDiv.innerHTML = '';
    let hasInitials = false;
    assignedCheckbox.forEach((item, i) => {
        if (item.checkbox) {
            hasInitials = true;
            const contact = resultContactList[i];
            chosenDiv.innerHTML += getInitialsTemplate(contact);
        }
    });
    if (parent) {
        parent.classList.toggle('has-initials', hasInitials);
    }
}

function resetAddTaskForm() {
    ATTitleRef.value = "";
    ATDescriptionRef.value = "";
    ATDueDateRef.value = "";
    allSubtasks.innerHTML = "";
    ATSubtaskInput.value = "";
    ATcategory.textContent = 'Select a category';
    assignedCheckbox.forEach(item => item.checkbox = false);
    updateChosenInitials();
    loadCategoryOptions();
}

function createCategoryOption(cat) {
    const option = document.createElement('div');
    option.className = 'ATcustom-dropdown-option';
    option.dataset.value = cat.value;
    option.innerHTML = `<span class="ATContact-option-name">${cat.label}</span>`;
    option.addEventListener('click', function (event) {
        event.stopPropagation();
        ATcategory.textContent = cat.label;
        checkRequiredFieldsAndToggleButton();
        categoryDropdownMenu.style.display = 'none';
        categoryDropdownArrow.classList.remove('open');
    });
    return option;
}

function loadCategoryOptions() {
    categoryDropdownMenu.innerHTML = '';
    const categories = [
        { value: 'Technical Task', label: 'Technical Task' },
        { value: 'User Story', label: 'User Story' }
    ];
    categories.forEach(cat => {
        const option = createCategoryOption(cat);
        categoryDropdownMenu.appendChild(option);
    });
}

