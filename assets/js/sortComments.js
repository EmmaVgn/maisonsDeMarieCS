document.addEventListener('DOMContentLoaded', function () {
    // Function to sort comments
    function sortComments(criteria) {
        const commentsContainer = document.querySelector('.comments-list');
        if (!commentsContainer) {
            return;
        }
        const comments = Array.from(commentsContainer.querySelectorAll('.comment'));

        let sortedComments;

        if (criteria === 'best') {
            sortedComments = comments.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
        } else if (criteria === 'worst') {
            sortedComments = comments.sort((a, b) => parseFloat(a.dataset.rating) - parseFloat(b.dataset.rating));
        } else {
            sortedComments = comments.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
        }

        // Clear the container and append sorted comments
        commentsContainer.innerHTML = '';
        sortedComments.forEach(comment => commentsContainer.appendChild(comment));
    }

    // Function to update the dropdown button text
    function updateDropdownButtonText(text) {
        const dropdownButton = document.querySelector('.bag0r3l.dropdown-toggle');
        if (dropdownButton) {
            dropdownButton.textContent = text;
        }
    }

    // Add event listeners to dropdown items only when the modal is fully shown
    const commentsModal = document.getElementById('commentsModal');
    commentsModal.addEventListener('shown.bs.modal', function () {
        // Attach event listeners for sorting only after the modal is shown
        const dropdownItems = document.querySelectorAll('.dropdown-item.dropdown-comment');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                const sortCriteria = this.dataset.sort;
                sortComments(sortCriteria);

                // Update the button text with the selected option
                updateDropdownButtonText(this.textContent.trim());
            });
        });
    });
});
