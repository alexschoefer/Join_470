function addTaskSubtaskTemplate() {
    return `
        <div class="subtask">
            <span type="text" class="subtask-title" placeholder="Subtask Title" contenteditable="true"></span>
            <button type="button" class="remove-subtask">Remove</button>
        </div>
    `;
}