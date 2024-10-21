import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { French } from "flatpickr/dist/l10n/fr.js";

document.addEventListener('DOMContentLoaded', function () {
    // Sélection des éléments du DOM
    var startDateInput = document.querySelector("#booking_form_startDateAt");
    var endDateInput = document.querySelector("#booking_form_endDateAt");
    var slug = document.querySelector('input[name="ad_slug"]').value;
    var submitBtn = document.getElementById('submit-btn');

    // Vérifie si les champs de date sont présents dans le DOM
    if (!startDateInput || !endDateInput) {
        console.error("Les champs de date ne sont pas trouvés dans le DOM.");
        return; // Sortir si les éléments ne sont pas présents
    }

    // Fonction pour récupérer les jours non disponibles
    async function fetchNotAvailableDays(slug) {
        try {
            const response = await fetch(`/api/ads/${slug}/not-available-days`);
            const data = await response.json();
            console.log('Fetched not available days:', data);
            return data;
        } catch (error) {
            console.error('Error fetching not available days:', error);
            return [];
        }
    }

    // Fonction pour initialiser Flatpickr
    function initializeFlatpickr(notAvailableDays) {
        if (!Array.isArray(notAvailableDays)) {
            console.error('notAvailableDays is not an array:', notAvailableDays);
            notAvailableDays = [];
        }

        // Définit les valeurs par défaut pour les champs de date
        if (!startDateInput.value) {
            startDateInput.value = new Date().toISOString().split('T')[0];
        }
        if (!endDateInput.value) {
            endDateInput.value = new Date().toISOString().split('T')[0];
        }

        // Initialisation de Flatpickr pour le champ de date de début
        flatpickr(startDateInput, {
            locale: French,
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "d.m.Y",
            disable: notAvailableDays,
            minDate: "today",
            defaultDate: startDateInput.value,
            onChange: function () {
                calculateDuration();
            }
        });

        // Initialisation de Flatpickr pour le champ de date de fin
        flatpickr(endDateInput, {
            locale: French,
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "d.m.Y",
            disable: notAvailableDays,
            minDate: "today",
            defaultDate: endDateInput.value,
            onChange: function () {
                calculateDuration();
            }
        });
    }

    // Fonction pour gérer la soumission du formulaire
    function handleFormSubmission() {
        document.querySelector('form').addEventListener('submit', function (event) {
            event.preventDefault();

            var form = event.target;
            var formData = new FormData(form);
            var action = form.action;

            fetch(action, {
                method: form.method,
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    if (data.error) {
                        showAlert(data.error);
                    } else if (data.errors) {
                        data.errors.forEach(error => {
                            showAlert(error);
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showAlert('Une erreur s\'est produite lors de la soumission du formulaire. Veuillez réessayer.');
            });
        });
    }

    // Fonction pour afficher une alerte
    function showAlert(message) {
        var alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning'; // Utilise les classes Bootstrap pour le style
        alertDiv.innerText = message;

        var form = document.querySelector('form');
        form.insertBefore(alertDiv, form.firstChild);

        // Supprime l'alerte après 5 secondes
        setTimeout(function () {
            alertDiv.remove();
        }, 5000);
    }

    // Fonction pour calculer la durée entre les dates
    function calculateDuration() {
        var startDateValue = startDateInput.value;
        var endDateValue = endDateInput.value;

        if (!startDateValue || !endDateValue) {
            console.error("Les valeurs des champs de date sont vides.");
            return;
        }

        var startDate = parseDate(startDateValue);
        var endDate = parseDate(endDateValue);

        if (!startDate || !endDate) {
            console.error("Les dates ne sont pas valides.");
            return;
        }

        let daysDifference;
        if (startDate > endDate) {
            console.log("La date de départ est postérieure à la date d'arrivée.");
            daysDifference = 0;
        } else {
            var timeDifference = endDate.getTime() - startDate.getTime();
            daysDifference = timeDifference / (1000 * 3600 * 24);
        }

        var durationElement = document.getElementById('days');
        durationElement.textContent = daysDifference;

        var priceElement = document.getElementById('priceValue');
        var priceText = priceElement.innerText;
        var price = parseFloat(priceText.replace('par nuit', '').trim());

        if (!isNaN(price)) {
            console.log("Prix récupéré en euros : ", price);
        } else {
            console.error("Le prix n'est pas un nombre valide.");
        }

        var amount = daysDifference * price;
        var amountElement = document.getElementById('amount');
        amountElement.textContent = amount.toFixed(2);
    }

    // Fonction pour parser une date au format d'affichage
    function parseDate(dateStr) {
        var parts = dateStr.split('.');
        if (parts.length === 3) {
            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10) - 1; // Les mois commencent à 0 en JavaScript
            var year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return null;
    }

    // Fonction pour mettre à jour l'état du bouton de soumission
    function updateSubmitButtonState() {
        if (!startDateInput.value || !endDateInput.value) {
            submitBtn.disabled = true; // Désactive le bouton si les champs de date sont vides
        } else {
            submitBtn.disabled = false; // Active le bouton si les champs de date sont remplis
        }
    }

    // Écouteurs d'événements pour les changements sur les champs de date
    startDateInput.addEventListener('change', updateSubmitButtonState);
    endDateInput.addEventListener('change', updateSubmitButtonState);

    // Appel initial pour mettre à jour l'état du bouton de soumission
    updateSubmitButtonState();

    // Récupération des jours non disponibles et initialisation de Flatpickr
    fetchNotAvailableDays(slug).then(notAvailableDays => {
        initializeFlatpickr(notAvailableDays);
        handleFormSubmission();
    });
});
