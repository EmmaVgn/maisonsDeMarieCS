document.addEventListener('turbo:load', initializeRadioButtons);
document.addEventListener('turbo:frame-load', initializeRadioButtons);

function initializeRadioButtons() {
    const radios = document.querySelectorAll('input[type="radio"][name="ad_cancellation_edit_form[cancellation]"]');
    const submitButton = document.querySelector('button[type="submit"]');

    // Ensure the submit button is initially disabled
    if (submitButton) {
        submitButton.disabled = true;
    }

    // Function to handle radio button changes
    function handleRadioChange(event) {
        const selectedRadio = event.target;
        
        radios.forEach(radio => {
            const label = radio.closest('label');
            if (label) {
                label.classList.remove('cty1afa');
                const div = label.querySelector('.rh20is1');
                if (div) {
                    div.classList.remove('r1khecnq');
                }
            }
        });

        const selectedLabel = selectedRadio.closest('label');
        if (selectedLabel) {
            selectedLabel.classList.add('cty1afa');
            const selectedDiv = selectedLabel.querySelector('.rh20is1');
            if (selectedDiv) {
                selectedDiv.classList.add('r1khecnq');
            }
        }

        // Enable the submit button when a radio button is changed
        if (submitButton) {
            submitButton.disabled = false;
        }
    }

    // Attach change event listeners to all radio buttons
    radios.forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });

    // Check if any radio is checked, if not, check the correct one
    const checkedRadio = Array.from(radios).find(radio => radio.checked);
    if (!checkedRadio && radios.length > 0) {
        const adCancellationId = document.querySelector('input[name="ad_cancellation_edit_form[cancellation]"]').value;
        const radioToCheck = Array.from(radios).find(radio => radio.value === adCancellationId) || radios[0];
        radioToCheck.checked = true;
        radioToCheck.dispatchEvent(new Event('change'));
    } else if (checkedRadio) {
        checkedRadio.dispatchEvent(new Event('change'));
    }
}
