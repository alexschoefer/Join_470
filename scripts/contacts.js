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
    selectedContact.innerHTML += showContactInformationsTemplate(contact);
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

function showContactInformationsTemplate(contact) {
    return `
    <div class="contact">
        <div class="contact-profil-badge">
            <div class="contact-details-icon" style="background-color: ${contact.profilcolor};">${contact.initial}</div>
        </div>
        <div class="contact-profil">
            <div class="contact-profil-name">${contact.name}</div>
            <div class="contact-profil-btns-container">
                <button class="contact-profil-btn-edit"><img src="../assets/icons/edit-icon.png" alt="edit-icon">Edit</button>
                <button class="contact-profil-btn-delete"><img src="../assets/icons/delete-icon.png" alt="">Delete</button>
            </div>
        </div>
    </div>
        <div class="contact-informations-email-phone">
            <h4>Contact Information</h4>
        </div>
        <div class="contact-email-phone">
            <span>Email</span>
            <div class="contact-email">${contact.email}</div>
            <span>Phone</span>
            <div class="contact-phone">${contact.phone}</div>
        </div>
    `;
}

function editContact(contact) {
    
}

function addNewContact() {
    let newContact = document.getElementById('add-new-contact');
    newContact.innerHTML += addNewContactTemplate();
}

function addNewContactTemplate() {
    return `
        <div class="add-contact-overlay">
            <div class="add-contact-left-container">
                <div>
                    <img src="" alt="">
                    <h3>Add contact</h3>
                    <h4>Tasks are better with a team!</h4>
                    <div></div>
                </div>
            </div>
            <div>
                <div>
                    <img src="" alt="">
                </div>
            <div>
                <div>
                    <img src="" alt="">
                </div>
                <div>
                    <input type="text">
                    <input type="text">
                    <input type="text">
                </div>
                <div>
                    <button></button>
                    <button></button>
                </div>
            </div>
        </div>
    `
}