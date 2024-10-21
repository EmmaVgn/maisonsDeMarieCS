function initializeCommentsPagination() {
    const commentsPerPage = 6;
    let currentPage = 1;
    const loadMoreButton = document.getElementById('loadMoreComments');

    if (!loadMoreButton) return; // Si le bouton "Voir plus" n'est pas sur la page, arrêtez la fonction

    loadMoreButton.addEventListener('click', () => {
        const comments = document.querySelectorAll('.comment-item.d-none');
        const toShow = Array.from(comments).slice(0, commentsPerPage);

        toShow.forEach(comment => {
            comment.classList.remove('d-none');
        });

        currentPage++;

        // Si tous les commentaires sont affichés, masquer le bouton "Voir plus"
        if (document.querySelectorAll('.comment-item.d-none').length === 0) {
            loadMoreButton.style.display = 'none';
        }
    });
}

// Écoutez l'événement Turbo Drive `turbo:load` et l'événement DOM `DOMContentLoaded`
document.addEventListener('turbo:load', initializeCommentsPagination);
document.addEventListener('DOMContentLoaded', initializeCommentsPagination);
