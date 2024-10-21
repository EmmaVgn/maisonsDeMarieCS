document.addEventListener('turbo:load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('adId') || urlParams.has('userId')) {
        // Remplacer l'URL avec les paramètres nettoyés
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }
});