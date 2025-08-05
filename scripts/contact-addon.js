/**
 * Refreshes the contact list by loading all contacts from remote storage
 */
async function refreshContacts() {
    allContacts = await loadAllContactsFromRemoteStorage();
    showAllContacts(allContacts);
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