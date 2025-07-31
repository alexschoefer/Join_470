const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/";
let currentDeviceType = ''; 
let currentOverlayMode = '';
let isOverlayOpen = false;
let currentOverlayType = null;
let lastEditedContact = null;
let lastEditedIndex = null;
let currentContactIndex = null;

/**
 * On DOMContentLoaded event, calls updateDeviceType to initialize the device type based on the current window size.
 */
document.addEventListener('DOMContentLoaded', updateDeviceType);


/**
 * Adds a listener for window resize events to update the device type dynamically whenever the window size changes.
 */
window.addEventListener('resize', updateDeviceType);


/**
 * Updates the current device type based on the current window width. Triggers layout adaptation and overlay re-rendering when the device type changes.
 * Updates the displayed contact information if a contact is currently selected.
 */
function updateDeviceType() {
    const width = window.innerWidth;
    const newType = width < 1230 ? 'mobile' : 'desktop';
    if (newType !== currentDeviceType) {
        currentDeviceType = newType;
        if (isOverlayOpen) {
            if (currentOverlayType === 'add') {
                renderAddContactOverlay();
            } else if (currentOverlayType === 'edit') {
                renderEditContactOverlay(lastEditedContact, lastEditedIndex);
            }
        }
        adaptLayoutOnResize();
        if (currentContactIndex !== null && document.getElementById('contact-details').innerHTML.trim()) {
            const contactEntry = document.querySelectorAll('.contact-entry')[currentContactIndex];
            if (contactEntry) getContactInformations(currentContactIndex, { currentTarget: contactEntry });
        }
    }
}


/**
 * Adjusts the layout of the contact view depending on the device type (desktop or mobile) and whether a contact is currently selected.
 * On desktop: shows all sections. In the mobile view hides the left container and contact list if a contact is open.
 */
function adaptLayoutOnResize() {
    const contactDetails = document.getElementById('contact-details');
    if(!contactDetails) return; 
    const contactIsOpen = document.getElementById('contact-details').innerHTML.trim() !== '';
    const containerLeft = document.getElementById('contacts-left-container');
    const contactList = document.getElementById('contact-list');
    const contactRight = document.getElementById('contacts-right');
    const isDesktop = currentDeviceType === 'desktop';
    const showRight = isDesktop || contactIsOpen;
    contactRight.style.display = showRight ? 'flex' : 'none';
    containerLeft.classList.toggle('d_none', !isDesktop && contactIsOpen);
    contactList.classList.toggle('d_none', !isDesktop && contactIsOpen);
}


/**
 * Stops the propagation of the given event to parent elements
 * @param {Event} event - The event object to stop propagation on
 */
function bubblingPropagation(event) {
    event.stopPropagation();
}


/**
 * Clears the error message and removes the error styling for a given input element
 * @param {HTMLInputElement} input - The input element whose error message should be cleared
 */
function clearErrorMessage(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    errorMessage.classList.add('d_none');
    wrapper.classList.remove('input-error');
    const defaultText = errorMessage.getAttribute('data-default-message');
    if (defaultText && errorMessage.innerHTML !== defaultText) {
        errorMessage.innerHTML = defaultText;
    }
}


/**
 * Changes the icon in the input field for password
 * If the length of the input is bigger than 0 then a new icon will be placed in the input field
 * Otherwise if the field is empty, it shows a default lock icon.
 * @param {HTMLInputElement} input 
 */
function changePasswordIcon(input) {
    const container = input.closest('.input-container');
    const icon = container.querySelector('.password-icon');

    if (input.value.trim().length > 0) {
        icon.src = "../assets/icons/visibility-off-icon.png";
        icon.classList.add('visibility-off-icon');
    } else {
        icon.src = "../assets/icons/lock-icon.png";
        icon.classList.remove('visibility-off-icon');
    }
}

/**
 * Toggles the visibility of a password input field.
 * Switches the input type between "password" and "text" based on its current state, allowing the user to show or hide the entered password. Also updates the icon accordingly.
 * This function only toggles the input if it contains a non-empty value.
 * @param {HTMLImageElement} iconElement - The eye icon element that was clicked to toggle visibility.
 */
function toggleInputTypePassword(iconElement) {
    const container = iconElement.closest('.input-container');
    const input = container.querySelector('input');

    if (input.type === 'password' && input.value.trim().length > 0) {
        input.type = 'text';
        iconElement.src = "../assets/icons/visibility-icon.png";
    } else if (input.type === 'text' && input.value.trim().length > 0) {
        input.type = 'password';
        iconElement.src = "../assets/icons/visibility-off-icon.png";
    }
}


/**
 * Validates the contact form section by checking if all inputs are filled and if the email input has a valid format.
 * Enables or disables the sign-up/create/edit button based on the validation result.
 */
function validateContactSectionForms() {
    const filled = areAllInputsFilled();
    const emailInput = document.getElementById('usermail-input');
    const emailOK = isValidEmail(emailInput.value);
    const formValid = filled && emailOK;
    setButtonState(formValid);
}


/**
 * Help function - Checks whether all input fields with the class "user-input" have been filled out
 * Iterates through all relevant input fields and returns false if any of them are empty
 * Returns true only if all fields contain a value.
 * @returns {boolean} Returns true if all input fields are filled, otherwise false.
 */
function areAllInputsFilled() {
    const inputs = document.querySelectorAll('.user-input');
    for (let input of inputs) {
        if (input.value.trim() === '') {
            return false;
        }
    }
    return true;
}


/**
 * Help-function - Validates a given user-email 
 * Trims the input and checks it against a regular expression pattern for basic email structure.
 * @param {string} email - The email adress to validate.
 * @returns Returns true if the email is valid, otherwise false.
 */

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
}


/**
 * Help-function - Enables or disables the sign-up button based on the provided state.
 * @param {boolean} enabled - If true, the sign-up button is enabled; if false, it is disabled.
 */
function setButtonState(enabled) {
    const button = document.getElementById('btn-form') ;
    button.disabled = !enabled;
}


/**
 * Creates the user initials form the given username
 * @param {String} nameInput - The full name input string
 * @returns {string} The initials 
 */
function createUserInitial(nameInput) {
    let initial = nameInput.trim().split(' ');
    let firstLetterInitial = initial[0].charAt(0).toUpperCase();
    let secondLetterInitial = initial[1].charAt(0).toUpperCase();
    return firstLetterInitial + secondLetterInitial;
}


/**
 * Returns a random color from the given colors array
 * @returns {string} A random color value
 */
function getProfilColorIcon() {
    return colors[Math.floor(Math.random() * colors.length)];
}


/**
 * Handles the back navigation from the contact detail view to the contact list
 */
function arrowBack() {
    document.getElementById('contact-list').classList.remove('d_none');
    document.getElementById('contacts-left-container').classList.remove('d_none');
    document.getElementById('contacts-right').style.display = 'none';
    document.getElementById('contact-details').innerHTML = "";
    let arrowBackRef = document.getElementById('arrow-back');
    arrowBackRef.style.display = 'none';
    refreshContacts();
}


/**
 * Combines two arrays (names and colors) into an array of objects with name and color.
 * 
 * @param {string[]} assignTo - Array with the names of the assigned persons.
 * @param {string[]} colorTo - Array with the colors assigned to the persons.
 * @returns {Object[]} Array of objects with { name, color }
 */
function combineAssignedWithColors(assignTo, colorTo) {
    return assignTo.map((name, i) => ({
        name: name,
        color: colorTo[i] || "#CCCCCC"
    }));
}


/**
 * Baut ein Task-Objekt aus den übergebenen Parametern.
 * @param {number} nextId - Die ID für die neue Task.
 * @param {string} title - Der Titel der Task.
 * @param {string} description - Die Beschreibung der Task.
 * @param {string} date - Das Fälligkeitsdatum.
 * @param {string} priority - Die Priorität.
 * @param {string} status - Der Status.
 * @param {Object[]} assigned - Array der zugewiesenen Personen.
 * @param {string} category - Die Kategorie.
 * @param {Object[]} subtasks - Array der Subtasks.
 * @returns {Object} Das Task-Objekt.
 */
function buildTaskData(nextId, title, description, date, priority, status, assigned, category, subtasks) {
    return {
        title,
        description,
        priority,
        status,
        dueDate: date,
        subtasks,
        assigned,
        category,
        id: nextId
    };
}


/**
 * Fetches the next free task ID from the database.
 * @async
 * @returns {Promise<number>} The next free ID.
 */
async function getNextTaskId() {
    let res = await fetch(fetchURLDataBase + "/tasks.json");
    let data = await res.json();
    let existingIds = data ? Object.keys(data).map((id) => parseInt(id)) : [];
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
}


/**
 * Fetches the next free ID for a new task, based on the number of existing tasks.
 * @async
 * @returns {Promise<number>} The next free ID (number of tasks + 1).
 */
async function checkIdAmount() {
    let response = await fetch(fetchURLDataBase + "/tasks" + ".json");
    let data = await response.json();
    let id = Object.keys(data).length + 1;
    return id;
}


/**
 * Returns an array of the names of all currently selected contacts.
 * @returns {string[]} Array with the names of the selected contacts.
 */
function getAssignedContacts() {
    const assigned = [];
    assignedCheckbox.forEach((item, i) => {
        if (item.checkbox) {
            assigned.push(resultContactList[i].name);
        }
    });
    return assigned;
}


/**
 * Returns an array of the selected colors of the assigned contacts.
 * @returns {string[]} Array with the colors of the selected contacts.
 */
function getAssignedColor() {
    const color = [];
    assignedCheckbox.forEach((item, i) => {
        if (item.checkbox) {
            color.push(resultContactList[i].color);
        }
    });
    return color;
}


/**
 * Collects all entered subtasks from the DOM and returns them as an array of objects.
 * @returns {Object[]} Array of subtask objects with { title, done }
 */
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


/**
 * Checks whether all required fields are filled and enables/disables the "Add Task" button accordingly.
 */
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


/**
 * Shows a success message if the new contact is created
 */
async function showCreateContactSuccess() {
    const overlay = document.getElementById('success-message-overlay');
    overlay.classList.remove('d_none');
    overlay.classList.add('show');
    setTimeout(() => {
        overlay.classList.add('d_none');
        overlay.classList.remove('show');
    }, 800);
    await initContacts();
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
 *  Loads all contacts from remote storage and returns them as an array
 * @async
 * @returns - Array of contact objects including id and contact data
 */
async function loadAllContactsFromRemoteStorage() {
    const response = await fetch(fetchURLDataBase + '/contacts' + '.json');
    const contactsData = await response.json();
    return Object.entries(contactsData).map(([id, contact]) => ({
        id,
        ...contact
    }));
}
