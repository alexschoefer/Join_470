function startLogoAnimation()
 {
    const logo = document.getElementById("start-logo-img");
    const loginContainerRef = document.getElementById("login-main-container");
    setTimeout(() => {
        logo.classList.add("logo-animation-end");
        logo.classList.remove("start-logo-img");
        logo.classList.add("main-logo-img");
    }, 100);

    setTimeout(() => {
        loginContainerRef.classList.remove("hidden");
        loginContainerRef.classList.add("show");
    }, 1000);;
}

async function loginUser() {
    let email = document.getElementById('login-usermail-input').value.trim();
    let password = document.getElementById('login-userpassword-input').value.trim();
    let response = await fetch(fetchURLDataBase + '/users.json');
    let users = await response.json();
    let userLogin = users && Object.values(users).find(
        user => user.email === email && user.password === password
    );
    userLogin ? window.location.href = './html/summary.html' : showLoginError();
}

function validateLoginInput(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    if (errorMessage && wrapper) {
        if (input.value.trim() === '') {
            errorMessage.classList.remove('d_none');
            wrapper.classList.add('input-error');
        } else {
            errorMessage.classList.add('d_none');
            wrapper.classList.remove('input-error');
        }
    }
}

function showLoginError() {
    let errorMessage = document.getElementById('login-userpassword-input-validation-message');
    errorMessage.classList.remove('d_none');
    let emailInput = document.getElementById('login-usermail-input');
    let passwordInput = document.getElementById('login-userpassword-input');
    let emailWrapper = emailInput.closest('.user-input-wrapper');
    let passwordWrapper = passwordInput.closest('.user-input-wrapper');
    emailWrapper.classList.add('input-error');
    passwordWrapper.classList.add('input-error');
}

function checkRequiredLoginEmail(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    if (input.type === 'email') {
        if (!isValidEmail(input.value)) {
            errorMessage.innerText= 'Please enter a valid email adress.';
            errorMessage.classList.remove('d_none');
            wrapper.classList.add('input-error');
        } else {
            errorMessage.classList.add('d_none');
            wrapper.classList.remove('input-error');
        }
    }
}