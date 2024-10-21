// assets/js/form_handling.js

// Fonction pour détecter si l'écran est considéré comme mobile
function isScreenMobile() {
    return window.innerWidth < 950; // Ajustez la taille selon vos besoins
}

// Fonction pour initialiser le traitement du formulaire
function initFormHandling() {
    const form = document.querySelector('#formDetailEq'); // Remplacez par l'ID de votre formulaire

    if (form) {
        // Ajoute ou met à jour le champ caché pour l'information de l'écran
        let mobileField = form.querySelector('input[name="is_mobile"]');
        if (!mobileField) {
            mobileField = document.createElement('input');
            mobileField.type = 'hidden';
            mobileField.name = 'is_mobile';
            form.appendChild(mobileField);
        }
        mobileField.value = isScreenMobile() ? '1' : '0';

        form.classList.toggle('mobile-screen', isScreenMobile());
    }

    // Écouter les événements Turbo pour mettre à jour le formulaire si nécessaire
    document.addEventListener('turbo:load', function () {
        const form = document.querySelector('#formDetailEq'); // Remplacez par l'ID de votre formulaire
        if (form) {
            let mobileField = form.querySelector('input[name="is_mobile"]');
            if (!mobileField) {
                mobileField = document.createElement('input');
                mobileField.type = 'hidden';
                mobileField.name = 'is_mobile';
                form.appendChild(mobileField);
            }
            mobileField.value = isScreenMobile() ? '1' : '0';

            form.classList.toggle('mobile-screen', isScreenMobile());
        }
    });
}

// Appeler la fonction d'initialisation au chargement initial de la page
document.addEventListener('DOMContentLoaded', function () {
    initFormHandling();
});
