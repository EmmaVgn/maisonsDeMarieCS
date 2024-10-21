// Fonction d'initialisation pour attacher les écouteurs et mettre à jour l'état des boutons
function initializeStepper(container = document) {
    // Vérification du type de container
    if (!(container instanceof Element) && container !== document) {
        console.warn('initializeStepper: Le container n\'est pas un élément DOM valide, utilisation de document par défaut.');
        container = document;
    }

    // Initialiser l'état des boutons pour chaque champ input dans le container spécifié
    container.querySelectorAll('.input-stepper-item').forEach(function(input) {
        updateButtonState(input);
    });

    // Ajouter des écouteurs d'événements aux boutons d'incrémentation et de décrémentation dans le container spécifié
    container.querySelectorAll('.btn-stepper').forEach(function(button) {
        // Supprimer les anciens écouteurs d'événements pour éviter les doublons
        button.removeEventListener('click', handleStepperClick);
        // Ajouter un nouvel écouteur d'événement
        button.addEventListener('click', handleStepperClick);
    });
}

// Fonction de gestion des clics sur les boutons de stepper
function handleStepperClick() {
    var input = this.closest('.c1cyarof').querySelector('.input-stepper-item');
    if (this.id.includes('increment')) {
        increment(input);
    } else if (this.id.includes('decrement')) {
        decrement(input);
    }
}

// Fonction d'incrémentation
function increment(input) {
    input.value = parseInt(input.value) + 1;
    updateButtonState(input);
}

// Fonction de décrémentation
function decrement(input) {
    if (input.value > input.min) {
        input.value = parseInt(input.value) - 1;
        updateButtonState(input);
    }
}

// Fonction pour mettre à jour l'état des boutons
function updateButtonState(input) {
    var decrementButton = input.closest('.c1cyarof').querySelector('.btn-stepper[id*="decrement"]');
    if (parseInt(input.value) <= parseInt(input.min)) {
        decrementButton.disabled = true;
    } else {
        decrementButton.disabled = false;
    }
}

// Écouter les événements du DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeStepper();
});

// Écouter les événements Turbo
document.addEventListener('turbo:load', function() {
    initializeStepper();
});

document.addEventListener('turbo:frame-load', function() {
    initializeStepper();
});

document.addEventListener('turbo:render', function() {
    initializeStepper();
});

document.addEventListener('turbo:before-render', function() {
    initializeStepper();
});
