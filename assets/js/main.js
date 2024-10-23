document.addEventListener('DOMContentLoaded', function () {
    var startDateInput = document.querySelector("#booking_form_startDateAt");
    var endDateInput = document.querySelector("#booking_form_endDateAt");
    var slug = document.querySelector('input[name="ad_slug"]').value;
    var submitBtn = document.getElementById('submit-btn');
    var durationElement = document.getElementById('days');
    var amountElement = document.getElementById('amount');

    async function fetchNotAvailableDays(slug) {
        try {
            const response = await fetch(`/api/ads/${slug}/not-available-days`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched not available days:', data);
            return data;
        } catch (error) {
            console.error('Error fetching not available days:', error);
            return [];
        }
    }

    function setupFlatpickr(input, notAvailableDays) {
        flatpickr(input, {
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "d.m.Y",
            locale: "fr",
            disable: notAvailableDays,
            minDate: "today",
            defaultDate: input.value,
            onChange: function () {
                calculateDuration();
                updateSubmitButtonState(); // Met à jour l'état du bouton sur changement de date
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
                    resetForm();
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

    function showAlert(message, type = 'warning') {
        var alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`; // Utilise les classes Bootstrap pour le style
        alertDiv.innerText = message;

        var form = document.querySelector('form');
        form.insertBefore(alertDiv, form.firstChild);

        // Supprime l'alerte après 5 secondes
        setTimeout(function () {
            alertDiv.remove();
        }, 5000);
    }

    function resetForm() {
        startDateInput.value = '';
        endDateInput.value = '';
        durationElement.textContent = '';
        amountElement.textContent = '0.00';
        updateSubmitButtonState();
    }

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
        amountElement.textContent = amount.toFixed(2);
    }

    function parseDate(dateStr) {
        var parts = dateStr.split('.');
        if (parts.length === 3) {
            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10) - 1; // Les mois commencent à 0
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

    // Appel initial pour récupérer les jours non disponibles et configurer les champs de date
    fetchNotAvailableDays(slug).then(notAvailableDays => {
        setupFlatpickr(startDateInput, notAvailableDays);
        setupFlatpickr(endDateInput, notAvailableDays);
        handleFormSubmission();
    });

    // Appel initial pour mettre à jour l'état du bouton de soumission
    updateSubmitButtonState();
});
