/**
 * Creates and returns a "Move to" action menu for a card.
 * @param {Element} card - Task card element
 * @returns {Element} Action menu element
 */
function createActionMenu(card) {
    let menu = document.createElement("div");
    menu.className = "card-action-menu";
    let optionsHTML = buildMoveOptions(getTaskStatus(card));
    menu.innerHTML = `<div class="menu-header">Move to</div>${optionsHTML}`;
    attachMenuListeners(menu, card);
    return menu;
}

/**
 * Finds all cards and attaches dropdown menus.
 */
function attachDropdownsToCards() {
    document.querySelectorAll(".card").forEach(attachToCardDropdown);
}


/**
* Sets up the main application logic after the window has fully loaded.
*/
window.addEventListener("load", () => {
    init();
    updateDraggables();
    updateBoardContent();
});