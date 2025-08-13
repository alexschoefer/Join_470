/**
 * Starts the animation of the Join logo by opening the login screen
 * Calls some help function:
 * setLogoSource(element): Sets logo source based on device type (mobile or desktop)
 * startAnimation(logoElement, wrapperElement): Adds animation classes
 * showLoginContent(): Replaces the animated logo with login container
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
 * Checks if the currently window width is for the mobile or desktop device
 * @returns {boolean} Returns true if the viewport width is 750px or less, otherwise false
 */
function isMobile() {
  return window.innerWidth <= 750;
}


/**
 * Set the source of the img element depending on the current device type
 * @param {HTMLImageElement} animatedJoinLogo - The img element representing the animated Join logo
 */
function setLogoSource(animatedJoinLogo) {
  animatedJoinLogo.src = isMobile() ? "./assets/img/MenuLogo.png" : "./assets/img/MainLogo.png";
}


/**
 * Starts the logo animation depending on the device type (mobile or desktop)
 * @param {HTMLImageElement} animatedJoinLogo - The animated logo image element to animate
 * @param {HTMLElement} loginWrapper - The container element for the login content in case of a mobile device
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
 * Displays the user login content container after the logo animation has ending
* @param {HTMLElement} contentWrapper - The container holding the main login content
 * @param {HTMLElement} loginContainer - The container holding the login form
 * @param {HTMLElement} animatedJoinLogo - The animated logo shown during the intro
 * @param {HTMLElement} finalJoinLogo - The static logo shown after the animation
 * @param {HTMLElement} loginWrapper - The wrapper for the entire login section
 */
function showLoginContent(contentWrapper, loginContainer, animatedJoinLogo, finalJoinLogo, loginWrapper) {
  contentWrapper.classList.remove("d_none");
  loginContainer.classList.replace("hidden", "show");
  animatedJoinLogo.classList.add("d_none");
  finalJoinLogo.classList.remove("d_none");
  loginWrapper.classList.remove("login-wrapper-start", "mobile-background");
}


/**
 * Handles the user long
 * Fetches user data from the remoteStorage(Firebase) and verifies the login data
 * If login data are valid: Gets all contacts and saves login data to localStorage and redirects to the summary page.
 * If invalid, displays a login error message.
 * @async
 * @param {Event} event - The form submit event triggered by the login attempt.
 */
async function loginUser(event) {
  event.preventDefault();
  let email = document.getElementById("login-usermail-input").value.trim();
  let password = document.getElementById("login-userpassword-input").value.trim();
  let response = await fetch(fetchURLDataBase + "/users.json");
  let users = await response.json();
  let userLogin = users && Object.values(users).find((user) => user.email === email && user.password === password);
  if(userLogin){
    await saveLoginUserDataToLocalStorage(email);
    await getAllContacts();
    const contacts = await loadAllContactsFromRemoteStorage();
    localStorage.setItem("cachedContacts", JSON.stringify(contacts));
    localStorage.setItem("showWelcomeOnce", "true");
    showLoginSuccessMessage(); 
  }else{
    showLoginError();
  }
}


/**
 * Saves the login user details to localStorage for the current session
 * Fetches the full user list from the remoteStorage (Firebase) and searches for the user by the given email adresse
 * If found, the user's email, the username, his/her profile color and initials are stored in localStorage under the key loggedInUser
 * @param {string} email - The email address of the logged-in user
 */
async function saveLoginUserDataToLocalStorage(email) {
  let response = await fetch(fetchURLDataBase + "/users.json");
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
 * Validates the user login inputs
 * If the login input data are invalid, a error message are displayed
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
 * Shows an error message by login with wrong user data
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
 * Validates the email input field and displays an error message if the email format is invalid
 * @param {HTMLInputElement} input - The email input element for validation
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


/**
 * Handles the guest login 
 * By login as guest user the guest user data will be stored in the localStorage
 * Redirects the user to summary page
 * @param {Event} event - The event object from the button click or form submission
 */
async function guestLogin(event) {
  event.preventDefault();
  await getAllContacts();
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify({
      email: "guest@example.com",
      name: "Gast",
      profilcolor: "#999",
      initial: "G",
    })
  );
  localStorage.setItem("showWelcomeOnce", "true");
  showLoginSuccessMessage();
}


/**
 * Displays a success overlay and redirects the user to the login page after a short delay.
 *
 * Shows the success message about the registration
 * Then, after 800 milliseconds, navigates the user to the login page.
 */
function showLoginSuccessMessage() {
  const overlay = document.getElementById('login-success-overlay');
  overlay.classList.remove('d_none');
  overlay.classList.add('show');
  setTimeout(() => {
      window.location.href = './html/summary.html';
  }, 800);
}