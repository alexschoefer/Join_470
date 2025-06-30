const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/"
let isEmailAlreadyUsed = false;

/**
 * Validates a single input field in the signup form.
 * 
 * Displays an error message if the field is empty, and removes it if the input is valid.
 * Also triggers re-validation of the entire signup form to update the submit button state.
 *
 * @param {HTMLInputElement} input - The input field to be validated.
 */
function validateSignupInput(input) {
    const errorMessage = document.getElementById(input.id + '-validation-message');
    const wrapper = input.closest('.user-input-wrapper');
    if (errorMessage && wrapper) {
        if (input.value.trim() === '') {
            errorMessage.classList.remove('d_none');
            wrapper.classList.add('input-error');
        } else {
            errorMessage.classList.add('d_none');
            wrapper.classList.remove('input-error');
        }
    }
    validateSignUpForm();
}

/**
 * Help-function - Checking the required input email
 * 
 * Displays an error message if the email is not valid by the function isValidEmail
 * Also triggers re-validation of the entire signup form to update the submit button state.
 * Triggers an asynchronous check to see if the email already exists in the database.
 * 
 * @param {HTMLInputElement} input - The input field to be validated.
 */
function checkRequiredInputEmail(input) {
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
        checkEmailAlreadyExist(input);
}

/** 
 * Help-function - Checking the given email adress for the sign up in the database.
 * 
 * If the given email adress is already by a user in the database an error message by the calling function showEmailAlreadyExistError
 * Otherwise the error is cleared. The overall form validation is updated.
 * 
 * @param {HTMLInputElement} input - The email input field that is checking in the database. 
 */
async function checkEmailAlreadyExist(input) {
    if(input.value.trim().length > 0){
        let email = document.getElementById('usermail-input').value.trim();
        let response = await fetch(fetchURLDataBase + '/users' + '.json');
        let useremails = await response.json();
        let signupEmail = useremails && Object.values(useremails).find(
            user => user.email === email);
            signupEmail ? (isEmailAlreadyUsed = true, showEmailAlreadyExistError(input)) : (isEmailAlreadyUsed = false, clearErrorMessage(input));
            validateSignUpForm();
    }
}

/**
 * Help-function - Displays an error message when the entered email address already exists in the database.
 *
 * Updates the validation message element with an appropriate error text,
 * makes it visible, and applies a visual error style to the input wrapper.
 *
 * @param {HTMLInputElement} input - The email input field that triggered the error.
 */
function showEmailAlreadyExistError(input) {
    let errorMessage = document.getElementById('usermail-input-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    errorMessage.innerHTML = 'An account already exists for this e-mail address. Please check.';
    errorMessage.classList.remove('d_none');
    wrapper.classList.add('input-error');
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
 * Help-function - Clears all error messages by the input fields
 * 
 * Hides the associated validation message element. Removes the error styling from the input wrapper.
 *  
 * @param {HTMLInputElement} input - 
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
 * 
 * If the length of the input is bigger than 0 then a new icon will be placed in the input field
 * Otherwise if the field is empty, it shows a default lock icon.
 * 
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
 * 
 * Switches the input type between "password" and "text" based on its current state,
 * allowing the user to show or hide the entered password. Also updates the icon accordingly.
 *
 * This function only toggles the input if it contains a non-empty value.
 *
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
 * Help-functions - Checks if the button for privacy police is clicked
 * 
 * @returns {boolean} Returns true if the privacy policy checkbox is checked, otherwise false.
 */
function isPrivacyPolicyChecked() {
    return document.getElementById('checkbox-privacy-policy').checked;
}

/**
 * Validates the entire sign-up form to determine if the "Sign Up" button should be enabled.
 * 
 * Checking: All input fields are filled out, the email input has a valid format, the privacy policy checkbox is checked.
 * At least => The email is not already used (based on the `isEmailAlreadyUsed` flag).
 * 
 * Based on these conditions, it enables or disables the sign-up button.
 */
function validateSignUpForm() {
    const filled = areAllInputsFilled();
    const emailInput = document.getElementById('usermail-input');
    const emailOK = isValidEmail(emailInput.value);
    const checkboxOK = isPrivacyPolicyChecked();
    const formValid = filled && emailOK && checkboxOK && !isEmailAlreadyUsed;
    setSignUpButtonState(formValid);
}

/**
 * Help-function - Enables or disables the sign-up button based on the provided state.
 *
 * @param {boolean} enabled - If true, the sign-up button is enabled; if false, it is disabled.
 */
function setSignUpButtonState(enabled) {
    const button = document.getElementById('btn-sign-up');
    button.disabled = !enabled;
}

/**
 * Validates if the password and confirm password inputs match.
 *
 * If the values do not match, a validation message is shown.
 * If they match, the validation message is hidden.
 */
function checkConfirmPassword() {
    const password = document.getElementById('userpassword-input');
    const confirmpassword = document.getElementById('confirm-userpassword-input');
    const passwordMessage = document.getElementById('confirm-userpassword-input-validation-message');

    if (password.value !== confirmpassword.value) {
        passwordMessage.classList.remove('d_none');
    } else {
        passwordMessage.classList.add('d_none');
    }
}

/**
 * Help-function: Handle the user inputs username, useremail and password
 * 
 * Prevents the default form submission
 * Triggers the function to post the input values into firebase database.
 * 
 * @param {Event} event - The form submission event. 
 */
function saveUserInputsForRemoteStorage(event) {
    event.preventDefault();
    let username = document.getElementById('username-input');
    let usermail = document.getElementById('usermail-input');
    let userpassword = document.getElementById('userpassword-input');
    postUserDataToRemoteStorage(username, usermail, userpassword);
}

/**
 * Sends the user's registration data to the remote firebase database
 * 
 * Performs a POST request to store a new user object containing name, email, and password.
 * After the request is complete, it triggers the registration success overlay and resets the registration form
 * 
 * @async
 * @param {HTMLInputElement} username - The input element containing the user's name.
 * @param {HTMLInputElement} usermail - The input element containing the user's email.
 * @param {HTMLInputElement} userpassword - The input element containing the user's password.
 * @returns {Promise<Object>} The JSON response returned by the Firebase server.
 */
async function postUserDataToRemoteStorage(username, usermail, userpassword) {
    let response = await fetch(fetchURLDataBase + '/users' + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "name": username.value,
                "email": usermail.value,
                "password": userpassword.value
            }
        )
    });
    forwardingToLoginPage();
    resetRegistration();
    return responseToJson = await response.json();
}

/**
 * Help-function - Reset all input fields
 * 
 * After a successfull registration all input fields are reseted. 
 * The sign up button also disabled again. 
 * 
 */
function resetRegistration() {
    document.getElementById('username-input').value = '';
    document.getElementById('usermail-input').value = '';
    document.getElementById('userpassword-input').value = '';
    document.getElementById('confirm-userpassword-input').value = '';
    document.getElementById('checkbox-privacy-policy').checked = false;
    setSignUpButtonState(false);
}

/**
 * Displays a success overlay and redirects the user to the login page after a short delay.
 *
 * Shows the success message about the registration
 * Then, after 800 milliseconds, navigates the user to the login page.
 */
function forwardingToLoginPage() {
    const overlay = document.getElementById('sign-up-success-overlay');
    overlay.classList.remove('d_none');
    overlay.classList.add('show');

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 800);
}

/**
 * Handles the change event for the privacy policy checkbox.
 * 
 * Toggles the visibility of the checkmark icon based on whether the checkbox is selected.
 * Triggers a re-validation of the signup form to update the state of the sign-up button.
 */
function handlePrivacyPolicyChange() {
    const isChecked = isPrivacyPolicyChecked();
    const checkIcon = document.getElementById('checkbox-privacy-police-icon-check');
    checkIcon.classList.toggle('d_none', !isChecked);
    validateSignUpForm();
}

/**
 * Help-function - Reset the privacy police checkbox
 * 
 * Unchecks the checkbox input and adds the "d_none" class to the icon element
 */
function resetCheckbox() {
    document.getElementById('checkbox-privacy-policy').checked = false;
    document.getElementById('checkbox-privacy-police-icon-check').classList.add('d_none');
}
