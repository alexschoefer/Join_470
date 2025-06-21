const fetchURLDataBase = "https://join-470-80a5e-default-rtdb.europe-west1.firebasedatabase.app/"

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

function checkRequiredInputEmail(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    if (input.type === 'email') {
        if (!isValidEmail(input.value)) {
            errorMessage.classList.remove('d_none');
            wrapper.classList.add('input-error');
        } else {
            errorMessage.classList.add('d_none');
            wrapper.classList.remove('input-error');
        }
    }
}

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
}

function clearErrorMessage(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    errorMessage.classList.add('d_none');
    wrapper.classList.remove('input-error');
}

function changePasswordIcon() {
    let passwordInput = document.getElementById("userpassword-input");
    let passwordIcon = document.getElementById("password-icon");

    if (passwordInput.value.trim().length > 0) {
        passwordIcon.src = "../assets/icons/visibility-off-icon.png";
        passwordIcon.classList.add('visibility-off-icon');
    } else {
        passwordIcon.src = "../assets/icons/lock-icon.png";
        passwordIcon.classList.remove('visibility-off-icon');
    }
}

function toggleInputTypePassword() {
    let input = document.getElementById('userpassword-input');
    let passwordIcon = document.getElementById('password-icon');
    let passwordInput = document.getElementById('userpassword-input');
    if (input.type === 'password' && passwordInput.value.trim().length > 0) {
        input.type = 'text';
        passwordIcon.src = "../assets/icons/visibility-icon.png";
    } else if (input.type === 'text' && passwordInput.value.trim().length > 0) {
        input.type = 'password';
        passwordIcon.src = "../assets/icons/visibility-off-icon.png";
        passwordIcon.classList.add('visibility-off-icon');
    } else {
        return;
    }
}

// prüft alle Inputfelder, ob sie gefüllt sind => Antwort true or false
function areAllInputsFilled() {
    const inputs = document.querySelectorAll('.user-input');
    for (let input of inputs) {
        if (input.value.trim() === '') {
            return false;
        }
    }
    return true;
}

// Hilfsfunktion: prüft, ob die Privacy Police aktiv ist
function isPrivacyPolicyChecked() {
    return document.getElementById('checkbox-privacy-policy').checked;
}

// wiederkehrende Prüfung, ob alle Vorgaben erfüllt sind, damit der Button aktiv ist
function validateSignUpForm() {
    const filled = areAllInputsFilled();
    const emailInput = document.getElementById('usermail-input');
    const emailOK = isValidEmail(emailInput.value);
    const checkboxOK = isPrivacyPolicyChecked();
    const formValid = filled && emailOK && checkboxOK;
    setSignUpButtonState(formValid);
}

// finale Sign Up Button Freigabe
function setSignUpButtonState(enabled) {
    const button = document.getElementById('btn-sign-up');
    button.disabled = !enabled;
}

// Überprüfung, ob die beiden eingegebenen Passwörter übereinstimmen
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

// Speichert die Inputs des Users kurz für die Weitergabe an Firebase
function saveUserInputsForRemoteStorage(event) {
    event.preventDefault();
    let username = document.getElementById('username-input');
    let usermail = document.getElementById('usermail-input');
    let userpassword = document.getElementById('userpassword-input');
    postUserDataToRemoteStorage(username, usermail, userpassword);
}

// Übernahme der Userdaten und schickt sie in Richtung firebase 
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

//Zurücksetzen Registrierung
function resetRegistration() {
    document.getElementById('username-input').value = '';
    document.getElementById('usermail-input').value = '';
    document.getElementById('userpassword-input').value = '';
    document.getElementById('confirm-userpassword-input').value = '';
    document.getElementById('checkbox-privacy-policy').checked = false;
    setSignUpButtonState(false);
}

//Rückmeldung an den User + Weiterleitung an die Login Seite
function forwardingToLoginPage() {
    const overlay = document.getElementById('sign-up-success-overlay');
    overlay.classList.remove('d_none');
    overlay.classList.add('show');

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 800);
}
