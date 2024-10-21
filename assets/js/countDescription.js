document.addEventListener('DOMContentLoaded', function () {
    function updateCount(textArea, countSpan, maxCount) {
        if (textArea && countSpan) {
            const count = textArea.value.length;
            countSpan.textContent = maxCount - count;

            if (count > maxCount) {
                textArea.classList.add('textarea-name-error');
            } else {
                textArea.classList.remove('textarea-name-error');
            }
        }
    }

    function attachEventListenersToTextArea(textAreaSelector, countSpanSelector, maxCount) {
        const textArea = document.querySelector(textAreaSelector);
        const countSpan = document.querySelector(countSpanSelector);

        if (textArea && countSpan) {
            // Initial calculation
            updateCount(textArea, countSpan, maxCount);

            // Add keyup event listener
            textArea.addEventListener('keyup', function () {
                updateCount(textArea, countSpan, maxCount);
            });

            // Add form submit event listener
            const form = textArea.closest('form');
            if (form) {
                form.addEventListener('submit', (event) => {
                    // Recalculate remaining characters after submission
                    setTimeout(() => {
                        updateCount(textArea, countSpan, maxCount);
                    }, 0);
                });
            }
        } else {
            console.log(`Text area or count span not found: ${textAreaSelector}, ${countSpanSelector}`); // Log pour le débogage
        }
    }

    // Attach event listeners for both the main form and the modal form
    attachEventListenersToTextArea('.description-textarea', '.description-count', 1500);

    // Événements Turbo : exécution du script après les mises à jour du DOM par Turbo
    document.addEventListener('turbo:load', function () {
        attachEventListenersToTextArea('.description-textarea', '.description-count', 1500);
    });

    document.addEventListener('turbo:frame-load', function () {
        attachEventListenersToTextArea('.description-textarea', '.description-count', 1500);
    });

    document.addEventListener('turbo:render', function () {
        attachEventListenersToTextArea('.description-textarea', '.description-count', 1500);
    });

    document.addEventListener('turbo:before-render', function () {
        attachEventListenersToTextArea('.description-textarea', '.description-count', 1500);
    });
});
