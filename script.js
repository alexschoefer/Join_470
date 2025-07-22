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

function validateForms() {
    const filled = areAllInputsFilled();
    const emailInput = document.getElementById('usermail-input');
    const emailOK = isValidEmail(emailInput.value);
    const formValid = filled && emailOK && !isEmailAlreadyUsed;
    setSignUpButtonState(formValid);
}

