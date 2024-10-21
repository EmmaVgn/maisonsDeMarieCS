document.addEventListener("DOMContentLoaded", function() {
    const comments = document.querySelectorAll(".card-comment");
    const prevButtonComment = document.getElementById("prevButtonComment");
    const nextButtonComment = document.getElementById("nextButtonComment");

    if (!prevButtonComment || !nextButtonComment) {
        console.warn("Previous or next comment button not found in the DOM.");
        return; // Stop further execution
    }

    let currentIndex = 0;
    const commentsToShow = 2;
    const maxComments = Math.min(comments.length, 10);

    function showComments(index) {
        comments.forEach((comment, i) => {
            if (i >= index && i < index + commentsToShow) {
                comment.classList.remove('hidden');
            } else {
                comment.classList.add('hidden');
            }
        });
    }

    function updateButtons() {
        prevButtonComment.classList.toggle('inactive', currentIndex === 0);
        nextButtonComment.classList.toggle('inactive', currentIndex + commentsToShow >= maxComments);
    }

    prevButtonComment.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex -= commentsToShow;
            showComments(currentIndex);
            updateButtons();
        }
    });

    nextButtonComment.addEventListener("click", () => {
        if (currentIndex + commentsToShow < maxComments) {
            currentIndex += commentsToShow;
            showComments(currentIndex);
            updateButtons();
        }
    });

    // Initialize
    showComments(currentIndex);
    updateButtons();
});