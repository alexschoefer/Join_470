/**
 * Returns an HTML template string for the "Add New Contact" overlay form for mobile device
 * 
 * @returns {string} The HTML string representing the add contact overlay
 */
function addNewContactTemplateMobile() {
    return `
        <div class="contact-overlay">
            <div class="add-contact-overlay">
                <img class="add-contact-close-overlay-icon" src="../assets/icons/mobile-close-white-icon.png" alt="close-icon"
                    onclick="closeAddContactOverlay()">
                <div class="add-contact-left-container">
                    <div class="add-contact-headline-container">
                        <h3>Add contact</h3>
                        <span>Tasks are better with a team!</span>
                        <div class="add-contact-vector-line"></div>
                    </div>
                </div>
                <div class="mobile-add-contact-profil-icon-container">
                    <div class="mobile-profil-icon">
                        <img class="mobile-contact-details-icon" src="../assets/icons/profil-icon.png" alt="profil-icon.png">
                    </div>
                </div>
                <div class="add-contact-right-container">
                    <form class="add-contact-form" onsubmit="createContactForRemoteStorage(event)">
                        <div class="add-contact-information-wrapper">
                            <div class="add-contact-input-wrapper">
                                <div class="input-wrapper">
                                    <div class="user-input-wrapper">
                                        <div class="input-container">
                                            <input id="username-input" class="user-input" type="text" name="name"
                                                placeholder="Name" autocomplete="off" onfocus="clearErrorMessage(this)"
                                                onblur="validateContactFormsInput(this)">
                                            <div>
                                                <img class="person-icon" src="../assets/icons/person-icon.png"
                                                    alt="person-icon">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="input-validation-container">
                                        <p id="username-input-validation-message"
                                            class="input-validation-message d_none"
                                            data-default-message="This field is required.">This field is required.</p>
                                    </div>
                                </div>
                                <div class="input-wrapper">
                                    <div class="user-input-wrapper">
                                        <div class="input-container">
                                            <input id="usermail-input" class="user-input" type="email" name="email"
                                                placeholder="Email" autocomplete="off" onfocus="clearErrorMessage(this)"
                                                onblur="validateContactFormsInput(this), checkRequiredInputContactEmail(this)">
                                            <div>
                                                <img class="email-icon" src="../assets/icons/mail-icon.png" alt="mail-icon">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="input-validation-container">
                                        <p id="usermail-input-validation-message"
                                            class="input-validation-message d_none"
                                            data-default-message="Please enter a valid email address.">Please enter a valid
                                            email adress.</p>
                                    </div>
                                </div>
                                <div class="input-wrapper">
                                    <div class="user-input-wrapper">
                                        <div class="input-container">
                                            <input id="userphone-input" class="user-input" type="tel" name="phone"
                                                placeholder="Phone" autocomplete="off" onfocus="clearErrorMessage(this)"
                                                onblur="validateContactFormsInput(this)">
                                            <div>
                                                <img class="phone-icon" src="../assets/icons/call-icon.png" alt="phone-icon">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="input-validation-container">
                                        <p id="userphone-input-validation-message"
                                            class="input-validation-message d_none"
                                            data-default-message="Please enter a valid phone number.">Please enter a valid phone
                                            number.</p>
                                    </div>
                                </div>
                                <div class="mobile-add-contact-btns-container" id="mobile-add-contact-btns-container">
                                    <button type="submit" class="create-contact-btn" id="btn-form" disabled>
                                        Create contact
                                        <img class="add-task-button-check-icon" src="../assets/icons/check-icon.png"
                                            alt="check-icon">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
}


/**
 * Returns an HTML template string for the "Edit a Contact" overlay form for the mobile device
 * 
 * @param {Object} contact - The contact object containing existing information.
 * @param {string} contact.id - A unique identifier for the contact.
 * @param {string} contact.name - The contact's full name.
 * @param {string} contact.email - The contact's email address.
 * @param {string} [contact.phone] - The contact's phone number (optional).
 * @param {string} contact.profilcolor - The background color of the contact's profile icon.
 * @param {string} contact.initial - The initial(s) shown in the profile icon.
 * @param {number} index - The contact's index in the contact list, used for deletion.
 * @returns {string} The HTML string for the edit contact overlay.
 */
function editContactTemplateMobile(contact,index) {
    return `
            <div class="contact-overlay">
                <div class="add-contact-overlay">
                    <div>
                        <img class="add-contact-close-overlay-icon" src="../assets/icons/mobile-close-white-icon.png"
                            alt="close-icon" onclick="closeEditContactOverlay()">
                    </div>
                    <div class="add-contact-left-container">
                        <div class="add-contact-headline-container">
                            <h3>Edit contact</h3>
                            <div class="add-contact-vector-line"></div>
                        </div>
                    </div>
                    <div class="mobile-edit-contact-profil-icon-container">
                        <div class="mobile-profil-icon">
                            <div class="contact-details-icon" style="background-color: ${contact.profilcolor};">${contact.initial}
                            </div>
                        </div>
                    </div>
                    <div class="add-contact-right-container">
                        <form class="add-contact-form"
                            onsubmit="getChangesFromContact('${contact.id}', event, '${contact.profilcolor}', '${contact.initial}'); return false;">
                            <div class="add-contact-information-wrapper">
                                <div class="add-contact-input-wrapper">
                                    <div class="input-wrapper">
                                        <div class="user-input-wrapper">
                                            <div class="input-container">
                                                <input id="username-input" class="user-input" type="text" name="name"
                                                    placeholder="Name" value="${contact.name}" autocomplete="off"
                                                    onfocus="clearErrorMessage(this)" onblur="validateContactFormsInput(this)">
                                                <div>
                                                    <img class="email-icon" src="../assets/icons/person-icon.png" alt="person-icon">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-validation-container">
                                            <p id="username-input-validation-message"
                                                class="input-validation-message d_none"
                                                data-default-message="This field is required.">This field is required.</p>
                                        </div>
                                    </div>
                                    <div class="input-wrapper">
                                        <div class="user-input-wrapper">
                                            <div class="input-container">
                                                <input id="usermail-input" class="user-input" type="email" name="email"
                                                    placeholder="Email" autocomplete="off" value="${contact.email}"
                                                    onfocus="clearErrorMessage(this)" onblur="validateContactFormsInput(this), checkRequiredInputContactEmail(this)">
                                                <div>
                                                    <img class="email-icon" src="../assets/icons/mail-icon.png" alt="mail-icon">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-validation-container">
                                            <p id="usermail-input-validation-message"
                                                class="input-validation-message d_none"
                                                data-default-message="Please enter a valid email address.">Please enter a valid
                                                email adress.</p>
                                        </div>
                                    </div>
                                    <div class="input-wrapper">
                                        <div class="user-input-wrapper">
                                            <div class="input-container">
                                                <input id="userphone-input" class="user-input" type="tel" name="phone"
                                                    placeholder="Phone" autocomplete="off" value="${contact.phone || ''}"
                                                    onfocus="clearErrorMessage(this)" onblur="validateContactFormsInput(this)">
                                                <div>
                                                    <img class="phone-icon" src="../assets/icons/call-icon.png" alt="phone-icon">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-validation-container">
                                            <p id="userphone-input-validation-message"
                                                class="input-validation-message d_none"
                                                data-default-message="Please enter a valid phone number.">Please enter a valid phone
                                                number.</p>
                                        </div>
                                    </div>

                                    <div class="mobile-add-contact-btns-container">
                                        <button type="button" class="delete-btn" onclick="deleteContact(${index})">
                                            Delete
                                        </button>
                                        <button type="submit" class="save-contact-btn" id="btn-form">
                                            Save
                                            <img class="add-task-button-check-icon" src="../assets/icons/check-icon.png"
                                                alt="check-icon">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            `
}