let allContacts = [];
let colors = ['#FF7A00','#FF5EB3','#FF5EB3','#9327FF','#FF4646','#C3FF2B','#FF745E','#FFE62B','#00BEE8','#0038FF'];
let currentOverlayMode = null; // 'desktop' oder 'mobile'
let isOverlayOpen = false;

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
        // Prüfung, ob Kontakt mit derselben bereits E-Mail existiert
        let existingProfil = existingContacts.find(c => c.email === email);
        if (existingProfil) {
            // Kontakt updaten
            await updateContactInRemoteStorage(existingProfil.id, {name, email, phone, initial, profilcolor});
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

function addNewUserToContacts(username, useremail) {
    let nameInput = username;
    let emailInput = useremail;
    let phoneInput = "";
    let initial = createUserInitial(nameInput.value);
    let profilcolor = getProfilColorIcon();
    postContactsToRemoteStorage(nameInput.value, emailInput.value, phoneInput.value, initial, profilcolor);
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
    return Object.entries(data).map(([id, contact]) => ({
        id,
        ...contact
    }));
}

async function loadAllContactsFromRemoteStorage() {
    const response = await fetch(fetchURLDataBase + '/contacts' + '.json');
    const contactsData = await response.json();
    return Object.entries(contactsData).map(([id, contact]) => ({
        id,
        ...contact
    }));
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
    let screenSizeRef = window.innerWidth;
    screenSizeRef >= 1020 ? selectedContact.innerHTML += showContactInformationsTemplate(contact,index) : getContactInformationMobile(contact,index)
}

function getContactInformationMobile(contact,index) {
    let contactListRef = document.getElementById('contact-list');
    contactListRef.classList.add('d_none');
    let contactsLeftContainerRef = document.getElementById('contacts-left-container');
    contactsLeftContainerRef.classList.add('d_none');
    let contactDetailsRef = document.getElementById('contacts-right');
    contactDetailsRef.style.display = 'flex';
    let selectedContact = document.getElementById('contact-details');
    selectedContact.innerHTML += showContactInformationsTemplate(contact,index)
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

function editContact(index) {
    const contact = allContacts[index];
    let closeOverlay = document.getElementById('editContactOverlayContainer');
    closeOverlay.classList.remove('d_none');
    let overlayContainer = document.getElementById('editContactOverlayContainer');
    renderEditContactOverlay(contact, index);
}

function addNewContact() {
    const overlay = document.getElementById('addNewContactOverlayContainer');
    overlay.classList.remove('d_none');
    const mobileAddContactBtn = document.querySelector('.mobile-add-contact-button-create-icon');
    if (mobileAddContactBtn) mobileAddContactBtn.classList.add('d_none');
    renderAddContactOverlay();
}

window.addEventListener('resize', () => {
    if (!isOverlayOpen) return; 
    const overlay = document.getElementById('addNewContactOverlayContainer');
    const isVisible = overlay && !overlay.classList.contains('d_none');
    if (isVisible) {
        renderAddContactOverlay();
    }
});


function renderAddContactOverlay() {
    isOverlayOpen = true;
    const container = document.getElementById('addNewContactOverlayContainer');
    const isMobile = window.innerWidth < 1230;
    const desiredMode = isMobile ? 'mobile' : 'desktop';
    if (currentOverlayMode !== desiredMode) {
        container.innerHTML = isMobile ? addNewContactTemplateMobile() : addNewContactTemplate();
        currentOverlayMode = desiredMode;
    }
}

function renderEditContactOverlay(contact, index) {
    isOverlayOpen = true;
    const container = document.getElementById('editContactOverlayContainer');
    const isMobile = window.innerWidth < 1230;
    const desiredMode = isMobile ? 'mobile' : 'desktop';
    if (currentOverlayMode !== desiredMode) {
        container.innerHTML = isMobile ? editContactTemplateMobile(contact, index) : editContactTemplate(contact, index);
        currentOverlayMode = desiredMode;
    }
}


function closeAddContactOverlay() {
    let closeOverlay = document.getElementById('addNewContactOverlayContainer');
    const mobileAddContactBtn = document.querySelector('.mobile-add-contact-button-create-icon');
    if (mobileAddContactBtn) mobileAddContactBtn.classList.remove('d_none');
    closeOverlay.classList.add('d_none');
}

function closeEditContactOverlay() {
    let closeOverlay = document.getElementById('editContactOverlayContainer');
    closeOverlay.classList.add('d_none');
}

async function deleteContact(index) {
    let selectedContact = document.getElementById('contact-details');
    let deleteContact = allContacts[index];        
    await fetch(`${fetchURLDataBase}/contacts/${deleteContact.id}.json`, {
        method: "DELETE",
    });
    closeEditContactOverlay(); 
    await refreshContacts();
    selectedContact.innerHTML = "";
}

async function refreshContacts() {
    allContacts = await loadAllContactsFromRemoteStorage();
    showAllContacts(allContacts);
}

async function createContactForRemoteStorage(event) {
    event.preventDefault();
    let nameInput = document.getElementById('add-contact-name-input');
    let emailInput = document.getElementById('add-contact-email-input');
    let phoneInput = document.getElementById('add-contact-phone-input');
    let initial = createUserInitial(nameInput.value);
    let profilcolor = getProfilColorIcon();
    postContactsToRemoteStorage(nameInput.value, emailInput.value, phoneInput.value, initial, profilcolor);
    closeAddContactOverlay();
    showCreateContactSuccess();
    
}

function createUserInitial(nameInput) {
    let initial = nameInput.trim().split(' ');
    let firstLetterInitial = initial[0].charAt(0).toUpperCase();
    let secondLetterInitial = initial[1].charAt(0).toUpperCase();
    return firstLetterInitial + secondLetterInitial;
}

function getProfilColorIcon() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function validateSignupInput(input) {
    const errorMessage = document.getElementById(input.id + '-validation-message');
    const wrapper = input.closest('.user-input-wrapper');
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

function clearErrorMessage(input) {
    let errorMessage = document.getElementById(input.id + '-validation-message');
    let wrapper = input.closest('.user-input-wrapper');
    errorMessage.classList.add('d_none');
    wrapper.classList.remove('input-error');
    const defaultText = errorMessage.getAttribute('data-default-message');
    if (defaultText && errorMessage.innerHTML !== defaultText) {
        errorMessage.innerHTML = defaultText;
    }
}

async function getChangesFromContact(id, event, profilcolor, initial) {
    let selectedContact = document.getElementById('contact-details');  
    event.preventDefault();
    let nameInput = document.getElementById('add-contact-name-input');
    let emailInput = document.getElementById('add-contact-email-input');
    let phoneInput = document.getElementById('add-contact-phone-input');
    let initialInput = createUserInitial(nameInput.value);    
    const updatedContact = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        profilcolor: profilcolor,
        initial: initialInput
    };    
    await updateContactInRemoteStorage(id, updatedContact);
    closeEditContactOverlay();
    await refreshContacts();
    selectedContact.innerHTML = "";
}

async function showCreateContactSuccess() {
    const overlay = document.getElementById('success-message-overlay');
    overlay.classList.remove('d_none');
    overlay.classList.add('show');
    setTimeout(() => {
        overlay.classList.add('d_none');
        overlay.classList.remove('show');
    }, 800);
    await initContacts();
}
