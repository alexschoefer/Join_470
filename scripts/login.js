let users = [
    {'email':'alex@test.de', 'password': 'test123', 'name': 'Alex Test'}
]

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

function loginUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let loginValidationMessage = document.getElementById('input-validation-message');
    let emailValidationMessage = document.getElementById('login-email-verification');
    loginValidationMessage.classList.add('d_none');
    emailValidationMessage.classList.add('d_none');
    if (email.value.trim() === '') {
        emailValidationMessage.classList.remove('d_none');
        return;
    }
    let user = users.find(u => u.email === email.value && u.password === password.value);
    if (!user) {
        loginValidationMessage.classList.remove('d_none');
    } else {
        window.location.href = './html/summary.html';
    }
}