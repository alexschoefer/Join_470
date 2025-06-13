let users = [
    {'email':'alex@test.de', 'passwort': 'test123'}
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
    let passwort = document.getElementById('password');
    let loginValidationMessage = document.getElementById('login-validation-message');
    let user = users.find(u => u.email == email.value && u.passwort == passwort.value);
    console.log(user);
    if(!user) {
        loginValidationMessage.classList.remove('d_none');
    } 
}