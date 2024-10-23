

document.addEventListener('DOMContentLoaded', function () {
    var startDateInput = document.querySelector("#booking_form_startDateAt");
    var endDateInput = document.querySelector("#booking_form_endDateAt");
    var slug = document.querySelector('input[name="ad_slug"]').value;
    var submitBtn = document.getElementById('submit-btn');

    let daysDifference = 0; // Declare variable at the appropriate scope

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

    function initializeFlatpickr(notAvailableDays) {
        if (!Array.isArray(notAvailableDays)) {
            console.error('notAvailableDays is not an array:', notAvailableDays);
            notAvailableDays = [];
        }

        // Set default values for date fields
        startDateInput.value = startDateInput.value || new Date().toISOString().split('T')[0];
        endDateInput.value = endDateInput.value || new Date().toISOString().split('T')[0];

        const flatpickrOptions = {
            locale: "fr",
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "d.m.Y",
            disable: notAvailableDays,
            minDate: "today",
            onChange: handleDateChange // Use a single handler for both inputs
        };

        // Initialize Flatpickr for both start and end date
        flatpickr(startDateInput, flatpickrOptions);
        flatpickr(endDateInput, flatpickrOptions);
    }

    function handleDateChange() {
        calculateDuration();
        updateSubmitButtonState();
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    handleError(data);
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showAlert('Une erreur s\'est produite lors de la soumission du formulaire. Veuillez réessayer.');
            });
        });
    }

    function handleError(data) {
        if (data.error) {
            showAlert(data.error);
        } else if (data.errors) {
            data.errors.forEach(showAlert);
        }
    }

    function showAlert(message) {
        var alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning';
        alertDiv.innerText = message;

        var form = document.querySelector('form');
        form.insertBefore(alertDiv, form.firstChild);

        setTimeout(() => alertDiv.remove(), 5000);
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
            daysDifference = timeDifference / (1000 * 3600 * 24);
        }

        updateDurationDisplay();
        calculateTotalPrice();
        validateReservation();
    }

    function updateDurationDisplay() {
        var durationElement = document.getElementById('days');
        durationElement.textContent = daysDifference;
    }

    function calculateTotalPrice() {
        var priceElement = document.getElementById('priceValue');
        var priceText = priceElement.innerText;
        var price = parseFloat(priceText.replace('par nuit', '').trim());

        if (isNaN(price)) {
            console.error("Le prix n'est pas un nombre valide.");
            return;
        }

        var amount = daysDifference * price;
        var totalPriceElement = document.getElementById('totalPrice');
        totalPriceElement.textContent = amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    }

    function validateReservation() {
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
        var month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JS
        var year = parseInt(dateParts[2], 10);

        var date = new Date(year, month, day);

        if (isNaN(date.getTime())) {
            console.error("La date n'est pas valide : ", dateStr);
            return null;
        }

        return date;
    }
});
