let listenersAttached = false; // Flag pour éviter la ré-attache multiple des écouteurs

function increment(field) {
    var input = document.getElementById('ad_step2_form_' + field);
    if (input) {
        input.value = parseInt(input.value) + 1;
        updateButtonState(field);
    }
}

function decrement(field) {
    var input = document.getElementById('ad_step2_form_' + field);
    if (input && parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        updateButtonState(field);
    }
}

function updateButtonState(field) {
    var input = document.getElementById('ad_step2_form_' + field);
    var decrementButton = document.getElementById('decrement_' + field);
    if (input && decrementButton) {
        decrementButton.disabled = parseInt(input.value) <= 1;
    }
}

function initializeIncrementDecrement() {
    if (listenersAttached) {
        return;
    }

    // Mettre à jour l'état initial des boutons
    updateButtonState('capacity');

    // Ajouter les écouteurs d'événements aux boutons d'incrémentation et de décrémentation
    var incrementCapacityButton = document.getElementById('increment_capacity');
    var decrementCapacityButton = document.getElementById('decrement_capacity');

    // Utiliser removeEventListener avant d'ajouter un nouvel écouteur
    if (incrementCapacityButton) {
        incrementCapacityButton.removeEventListener('click', incrementCapacity);
        incrementCapacityButton.addEventListener('click', incrementCapacity);
    }
    if (decrementCapacityButton) {
        decrementCapacityButton.removeEventListener('click', decrementCapacity);
        decrementCapacityButton.addEventListener('click', decrementCapacity);
    }

    listenersAttached = true; // Marquer que les écouteurs sont attachés
}

// Les fonctions de callback pour éviter les ré-attaches de même fonction
function incrementCapacity() {
    increment('capacity');
}

function decrementCapacity() {
    decrement('capacity');
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