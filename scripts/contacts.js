let allContacts = [];

async function initContacts() {
    await getAllContacts(); // Kontakte in der Datenbank synchronisieren
    allContacts = await loadAllContactsFromRemoteStorage(); // Kontakte laden
    showAllContacts(allContacts); // Kontakte gruppiert anzeigen
}

function showAllContacts(allContacts) {
    const sortedContacts = sortContactsAlphabetically(allContacts);
    const groupedContacts = findCapitalFirstLetter(sortedContacts);

    renderGroupedContacts(groupedContacts);
}

async function getAllContacts() {
    let existingContacts = await checkExistingContact();

    for (let contact of contactsDummy) {
        let { name, email, phone, initial, profilcolor } = contact;

        // Prüfen, ob Kontakt mit derselben bereits E-Mail existiert
        let existingProfil = existingContacts.find(c => c.email === email);

        if (existingProfil) {
            // Kontakt updaten
            await updateContactInRemoteStorage(existingProfil.id, { name, email, phone, initial, profilcolor });
        } else {
            // Kontakt neu anlegen
            await postContactsToRemoteStorage(name, email, phone, initial, profilcolor);
        }
    }
}

async function postContactsToRemoteStorage(name, email, phone, initial, profilcolor) {
    let response = await fetch(fetchURLDataBase + '/contacts' + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone || "",
            initial: initial,
            profilcolor: profilcolor
        })
    });
    return await response.json();
}


async function updateContactInRemoteStorage(id, updatedContact) {
    await fetch(`${fetchURLDataBase}/contacts/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact)
    });
}

async function checkExistingContact() {
    const response = await fetch(fetchURLDataBase + '/contacts' + '.json');
    const data = await response.json();

    if (!data) return [];

    // Konvertiere das Objekt in ein Array mit ID für spätere Updates
    return Object.entries(data).map(([id, contact]) => ({
        id,
        ...contact
    }));
}

async function loadAllContactsFromRemoteStorage() {
    const response = await fetch(fetchURLDataBase + '/contacts.json');
    const contactsData = await response.json();
    return Object.values(contactsData);
}

function sortContactsAlphabetically(allContacts) {
    return allContacts.sort((a, b) => a.name.localeCompare(b.name));
}

function findCapitalFirstLetter(allContacts) {
    let contactList = {};
    allContacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!contactList[firstLetter]) {
            contactList[firstLetter] = [];
        }
        contactList[firstLetter].push(contact);
    });
    return contactList;
}

function getCaptialLetterHeaderTemplate(letter) {
    return `
        <div class="capital-letter">${letter}</div>
        <div class="contact-line"></div>                       
    `;
}

function getContactEntryTemplate(contact, index) {
    return `
    <div id="contact-entry" class="contact-entry" onclick="getContactInformations(${index}, event)">
        <div class="contact-profil-badge">
            <div class="contact-icon" style="background-color: ${contact.profilcolor};">${contact.initial}</div>
        </div>
        <div class="contact-information">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-email">${contact.email}</div>
        </div>
    </div>
    `;
}


function renderGroupedContacts(groupedContacts) {
    const container = document.getElementById('contact-list');
    container.innerHTML = "";

    const letters = Object.keys(groupedContacts).sort();
    let globalIndex = 0;

    letters.forEach(letter => {
        container.innerHTML += getCaptialLetterHeaderTemplate(letter);

        groupedContacts[letter].forEach(contact => {
            container.innerHTML += getContactEntryTemplate(contact, globalIndex);
            globalIndex++;
        });
    });
}

function getContactInformations(index, event) {
    const contact = allContacts[index];
    let selectedContact = document.getElementById('contact-details');
    selectedContact.innerHTML = "";
    toggleActiveContact(event.currentTarget);
    selectedContact.innerHTML += showContactInformationsTemplate(contact,index);
}

function toggleActiveContact(element) {
    document.querySelectorAll('.contact-entry').forEach(entry => {
        entry.classList.remove('contact-entry-active');
        const activeContactName = entry.querySelector('.contact-name');
        if (activeContactName) {
            activeContactName.classList.remove('contact-entry-name-active');
        }
    });
    element.classList.add('contact-entry-active');
    const newActiveContactName = element.querySelector('.contact-name');
    if (newActiveContactName) {
        newActiveContactName.classList.add('contact-entry-name-active');
    }
}

function showContactInformationsTemplate(contact,index) {
    return `
    <div class="contact">
        <div class="contact-profil-badge">
            <div class="contact-details-icon" style="background-color: ${contact.profilcolor};">${contact.initial}</div>
        </div>
        <div class="contact-profil">
            <div class="contact-profil-name">${contact.name}</div>
            <div class="contact-profil-btns-container">
                <button class="contact-profil-btn-edit" onclick="editContact(${index})"><img src="../assets/icons/edit-icon.png" alt="edit-icon">Edit</button>
                <button class="contact-profil-btn-delete"><img src="../assets/icons/delete-icon.png" alt="">Delete</button>
            </div>
        </div>
    </div>
        <div class="contact-informations-email-phone">
            <h4>Contact Information</h4>
        </div>
        <div class="contact-email-phone">
            <span>Email</span>
            <div class="contact-email">${contact.email || ''}</div>
            <span>Phone</span>
            <div class="contact-phone">${contact.phone || ''}</div>
        </div>
    `;
}

function editContact(index) {
    const contact = allContacts[index];
    let closeOverlay = document.getElementById('editContactOverlayContainer');
    closeOverlay.classList.remove('d_none');
    let overlayContainer = document.getElementById('editContactOverlayContainer');
    overlayContainer.innerHTML = editContactTemplate(contact);
}

function addNewContact() {
    let closeOverlay = document.getElementById('addNewContactOverlayContainer');
    closeOverlay.classList.remove('d_none');
    let overlayContainer = document.getElementById('addNewContactOverlayContainer');
    overlayContainer.innerHTML = addNewContactTemplate();
}

function addNewContactTemplate() {
    return `
<div class="add-contact-overlay">
    <div>
        <img class="add-contact-close-overlay-icon" src="../assets/icons/close.png" alt="close-icon"
            onclick="closeAddContactOverlay()">
    </div>

    <div class="add-contact-left-container">
        <img class="add-contact-menulogo" src="../assets/img/MenuLogo.png" alt="menulogo">
        <div class="add-contact-headline-container">
            <h3>Add contact</h3>
            <span>Tasks are better with a team!</span>
            <div class="add-contact-vector-line"></div>
        </div>
    </div>

    <div class="add-contact-right-container">
        <form class="add-contact-form" onsubmit="saveUserInputsForRemoteStorage(event)">
            <div class="add-contact-information-wrapper">
                <div class="add-contact-profil-icon">
                    <img src="../assets/icons/profil-icon.png" alt="profil-icon.png">
                </div>

                <div class="add-contact-input-wrapper">
                    <div class="user-input-wrapper">
                        <div class="input-container">
                            <input id="add-contact-name-input" class="user-input" type="text" name="name"
                                placeholder="Name" required>
                            <div>
                                <img class="email-icon" src="../assets/icons/person-icon.png" alt="person-icon">
                            </div>
                        </div>
                    </div>

                    <div class="user-input-wrapper">
                        <div class="input-container">
                            <input id="usermail-input" class="user-input" type="email" name="email" placeholder="Email"
                                autocomplete="off" required pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$">
                            <div>
                                <img class="email-icon" src="../assets/icons/mail-icon.png" alt="mail-icon">
                            </div>
                        </div>
                    </div>

                    <div class="user-input-wrapper">
                        <div class="input-container">
                            <input id="add-contact-phone-input" class="user-input" type="tel" name="phone"
                                placeholder="Phone" required>
                            <div>
                                <img class="phone-icon" src="../assets/icons/call-icon.png" alt="call-icon">
                            </div>
                        </div>
                    </div>

                    <div class="add-contact-btns-container">
                        <button type="button" class="cancel-btn" onclick="closeAddContactOverlay()">
                            Cancel
                            <img class="add-task-button-create-icon" src="../assets/icons/close.png" alt="close-icon">
                        </button>
                        <button type="submit" class="create-contact-btn">
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
    `
}

function bubblingPropagation(event) {
    event.stopPropagation();
}

function closeAddContactOverlay() {
    let closeOverlay = document.getElementById('addNewContactOverlayContainer');
    closeOverlay.classList.add('d_none');
}

function closeEditContactOverlay() {
    let closeOverlay = document.getElementById('editContactOverlayContainer');
    closeOverlay.classList.add('d_none');
}

function editContactTemplate(contact) {
    return `
    <div class="add-contact-overlay">
    <div>
        <img class="add-contact-close-overlay-icon" src="../assets/icons/close.png" alt="close-icon"
        onclick="closeEditContactOverlay()">
    </div>

    <div class="add-contact-left-container">
        <img class="add-contact-menulogo" src="../assets/img/MenuLogo.png" alt="menulogo">
        <div class="add-contact-headline-container">
            <h3>Edit contact</h3>
            <div class="add-contact-vector-line"></div>
        </div>
    </div>

    <div class="add-contact-right-container">
        <form class="add-contact-form" onsubmit="saveUserInputsForRemoteStorage(event)">
            <div class="add-contact-information-wrapper">
                <div class="add-contact-profil-icon">
                    <div class="contact-details-icon" style="background-color: ${contact.profilcolor};">${contact.initial}</div>
                </div>

                <div class="add-contact-input-wrapper">
                    <div class="user-input-wrapper">
                        <div class="input-container">
                            <input id="add-contact-name-input" class="user-input" type="text" name="name" placeholder="Name" value="${contact.name}">
                            <div>
                                <img class="email-icon" src="../assets/icons/person-icon.png" alt="person-icon">
                            </div>
                        </div>
                    </div>

                    <div class="user-input-wrapper">
                        <div class="input-container">
                            <input id="usermail-input" class="user-input" type="email" name="email" placeholder="Email"
                                autocomplete="off" value="${contact.email}">
                            <div>
                                <img class="email-icon" src="../assets/icons/mail-icon.png" alt="mail-icon">
                            </div>
                        </div>
                    </div>

                    <div class="user-input-wrapper">
                        <div class="input-container">
                            <input id="add-contact-phone-input" class="user-input" type="tel" name="phone" placeholder="Phone"
                                value="${contact.phone || ''}">
                            <div>
                                <img class="phone-icon" src="../assets/icons/call-icon.png" alt="call-icon">
                            </div>
                        </div>
                    </div>

                    <div class="add-contact-btns-container">
                        <button type="button" class="delete-btn" onclick="closeAddContactOverlay()">
                            Delete
                        </button>
                        <button type="submit" class="save-contact-btn">
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
    `
}