/**
 * 
 */
function startLogoAnimation() {
  const animatedJoinLogo = document.getElementById("start-logo-animation");
  const finalJoinLogo = document.getElementById("start-logo-final");
  const loginContainer = document.getElementById("login-main-container");
  const contentWrapper = document.getElementById("login-content-wrapper");
  const loginWrapper = document.getElementById("login-wrapper");
  setLogoSource(animatedJoinLogo);
  startAnimation(animatedJoinLogo, loginWrapper);
  setTimeout(() => {
    showLoginContent(contentWrapper, loginContainer, animatedJoinLogo, finalJoinLogo, loginWrapper);
  }, 1600);
}


/**
 * 
 * @returns 
 */
function isMobile() {
  return window.innerWidth <= 750;
}


/**
 * 
 * @param {*} logo 
 */
function setLogoSource(animatedJoinLogo) {
  animatedJoinLogo.src = isMobile() ? "./assets/img/MenuLogo.png" : "./assets/img/MainLogo.png";
}


/**
 * 
 * @param {*} logo 
 * @param {*} wrapper 
 */
function startAnimation(animatedJoinLogo, loginWrapper) {
  if (isMobile()) {
    loginWrapper.classList.add("mobile-background");
    animatedJoinLogo.classList.add("logo-animation-move-mobile");
  } else {
    animatedJoinLogo.classList.add("logo-animation-move-desktop");
  }
}


/**
 * 
 * @param {*} contentWrapper 
 * @param {*} loginContainer 
 * @param {*} animatedLogo 
 * @param {*} finalLogo 
 * @param {*} wrapper 
 */
function showLoginContent(contentWrapper, loginContainer, animatedJoinLogo, finalJoinLogo, loginWrapper) {
  contentWrapper.classList.remove("d_none");
  loginContainer.classList.replace("hidden", "show");
  animatedJoinLogo.classList.add("d_none");
  finalJoinLogo.classList.remove("d_none");
  loginWrapper.classList.remove("login-wrapper-start", "mobile-background");
}

/**
 * 
 * @param {*} event 
 */
async function loginUser(event) {
  event.preventDefault();
  let email = document.getElementById("login-usermail-input").value.trim();
  let password = document.getElementById("login-userpassword-input").value.trim();
  let response = await fetch(fetchURLDataBase + "/users.json");
  let users = await response.json();
  let userLogin = users && Object.values(users).find((user) => user.email === email && user.password === password);
  if (userLogin) {
    await saveLoginUserDataToLocalStorage(email);
    localStorage.setItem("showWelcomeOnce", "true");
    window.location.href = "./html/summary.html";
  } else {
    showLoginError();
  }
}

/**
 * 
 * @param {*} email 
 */
async function saveLoginUserDataToLocalStorage(email) {
  let response = await fetch(fetchURLDataBase + "/contacts.json");
  let loginUserDetails = await response.json();
  let loggedInUser = loginUserDetails && Object.values(loginUserDetails).find((user) => user.email === email);
  if (loggedInUser) {
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        email: loggedInUser.email,
        name: loggedInUser.name,
        profilcolor: loggedInUser.profilcolor,
        initial: loggedInUser.initial,
      })
    );
  }
}


/**
 * 
 * @param {*} input 
 */
function validateLoginInput(input) {
  let errorMessage = document.getElementById(input.id + "-validation-message");
  let wrapper = input.closest(".user-input-wrapper");
  if (errorMessage && wrapper) {
    if (input.value.trim() === "") {
      errorMessage.classList.remove("d_none");
      wrapper.classList.add("input-error");
    } else {
      errorMessage.classList.add("d_none");
      wrapper.classList.remove("input-error");
    }
  }
}

/**
 * 
 */
function showLoginError() {
  let errorMessage = document.getElementById("login-userpassword-input-validation-message");
  errorMessage.classList.remove("d_none");
  let emailInput = document.getElementById("login-usermail-input");
  let passwordInput = document.getElementById("login-userpassword-input");
  let emailWrapper = emailInput.closest(".user-input-wrapper");
  let passwordWrapper = passwordInput.closest(".user-input-wrapper");
  emailWrapper.classList.add("input-error");
  passwordWrapper.classList.add("input-error");
}


/**
 * 
 * @param {*} input 
 */
function checkRequiredLoginEmail(input) {
  let errorMessage = document.getElementById(input.id + "-validation-message");
  let wrapper = input.closest(".user-input-wrapper");
  if (input.type === "email") {
    if (!isValidEmail(input.value)) {
      errorMessage.innerText = "Please enter a valid email adress.";
      errorMessage.classList.remove("d_none");
      wrapper.classList.add("input-error");
    } else {
      errorMessage.classList.add("d_none");
      wrapper.classList.remove("input-error");
    }
  }
}

function guestLogin(event) {
  // ⛔ Weiterleitung kurz stoppen, damit wir vorher localStorage setzen
  event.preventDefault();

  // Dummy-User setzen (optional)
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify({
      email: "guest@example.com",
      name: "Gast",
      profilcolor: "#999",
      initial: "G",
    })
  );

  // ✅ Begrüßungs-Flag setzen
  localStorage.setItem("showWelcomeOnce", "true");

  // ➡ Manuell zur Zielseite weiterleiten
  window.location.href = "./html/summary.html";
}
