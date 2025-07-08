function initContacts() {
    getAllContacts();
}

async function getAllContacts() {
    let existingContacts = await checkExistingContact();

    for (let contact of contactsDummy) {
        let { name, email, phone, profilcolor } = contact;

        // Prüfen, ob Kontakt mit derselben bereits E-Mail existiert
        let existingProfil = existingContacts.find(c => c.email === email);

        if (existingProfil) {
            // Kontakt updaten
            await updateContactInRemoteStorage(existingProfil.id, { name, email, phone, profilcolor });
        } else {
            // Kontakt neu anlegen
            await postContactsToRemoteStorage(name, email, phone, profilcolor);
        }
    }
}

async function postContactsToRemoteStorage(name, email, phone, profilcolor) {
    let response = await fetch(fetchURLDataBase + '/contacts' + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone || "",
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
    let response = await fetch(fetchURLDataBase + '/contacts' + '.json');
    let contactsData = await response.json();
    let contacts = Object.values(contactsData);
    showAllContacts(contacts);

}

function showAllContacts(contacts) {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    console.log(contacts);
    
}

function getContactsListTemplate(contacts) {
    return `
        

    `
}