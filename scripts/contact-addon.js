/**
 * Refreshes the contact list by loading all contacts from remote storage
 */
async function refreshContacts() {
    allContacts = await loadAllContactsFromRemoteStorage();
    showAllContacts(allContacts);
}


/**
 * Help function - Sorts an array of contact objects alphabetically by their name
 * @param {*} allContacts - The array of contact objects to sort
 * @returns - The sorted array of contacts
 */
function sortContactsAlphabetically(allContacts) {
    return allContacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Hides the mobile contact action buttons when clicking outside the button container
 * @param {MouseEvent} event - The click event outside triggered  on the document
 */
function hideMobileContactBtns(event) {
    const btnContainer = document.getElementById('mobile-contact-profil-btns-container');
    const isClickInsideMenu = btnContainer.contains(event.target);
    if (!isClickInsideMenu) {
        btnContainer.classList.remove('slide-in');
        setTimeout(() => {
            btnContainer.classList.add('d_none');
        }, 400);
        document.getElementById('mobile-button-wrapper').classList.remove('d_none');
        document.removeEventListener('click', hideMobileContactBtns);
    }
}


/**
 * Updates a contact's information in the remote storage based on user input changes. After that, the sorted contact list is displayed.
 * @param {*} id - The user id of the contact to update
 * @param {Event} event - The form submission event
 * @param {*} profilcolor - The contact´s profil color
 * @param {String} initial - The initial of the user
 */
async function getChangesFromContact(id, event, profilcolor, initial) {
    event.preventDefault();
    let nameInput = document.getElementById('username-input');
    let emailInput = document.getElementById('usermail-input');
    let phoneInput = document.getElementById('userphone-input');
    let initialInput = createUserInitial(nameInput.value);
    const updatedContact = {
        name: nameInput.value, email: emailInput.value, phone: phoneInput.value, profilcolor: profilcolor, initial: initialInput
    };
    await updateContactInRemoteStorage(id, updatedContact);
    closeEditContactOverlay();
    showCreateContactSuccess("Contact successfully updated!");
    await refreshContacts();
    clearContactInformations();
}


/**
 * Displays the edit/delete button container for a contact on mobile view
 */
function changeContact() {
    const btnContainer = document.getElementById('mobile-contact-profil-btns-container');
    const mobileBtnWrapper = document.getElementById('mobile-button-wrapper');
    mobileBtnWrapper.classList.add('d_none');
    btnContainer.classList.remove('d_none');
    setTimeout(() => {
        btnContainer.classList.add('slide-in');
        document.addEventListener('click', hideMobileContactBtns);
    }, 10);
}

/**
 * Remove the localStorage for the key "cachedContacts"
 */
function resetDummySync() {
    localStorage.removeItem("cachedContacts");
}


/**
 * Displays a temporary success message in the feedback overlay
 * @param {string} message - The message to display (given in the function)
 */
async function showCreateContactSuccess(message) {
    const overlay = document.getElementById('success-message-overlay');
    const messageBox = document.getElementById('feedback-message');
    messageBox.innerText = message;
    overlay.classList.remove('d_none');
    overlay.classList.add('show');
    setTimeout(() => {
        overlay.classList.add('d_none');
        overlay.classList.remove('show');
    }, 800);
    await initContacts();
}


/**
* Help-function - Checking the required input email by adding or eding a contact
* Displays an error message if the email is not valid by the function isValidEmail
* Also triggers re-validation of the entire signup form to update the submit button state.
* @param {HTMLInputElement} input - The input field to be validated.
*/
function checkRequiredInputContactEmail(input) {
    let email = input.value.trim();
    let errorMessage = document.getElementById('usermail-input-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    if (!isValidEmail(email)) {
        errorMessage.classList.remove('d_none');
        wrapper.classList.add('input-error');
    } else {
        errorMessage.classList.add('d_none');
        wrapper.classList.remove('input-error');
    }
}


/**
 * Checks all tasks for a contact assigned by name and removes the contact from the assigned list if found. 
 * If a change is made, the task is updated in the database.
 * 
 * @param {*} contactName - The contact who should be delete in the tasks
 * @returns {Promise<void>} Resolves when all necessary tasks have been updated.
 */
async function checkDeleteContactInTasks(contactName) {
    try {
        const response = await fetch(`${fetchURLDataBase}/tasks.json`);
        const existingTaskData = await response.json();
        if (!existingTaskData) return;
        const tasks = Object.entries(existingTaskData);
        for (let [taskId, task] of tasks) {
            const assignedContactsBefore = task.assigned || [];
            const updatedContactsAssigned = assignedContactsBefore.filter(person => person.name !== contactName);
            if (updatedContactsAssigned.length !== assignedContactsBefore.length) {
                task.assigned = updatedContactsAssigned;
                await updateTaskOnContactDelete(taskId, task);
            }
        }
    } catch (error) {
        console.error("Error by Deleting assigned Contact in the tasks:", error);
    }
}


/**
 * Updates a task in the database after deleting an assigned contact.
 *
 * @param {string} taskId - The unique ID of the task to update.
 * @param {Object} updatedTask - The updated task object to be saved.
 */
async function updateTaskOnContactDelete(taskId, updatedTask) {
    try {
        await fetch(`${fetchURLDataBase}/tasks/${taskId}.json`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
        });
    } catch (error) {
        console.error(`Error by updating a task by ${taskId}:`, error);
    }
}


/**
 * Checks whether a full name string contains at least two words
 * 
 * @param {string} fullName - The full name string to validate.
 * @returns {boolean} True if the name has at least two non-empty parts; otherwise, false.
 */
function isFullNameValid(fullName) {
    return fullName.trim().split(' ').filter(Boolean).length >= 2;
}