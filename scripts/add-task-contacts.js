/**
 * Lädt alle Kontakte aus dem Remote-Storage (Firebase) und erstellt die Kontaktliste für das Add-Task-Formular.
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
 * Erstellt die Kontaktliste und das zugehörige Checkbox-Array für das Add-Task-Formular.
 * @async
 * @param {Object} data - Die Kontaktdaten aus der Datenbank.
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
 * Rendert die Kontakt-Auswahlliste im Add-Task-Formular und markiert den eingeloggten User mit "(You)".
 * @async
 * @param {Object[]} result - Array der Kontaktobjekte.
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
 * Handhabt das Klicken auf eine Kontakt-Checkbox im Add-Task-Formular.
 * @async
 * @param {Event} event - Das Click-Event.
 * @param {number} id - Der Index des Kontakts in der Liste.
 * @returns {Promise<void>}
 */
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


/**
 * Aktualisiert die Anzeige der Initialen der ausgewählten Kontakte im Add-Task-Formular.
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
