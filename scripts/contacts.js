let allContacts = [];
let colors = ['#FF7A00', '#FF5EB3', '#FF5EB3', '#9327FF', '#FF4646', '#C3FF2B', '#FF745E', '#FFE62B', '#00BEE8', '#0038FF'];

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
        let existingProfil = existingContacts.find(c => c.email === email);
        if (existingProfil) {
            await updateContactInRemoteStorage(existingProfil.id, { name, email, phone, initial, profilcolor });
        } else {
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
    const selectedContact = document.getElementById('contact-details');
    selectedContact.innerHTML = "";
    toggleActiveContact(event.currentTarget);
    currentOverlayMode = currentDeviceType;
    currentContactIndex = index;
    if (currentDeviceType === 'desktop') {
        selectedContact.innerHTML = showContactInformationsTemplate(contact, index);
    } else {
        getContactInformationMobile(contact, index);
    }
}


function arrowBack() {
    document.getElementById('contact-list').classList.remove('d_none');
    document.getElementById('contacts-left-container').classList.remove('d_none');
    document.getElementById('contacts-right').style.display = 'none';
    document.getElementById('contact-details').innerHTML = "";
    let arrowBackRef = document.getElementById('arrow-back');
    arrowBackRef.style.display = 'none';
    refreshContacts();
}

function getContactInformationMobile(contact, index) {
    document.getElementById('contact-list')?.classList.add('d_none');
    document.getElementById('contacts-left-container')?.classList.add('d_none');
    let rightContainer = document.getElementById('contacts-right');
    rightContainer.style.display = 'flex';
    let arrowBackRef = document.getElementById('arrow-back');
    arrowBackRef.style.display = 'flex';
    let contactDetails = document.getElementById('contact-details');
    contactDetails.innerHTML = showContactInformationsTemplate(contact, index);
}

function renderAddContactOverlay() {
    isOverlayOpen = true;
    currentOverlayType = 'add';
    currentOverlayMode = currentDeviceType;
    const container = document.getElementById('addNewContactOverlayContainer');
    container.innerHTML = currentDeviceType === 'mobile'
        ? addNewContactTemplateMobile()
        : addNewContactTemplate();
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
    renderEditContactOverlay(contact, index);
}

function addNewContact() {
    const overlay = document.getElementById('addNewContactOverlayContainer');
    overlay.classList.remove('d_none');
    const mobileAddContactBtn = document.querySelector('.mobile-add-contact-button-create-icon');
    if (mobileAddContactBtn) mobileAddContactBtn.classList.add('d_none');
    renderAddContactOverlay();
}


function renderEditContactOverlay(contact, index) {
    isOverlayOpen = true;
    currentOverlayType = 'edit';
    currentOverlayMode = currentDeviceType;
    lastEditedContact = contact;
    lastEditedIndex = index;
    const container = document.getElementById('editContactOverlayContainer');
    container.innerHTML = currentDeviceType === 'mobile'
        ? editContactTemplateMobile(contact, index)
        : editContactTemplate(contact, index);
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

function changeContact(index) {
    const btnContainer = document.getElementById('mobile-contact-profil-btns-container');
    const editButton = document.querySelector('.mobile-button-wrapper');
    const mobileBtnWrapper = document.getElementById('mobile-button-wrapper');
    mobileBtnWrapper.classList.add('d_none');
    btnContainer.classList.remove('d_none');
    setTimeout(() => {
        btnContainer.classList.add('slide-in');
        document.addEventListener('click', hideMobileContactBtns);
    }, 10);
}

function hideMobileContactBtns(event) {
    const btnContainer = document.getElementById('mobile-contact-profil-btns-container');
    const isClickInsideMenu = btnContainer.contains(event.target);
    if (!isClickInsideMenu) {
        btnContainer.classList.remove('slide-in');
        setTimeout(() => {
            btnContainer.classList.add('d_none');
        }, 400); 
        document.getElementById('mobile-button-wrapper').classList.remove('d_none');
        document.removeEventListener('click', hideMobileContactBtns);
    }
}

function adaptLayoutOnResize() {
    const contactIsOpen = document.getElementById('contact-details').innerHTML.trim() !== '';
    const left = document.getElementById('contacts-left-container');
    const list = document.getElementById('contact-list');
    const right = document.getElementById('contacts-right');

    // Immer Kontaktbereich anzeigen
    right.style.display = 'flex';

    // Wenn kein Kontakt offen ist, beende hier (aber lass den Kontaktbereich sichtbar)
    if (!contactIsOpen) return;

    // Wenn Kontakt offen: je nach Gerät Ansicht anpassen
    const show = currentDeviceType === 'desktop';
    left.classList.toggle('d_none', !show);
    list.classList.toggle('d_none', !show);
}