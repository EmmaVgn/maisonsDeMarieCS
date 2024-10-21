let listenersAttached = false; // Flag pour éviter la ré-attache multiple des écouteurs

function increment(field) {
    var input = document.getElementById('ad_step1_form_' + field);
    if (input) {
        input.value = parseInt(input.value) + 1;
        updateButtonState(field);
    }
}

function decrement(field) {
    var input = document.getElementById('ad_step1_form_' + field);
    if (input && parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        updateButtonState(field);
    }
}

function updateButtonState(field) {
    var input = document.getElementById('ad_step1_form_' + field);
    var decrementButton = document.getElementById('decrement_' + field);
    if (input && decrementButton) {
        decrementButton.disabled = parseInt(input.value) <= 1;
    }
}

function initializeIncrementDecrement() {
    if (listenersAttached) {
        return; // Éviter la ré-attache multiple
    }

    // Mettre à jour l'état initial des boutons
    updateButtonState('rooms');
    updateButtonState('beds');

    // Ajouter les écouteurs d'événements aux boutons d'incrémentation et de décrémentation
    var incrementRoomsButton = document.getElementById('increment_rooms');
    var decrementRoomsButton = document.getElementById('decrement_rooms');
    var incrementBedsButton = document.getElementById('increment_beds');
    var decrementBedsButton = document.getElementById('decrement_beds');

    // Utiliser removeEventListener avant d'ajouter un nouvel écouteur
    if (incrementRoomsButton) {
        incrementRoomsButton.removeEventListener('click', incrementRooms);
        incrementRoomsButton.addEventListener('click', incrementRooms);
    }
    if (decrementRoomsButton) {
        decrementRoomsButton.removeEventListener('click', decrementRooms);
        decrementRoomsButton.addEventListener('click', decrementRooms);
    }
    if (incrementBedsButton) {
        incrementBedsButton.removeEventListener('click', incrementBeds);
        incrementBedsButton.addEventListener('click', incrementBeds);
    }
    if (decrementBedsButton) {
        decrementBedsButton.removeEventListener('click', decrementBeds);
        decrementBedsButton.addEventListener('click', decrementBeds);
    }

    listenersAttached = true; // Marquer que les écouteurs sont attachés
}

// Les fonctions de callback pour éviter les ré-attaches de même fonction
function incrementRooms() {
    increment('rooms');
}

function decrementRooms() {
    decrement('rooms');
}

function incrementBeds() {
    increment('beds');
}

function decrementBeds() {
    decrement('beds');
}

// Initialiser au chargement normal de la page
document.addEventListener('DOMContentLoaded', function () {
    initializeIncrementDecrement();
});

// Initialiser lors du chargement complet ou partiel de la page avec Turbo
document.addEventListener('turbo:load', function () {
    initializeIncrementDecrement();
});

document.addEventListener('turbo:frame-load', function () {
    initializeIncrementDecrement();
});

// Réinitialiser lors de la navigation (retour/avant) avec Turbo
document.addEventListener('turbo:render', function () {
    initializeIncrementDecrement();
});
