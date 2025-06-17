// document.addEventListener('DOMContentLoaded', function () {
//     const inputs = document.querySelectorAll('.user-input');

//     inputs.forEach((input) => {
//       input.addEventListener('blur', () => {
//         const message = input.closest('.input-wrapper').querySelector('.input-validation-message');

//         if (input.value.trim() === '') {
//           message.classList.remove('d_none'); // Fehler zeigen
//         } else {
//           message.classList.add('d_none'); // Fehler ausblenden
//         }
//       });
//     });
//   });


function checkRequiredInput(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    if (input.value.trim() === '') {
        errorMessage.classList.remove('d_none');
        wrapper.classList.add('input-error');
    } else {
        errorMessage.classList.add('d_none');
        wrapper.classList.remove('input-error');
    }
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

function acceptedPrivacyPolice() {
    let privacyPoliceCheckbox = document.getElementById('checkbox-privacy-policy');
    let signUpButton = document.getElementById('btn-sign-up');
    if (privacyPoliceCheckbox.checked) {
        signUpButton.disabled = false;
    } else {
        signUpButton.disabled = true;
    }

    // signUpInputDataValidation();
}

