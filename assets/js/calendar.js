// assets/js/main.js

document.addEventListener('DOMContentLoaded', function () {
    var startDateInput = document.querySelector("#booking_form_startDateAt");
    var endDateInput = document.querySelector("#booking_form_endDateAt");
    var slug = document.querySelector('input[name="ad_slug"]').value;
    var submitBtn = document.getElementById('submit-btn');

    async function fetchNotAvailableDays(slug) {
        try {
            const response = await fetch(`/api/ads/${slug}/not-available-days`);
            const data_1 = await response.json();
            console.log('Fetched not available days:', data_1);
            return data_1;
        } catch (error) {
            console.error('Error fetching not available days:', error);
            return [];
        }
    }

    function initializeFlatpickr(notAvailableDays) {
        if (!Array.isArray(notAvailableDays)) {
            console.error('notAvailableDays is not an array:', notAvailableDays);
            notAvailableDays = [];
        }

        if (!startDateInput.value) {
            startDateInput.value = new Date().toISOString().split('T')[0];
        }
        if (!endDateInput.value) {
            endDateInput.value = new Date().toISOString().split('T')[0];
        }

        flatpickr(startDateInput, {
                locale: French,
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "d.m.Y",
            locale: "fr",
            disable: notAvailableDays,
            minDate: "today",
            defaultDate: startDateInput.value,
            onChange: function (selectedDates, dateStr, instance) {
                var endDate = new Date(instance.selectedDates[0]);
                endDate.setDate(endDate.getDate() + 2);
                endDateInput.flatpickr.set('minDate', endDate);
                calculateDuration();
            }
        });

        flatpickr(endDateInput, {
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "d.m.Y",
            locale: "fr",
            disable: notAvailableDays,
            minDate: new Date().fp_incr(2), // minimum two nights
            defaultDate: endDateInput.value,
            onChange: function () {
                calculateDuration();
            }
        });
    }

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

    function showAlert(message) {
        // Créer un élément div pour afficher le message d'alerte
        var alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning'; // Utilise les classes Bootstrap pour le style
        alertDiv.innerText = message;

        // Ajoute l'élément d'alerte en haut du formulaire
        var form = document.querySelector('form');
        form.insertBefore(alertDiv, form.firstChild);

        // Supprime l'alerte après 5 secondes
        setTimeout(function () {
            alertDiv.remove();
        }, 5000);
    }

    fetchNotAvailableDays(slug).then(notAvailableDays => {
        initializeFlatpickr(notAvailableDays);
        handleFormSubmission();
    });

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

        if (startDate > endDate) {
            console.log("La date de départ est postérieure à la date d'arrivée.");
            daysDifference = 0;
        } else {
            var timeDifference = endDate.getTime() - startDate.getTime();
            var daysDifference = timeDifference / (1000 * 3600 * 24);
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

        var totalPriceElement = document.getElementById('totalPrice');
        totalPriceElement.textContent = amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

        // Contrôle la validité de la soumission du formulaire
        if (daysDifference < 2) {
            console.log("La réservation doit être d'au moins deux nuits.");
            submitBtn.disabled = true;
        } else {
            console.log("La réservation est valide.");
            submitBtn.disabled = false;
        }
    }

    function parseDate(dateStr) {
        var dateParts = dateStr.split('.');

        if (dateParts.length !== 3) {
            console.error("Le format de la date n'est pas valide : ", dateStr);
            return null;
        }

        var day = parseInt(dateParts[0], 10);
        var month = parseInt(dateParts[1], 10) - 1;
        var year = parseInt(dateParts[2], 10);

        var date = new Date(year, month, day);

        if (isNaN(date.getTime())) {
            console.error("La date n'est pas valide : ", dateStr);
            return null;
        }

        return date;
    }
});
