function initializeStarRating() {
    const ratingInput = document.querySelector('#comment_form_rating');
    if (ratingInput) {
        const starRating = document.querySelector('.star-rating');

        if (!starRating) {
            return;
        }

        starRating.addEventListener('mouseover', function (event) {
            if (event.target.matches('svg') || event.target.closest('svg')) {
                const target = event.target.matches('svg') ? event.target : event.target.closest('svg');
                const ratingValue = target.getAttribute('data-rating');
                ratingInput.value = ratingValue;
                
                // Met à jour l'apparence des étoiles
                starRating.querySelectorAll('svg').forEach(function (star) {
                    const starRatingValue = star.getAttribute('data-rating');
                    if (starRatingValue <= ratingValue) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });
    } else {
        console.log("ratingInput element not found");
    }
}

// S'assurer que la fonction est appelée sur les bons événements
document.addEventListener('turbo:load', initializeStarRating);
document.addEventListener('DOMContentLoaded', initializeStarRating);
