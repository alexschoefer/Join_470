const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/";
let currentDeviceType = ''; // 'mobile' oder 'desktop'
let currentOverlayMode = ''; // Overlay-Status ('mobile' oder 'desktop')
let isOverlayOpen = false;
let currentOverlayType = null;
let lastEditedContact = null;
let lastEditedIndex = null;
let currentContactIndex = null;

// Initial einmal festlegen
document.addEventListener('DOMContentLoaded', updateDeviceType);

// Laufend prüfen beim Resizen
window.addEventListener('resize', updateDeviceType);

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

function bubblingPropagation(event) {
    event.stopPropagation();
}

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

function validateContactSectionForms() {
    const filled = areAllInputsFilled();
    const emailInput = document.getElementById('usermail-input');
    const emailOK = isValidEmail(emailInput.value);
    const formValid = filled && emailOK;
    setSignUpButtonState(formValid);
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
