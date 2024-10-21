document.addEventListener("DOMContentLoaded", function() {
    const ads = document.querySelectorAll(".card-link-to");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    if (!prevButton || !nextButton) {
        console.warn("Previous or next button not found in the DOM.");
        return; // Stop further execution
    }

    let currentIndex = 0;
    const adsToShow = 3;
    const maxAds = Math.min(ads.length, 10);

    function showAds(index) {
        ads.forEach((ad, i) => {
            if (i >= index && i < index + adsToShow) {
                ad.classList.remove('hidden');
            } else {
                ad.classList.add('hidden');
            }
        });
    }

    function updateButtons() {
        prevButton.classList.toggle('inactive', currentIndex === 0);
        nextButton.classList.toggle('inactive', currentIndex + adsToShow >= maxAds);
    }

    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex -= adsToShow;
            showAds(currentIndex);
            updateButtons();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentIndex + adsToShow < maxAds) {
            currentIndex += adsToShow;
            showAds(currentIndex);
            updateButtons();
        }
    });

    // Initialize
    showAds(currentIndex);
    updateButtons();
});
