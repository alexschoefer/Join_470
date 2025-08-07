/**
 * Loads all contacts from remote storage (Firebase) and creates the contact list for the Add Task form.
 * @async
 * @returns {Promise<void>}
 */
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


/**
 * Creates the contact list and the corresponding checkbox array for the Add Task form.
 * @async
 * @param {Object} data - The contact data from the database.
 * @returns {Promise<void>}
 */
async function createAddTaskContacts(data) {
    resultContactList = [];
    assignedCheckbox = [];
    for (const key in data) {
        const contact = data[key];
        resultContactList.push({ email: contact.email, initial: contact.initial, name: contact.name, phone: contact.phone, color: contact.profilcolor });
        assignedCheckbox.push({ checkbox: false });
    }
    await loadAddTaskAssignedTo(resultContactList);
}


/**
 * Renders the contact selection list in the Add Task form and marks the logged-in user with "(You)".
 * @async
 * @param {Object[]} result - Array of contact objects.
 * @returns {Promise<void>}
 */
async function loadAddTaskAssignedTo(result) {
    const optionToRender = document.getElementById('add-task-assigned-to-select');
    optionToRender.innerHTML = "";
    const loggedUserString = localStorage.getItem("loggedInUser");
    let loggedUserName = "";
    if (loggedUserString) {
        const loggedUser = JSON.parse(loggedUserString);
        loggedUserName = loggedUser.name;
    }
    result.forEach((contact, i) => {
        if (loggedUserName === contact.name) {
            optionToRender.innerHTML += getAssignedContactTemplate(contact, i, "(You)");
        } else {
            optionToRender.innerHTML += getAssignedContactTemplate(contact, i, "");
        }
    });
}


/**
 * Handles the click on a contact checkbox in the Add Task form.
 * @async
 * @param {Event} event - The click event.
 * @param {number} id - The index of the contact in the list.
 * @returns {Promise<void>}
 */
async function assignedCheckboxClick(event, id) {
    if (typeof typeOfScreen === 'string' && typeOfScreen.includes('mobile')) {
        return changeContactBackgroun(event, id);
    }
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

function changeContactBackgroun(event, id){
     event.stopPropagation();
      const ATContactOptionCheckboxRef = document.getElementById('ATContact-option-checkbox' + id);
      const ATcustomDropdownMobileOption = document.getElementById('ATcustom-dropdown-Mobile-option-' + id);
      const ATContactOptionName = document.getElementById('ATContact-option-name-' + id);
    if (!assignedCheckbox[id].checkbox) {
        ATContactOptionCheckboxRef.classList.remove('ATContact-option-checkbox');
        ATContactOptionCheckboxRef.classList.add('ATContact-option-checkbox-checked');
        assignedCheckbox[id].checkbox = true;
        ATcustomDropdownMobileOption.classList.add("blueBackground");
        ATContactOptionName.style.color = "#FFFFFF";
    } else {
        ATContactOptionCheckboxRef.classList.remove('ATContact-option-checkbox-checked');
        ATContactOptionCheckboxRef.classList.add('ATContact-option-checkbox');
        assignedCheckbox[id].checkbox = false;
        ATcustomDropdownMobileOption.classList.remove("blueBackground");
        ATContactOptionName.style.color = "";
    }
    updateChosenInitials();
}


/**
 * Updates the display of the initials of the selected contacts in the Add Task form.
 */
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

function changeContactsBackgroundColor(){
    if(typeOfScreen == "mobile"){
        
    }
}