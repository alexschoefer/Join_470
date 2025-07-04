async function initContacts() {
    await getAllContacts(); // Kontakte in der Datenbank synchronisieren
    const contacts = await loadAllContactsFromRemoteStorage(); // Kontakte laden
    showAllContacts(contacts); // Kontakte gruppiert anzeigen
}

function showAllContacts(contacts) {
    const sortedContacts = sortContactsAlphabetically(contacts);
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
            await updateContactInRemoteStorage(existingProfil.id, { name, email, phone,initial, profilcolor });
        } else {
            // Kontakt neu anlegen
            await postContactsToRemoteStorage(name, email, phone,initial, profilcolor);
        }
    }
}

async function postContactsToRemoteStorage(name, email, phone,initial, profilcolor) {
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

function sortContactsAlphabetically(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function findCapitalFirstLetter(contacts) {
    let contactList = {};
    contacts.forEach(contact => {
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

function getContactEntryTemplate(contact) {
    return `
    <div class="contact-entry">
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

    letters.forEach(letter => {
        // 1. Capital Letter + Linie
        container.innerHTML += getCaptialLetterHeaderTemplate(letter);

        // 2. Kontakte für diesen Buchstaben
        groupedContacts[letter].forEach(contact => {
            container.innerHTML += getContactEntryTemplate(contact);
        });
    });
}