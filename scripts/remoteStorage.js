/**
 * Asynchronously pushes a list of predefined dummy tasks (standardTasks) to a remote storage 
 * If an error occurs during any fetch operation, it will be logged to the console.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when all tasks have been processed.
 */
async function pushDummyTasksToRemoteStorage() {
    for (const task of standartTasks) {
        try {
            const response = await fetch(`${fetchURLDataBase}/tasks/${task.id}.json`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });
        } catch (error) {
            console.error(`Error by fetching Task from dataRemoteStorage, ${task.id}:`, error);
        }
    }
}

// async function getTasksFromRemoteStorage(path) {
//   let response = await fetch(fetchURLDataBase + path + ".json");
//   if (response.ok) {
//     let data = await response.json();
//     if (Array.isArray(data)) {
//       return data;
//     } else {
//       return;
//     }
//   }
// }

/**
 * Asynchronously retrieves tasks from the remote storage at the given path.
 *
 * Fetches JSON data from the constructed URL using the global `fetchURLDataBase` and the provided path.
 * If the response is valid and contains data, it returns the tasks as an array.
 *
 * @async
 * @function
 * @param {string} path - The path to append to the base URL when fetching tasks.
 * @returns {Promise<Array>} A promise that resolves to an array of task objects or an empty array.
 */
async function getTasksFromRemoteStorage(path) {
    let response = await fetch(fetchURLDataBase + path + ".json");
    if (response.ok) {
        let data = await response.json();
        if (!data) return [];

        // ✅ Wenn data ein Objekt ist → in Array umwandeln
        if (typeof data === 'object' && !Array.isArray(data)) {
            return Object.values(data); // gibt Array der Werte zurück
        }

        // Falls doch ein Array
        if (Array.isArray(data)) {
            return data;
        }
    }
    return [];
}

/**
 * Asynchronously saves data to the remote storage at the specified path.
 *
 * @async
 * @function
 * @param {string} path - The path appended to the base URL where the data should be saved.
 * @param {*} data - The data to be saved; it will be stringified into JSON.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
async function saveTasksToRemoteStorage(path, data) {
    await fetch(fetchURLDataBase + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}


/**
 * Asynchronously deletes data from the remote storage at the specified path.
 *
 * Sends a DELETE request to the constructed URL (based on `fetchURLDataBase` and the given path).
 * Returns the parsed JSON response from the server, if any.
 *
 * @async
 * @param {string} path - The path appended to the base URL where the data should be deleted.
 * @returns {Promise<any>} A promise that resolves to the server's JSON response (if available).
 */
async function deleteTasksToRemoteStorage(path) {
    const response = await fetch(fetchURLDataBase + path + ".json", {
        method: "DELETE",
    });
    return await response.json();
}


/**
 * Asynchronously edits (updates) data at the specified path in the remote storage.
 *
 * Sends a PATCH request to the constructed URL (based on `fetchURLDataBase` and the given path)
 * with the provided data serialized as JSON. This updates only the specified fields without
 * overwriting the entire resource. Returns the parsed JSON response from the server.
 *
 * @async
 * @param {string} path - The path appended to the base URL where the data should be updated.
 * @param {*} data - The partial data to be updated; it will be stringified into JSON.
 * @returns {Promise<any>} A promise that resolves to the server's JSON response.
 */
async function editTasksToRemoteStorage(path, data) {
    const response = await fetch(fetchURLDataBase + path + ".json", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}