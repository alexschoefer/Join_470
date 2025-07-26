const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/";
let currentDeviceType = ''; // 'mobile' oder 'desktop'
let currentOverlayMode = ''; // Overlay-Status ('mobile' oder 'desktop')
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
 * Help function - Checks whether all input fields with the class "user-input" have been filled out.
 * 
 * Iterates through all relevant input fields and returns false if any of them are empty
 * (after trimming whitespace). Returns true only if all fields contain a value.
 * 
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
 * 
 * Trims the input and checks it against a regular expression pattern for basic email structure.
 * 
 * @param {string} email - The email adress to validate.
 * @returns Returns true if the email is valid, otherwise false.
 */

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
}

/**
 * Help-function - Enables or disables the sign-up button based on the provided state.
 *
 * @param {boolean} enabled - If true, the sign-up button is enabled; if false, it is disabled.
 */
function setSignUpButtonState(enabled) {
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