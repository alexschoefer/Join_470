let contacts = [];

function getAllContacts() {
    contactsDummy.forEach(contact => {
        const { name, email, phone } = contact;
        postContactsToRemoteStorage(name, email, phone);
    });
}

async function postContactsToRemoteStorage(name, email, phone) {
    let response = await fetch(fetchURLDataBase + '/contacts.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone || ""
        })
    });

    return await response.json();
}


function loadContacts(){

}