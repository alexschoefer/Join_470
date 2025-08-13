let allContacts = [];
let colors = ['#FF7A00', '#FF5EB3', '#FF5EB3', '#9327FF', '#FF4646', '#C3FF2B', '#FF745E', '#FFE62B', '#00BEE8', '#0038FF'];

/**
 * Initializes the contacts view
 * Loads cached contacts from localStorage (if available) and displays them immediately for faster perceived loading time
 * If no cached contact data is available, a loading indicator is displayed until fresh data is loaded
 */
async function initContacts() {
    const savedContactsinStorage = localStorage.getItem("cachedContacts");
    if(savedContactsinStorage) {
      allContacts = JSON.parse(savedContactsinStorage);
      showAllContacts(allContacts);
    }else{
      document.getElementById('contact-list').innerHTML = '<div class="loader">Loading contacts...</div>';
    }
    const freshContacts = await loadAllContactsFromRemoteStorage();
    localStorage.setItem("cachedContacts", JSON.stringify(freshContacts));
    allContacts = freshContacts;
    showAllContacts(allContacts); 
  }


/**
 * Help-function: sorts the contacts alphabetically, groups the sortedContact by their first letter, renders the grouped contacts
 * @param {*} allContacts - An array of contact object to be displayed
 */
function showAllContacts(allContacts) {
    const sortedContacts = sortContactsAlphabetically(allContacts);
    const groupedContacts = findCapitalFirstLetter(sortedContacts);
    renderGroupedContacts(groupedContacts);
}


/**
 * Synchronizes dummy contacts with the remote storage. Loads all existing contacts from the remote database.
 * If a contact with the same email already exists, it is updated.
 * Otherwise, the contact is added to the remote storage.
 */
async function getAllContacts() {
    let existingContacts = await checkExistingContact();
    for (let contact of contactsDummy) {
        let { name, email, phone, initial, profilcolor } = contact;
        let existingProfil = existingContacts.find(c => c.email === email);
        if (existingProfil) {
            await updateContactInRemoteStorage(existingProfil.id, { name, email, phone, initial, profilcolor });
        } else {
            await postContactsToRemoteStorage(name, email, phone, initial, profilcolor);
        }
    }
}


/**
 * Posts a new contact to the remote Firebase database
 * @async
 * @param {string} name - The full name of the contact
 * @param {string} email - The email address of the contact
 * @param {string} phone - The phone number of the contact
 * @param {string} initial - The contact's initials
 * @param {string} profilcolor - The contact's profile color
 * @returns {Promise<Object>} A promise that resolves to the server response 
 */
async function postContactsToRemoteStorage(name, email, phone, initial, profilcolor) {
    let response = await fetch(fetchURLDataBase + '/contacts' + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name, email: email, phone: phone || "", initial: initial, profilcolor: profilcolor})
    });
    return await response.json();
}


/**
 * Help function: By creating an user in sign up process, the new user is also add and save in the remote storage 
 * This function generates the user's initials and profile color
 * @param {*} username - The full name of the new user
 * @param {*} useremail - The email address of the new user
 */
function addNewUserToContacts(username, useremail) {
    let nameInput = username;
    let emailInput = useremail;
    let phoneInput = "";
    let initial = createUserInitial(nameInput.value);
    let profilcolor = getProfilColorIcon();
    postContactsToRemoteStorage(nameInput.value, emailInput.value, phoneInput.value, initial, profilcolor);
}


/**
 * Updates a contact in the remote storage with the given ID
 * @param {*} id - The firebase id of the contact to update
 * @param {*} updatedContact - The updated contact data to be saved
 */
async function updateContactInRemoteStorage(id, updatedContact) {
    await fetch(`${fetchURLDataBase}/contacts/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact)
    });
}


/**
 * Checks the remote storage for existing contacts
 * @async
 * @returns - Returns an empty array if no contacts are found
 */
async function checkExistingContact() {
    const response = await fetch(fetchURLDataBase + '/contacts' + '.json');
    const data = await response.json();
    if (!data) return [];
    return Object.entries(data).map(([id, contact]) => ({
        id,
        ...contact
    }));
}


/**
 * Groups contacts by the capitalized first letter of their name
 * @param {*} allContacts - The array of contact objects to find the capital letter
 * @returns 
 */
function findCapitalFirstLetter(allContacts) {
    let contactList = {};
    allContacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!contactList[firstLetter]) {
            contactList[firstLetter] = [];
        }
        contactList[firstLetter].push(contact);
    });
    return contactList;
}


/**
 * Renders all contacts grouped by their starting capital letter into the contact list container
 * @param {*} groupedContacts - An object where each key is a capital letter and the value is an array of contact objects
 */
function renderGroupedContacts(groupedContacts) {
    const containerList = document.getElementById('contact-list');
    containerList.innerHTML = "";
    const letters = Object.keys(groupedContacts).sort();
    let mainIndex = 0;
    letters.forEach(letter => {
        containerList.innerHTML += getCaptialLetterHeaderTemplate(letter);
        groupedContacts[letter].forEach(contact => {
            containerList.innerHTML += getContactEntryTemplate(contact, mainIndex);
            mainIndex++;
        });
    });
}


/**
 * Displays detailed information for a selected contact for the desktop or mobile view
 *
 * @param {number} index - The index of the selected contact in the allContacts array
 * @param {Event} event - The event object from the click or selection event.
 */
function getContactInformations(index, event) {
    const contact = allContacts[index];
    const selectedContact = document.getElementById('contact-details');
    selectedContact.innerHTML = "";
    toggleActiveContact(event.currentTarget);
    currentOverlayMode = currentDeviceType;
    currentContactIndex = index;
    if (currentDeviceType === 'desktop') {
        selectedContact.innerHTML = showContactInformationsTemplate(contact, index);
    } else {
        getContactInformationMobile(contact, index);
    }
}


/**
 * Shows the selected contact details in mobile view
 * @param {*} contact - The selected contact
 * @param {number} index - The index of the selected contact
 */
function getContactInformationMobile(contact, index) {
    document.getElementById('contact-list')?.classList.add('d_none');
    document.getElementById('contacts-left-container')?.classList.add('d_none');
    let rightContainer = document.getElementById('contacts-right');
    rightContainer.style.display = 'flex';
    let arrowBackRef = document.getElementById('arrow-back');
    arrowBackRef.style.display = 'flex';
    let contactDetails = document.getElementById('contact-details');
    contactDetails.innerHTML = showContactInformationsTemplate(contact, index);
}


/**
 * Renders the Add New Contact overlay based on the current device type
 */
function renderAddContactOverlay() {
    isOverlayOpen = true;
    currentOverlayType = 'add';
    currentOverlayMode = currentDeviceType;
    const container = document.getElementById('addNewContactOverlayContainer');
    container.innerHTML = currentDeviceType === 'mobile' ? addNewContactTemplateMobile() : addNewContactTemplate();
}


/**
 * Toggles the active visual state for the selected contact element.
 * Removes the active state from all other contact entries and applies it to the specified element.
 * @param {*} element - The contact DOM element to activate
 */
function toggleActiveContact(element) {
    document.querySelectorAll('.contact-entry').forEach(entry => {
        entry.classList.remove('contact-entry-active');
        const activeContactName = entry.querySelector('.contact-name');
        if (activeContactName) {
            activeContactName.classList.remove('contact-entry-name-active');
        }
    });
    element.classList.add('contact-entry-active');
    const newActiveContactName = element.querySelector('.contact-name');
    if (newActiveContactName) {
        newActiveContactName.classList.add('contact-entry-name-active');
    }
}


/**
 * Displays the overlay of edding a existing contact for some changes. 
 * @param {number} index - The index of contact to be edited
 */
function editContact(index) {
    const contact = allContacts[index];
    let closeOverlay = document.getElementById('editContactOverlayContainer');
    closeOverlay.classList.remove('d_none');
    renderEditContactOverlay(contact, index);
}


/**
 * Displays the overlay for adding a new contact
 */
function addNewContact() {
    const overlay = document.getElementById('addNewContactOverlayContainer');
    overlay.classList.remove('d_none');
    const mobileAddContactBtn = document.querySelector('.mobile-add-contact-button-create-icon');
    if (mobileAddContactBtn) mobileAddContactBtn.classList.add('d_none');
    renderAddContactOverlay();
}


/**
 * Renders the Edit Contact overlay based on the current device typ
 * @param {*} contact - The selected contact
 * @param {number} index - The index of the selected contact
 */
function renderEditContactOverlay(contact, index) {
    isOverlayOpen = true;
    currentOverlayType = 'edit';
    currentOverlayMode = currentDeviceType;
    lastEditedContact = contact;
    lastEditedIndex = index;
    const container = document.getElementById('editContactOverlayContainer');
    container.innerHTML = currentDeviceType === 'mobile' ? editContactTemplateMobile(contact, index) : editContactTemplate(contact, index);
}


/**
 * Closes the AddContactOverlay in each device type
 */
function closeAddContactOverlay() {
    let closeOverlay = document.getElementById('addNewContactOverlayContainer');
    const mobileAddContactBtn = document.querySelector('.mobile-add-contact-button-create-icon');
    if (mobileAddContactBtn) mobileAddContactBtn.classList.remove('d_none');
    closeOverlay.classList.add('d_none');
}


/**
 * Closes the EditContactOverlay in each device type
 */
function closeEditContactOverlay() {
    let closeOverlay = document.getElementById('editContactOverlayContainer');
    closeOverlay.classList.add('d_none');
}


/**
 * Deletes an selected contact by its index in the firebase remote storage and shows a message if the contact is deleted.
 * @param {number} index - The index of the contact to delete in the allContacts array
 */
async function deleteContact(index) {
    let deleteContact = allContacts[index];
    await fetch(`${fetchURLDataBase}/contacts/${deleteContact.id}.json`, {
        method: "DELETE",
    });
    closeEditContactOverlay();
    showCreateContactSuccess("Contact successfully deleted!");      
    await refreshContacts();          
    clearContactInformations();
    await checkDeleteContactInTasks(deleteContact.name);
}

/**
 * Clears the contact information view and resets the layout for showing the full contact list
 * 
 */
function clearContactInformations() {
    document.getElementById('contact-details').innerHTML = "";
    document.getElementById('contact-list')?.classList.remove('d_none');
    document.getElementById('contacts-left-container')?.classList.remove('d_none');
    document.getElementById('contacts-right')?.style.removeProperty('display');
    document.getElementById('arrow-back')?.style.setProperty('display', 'none');
    const mobileBtns = document.getElementById('mobile-contact-profil-btns-container');
    const mobileWrapper = document.getElementById('mobile-button-wrapper');
    mobileBtns?.classList.remove('slide-in');
    mobileBtns?.classList.add('d_none');
    mobileWrapper?.classList.remove('d_none');
    document.removeEventListener('click', hideMobileContactBtns);
    showAllContacts(allContacts);
}


/**
 * Creates a new contact and stores it in the remote database
 * Prevents default form submission behavior. Extracts input values from the contact form and generates initials and profile color
 * @param {Event} event - The form submission event
 */
async function createContactForRemoteStorage(event) {
    event.preventDefault();
    let nameInput = document.getElementById('username-input');
    let emailInput = document.getElementById('usermail-input');
    let phoneInput = document.getElementById('userphone-input');
    let initial = createUserInitial(nameInput.value);
    let profilcolor = getProfilColorIcon();
    await postContactsToRemoteStorage(nameInput.value, emailInput.value, phoneInput.value, initial, profilcolor);
    closeAddContactOverlay();
    showCreateContactSuccess("Contact successfully created!");
}


/**
 * Validates a single input field within the contact form.
 * 
 * Displays or hides the associated error message depending on the input's validity.
 * Specifically checks the "username" input for a valid full name (at least two words).
 * 
 * @param {HTMLInputElement} input - The input element to validate.
 */
function validateContactFormsInput(input) {
    const errorMessage = document.getElementById(input.id + '-validation-message');
    const wrapper = input.closest('.user-input-wrapper');
    const value = input.value.trim();
    if (!errorMessage || !wrapper) return;
    let isNameValid = value !== '';
    if (input.id === 'username-input' && !isFullNameValid(value)) {
        isNameValid = false;
        errorMessage.textContent = 'Please enter both first and last name.';
    } else {
        errorMessage.textContent = errorMessage.dataset.defaultMessage;
    }
    errorMessage.classList.toggle('d_none', isNameValid);
    wrapper.classList.toggle('input-error', !isNameValid);
    validateContactSectionForms();
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