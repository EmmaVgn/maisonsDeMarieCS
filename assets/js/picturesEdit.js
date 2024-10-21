document.addEventListener('turbo:load', function () {
    var form = document.querySelector('form');
    var container = document.querySelector('.giaq8i3');
    var submitButton = form.querySelector('button[type="submit"]');
    var index = container.children.length;
    var element = document.getElementById('prototype-data');
    if (element) {
        var prototypeElement  = element.getAttribute('data-prototype');
        var prototype = JSON.parse(prototypeElement);
    }

    // Validation du nombre d'images
    // submitButton.addEventListener('click', function (e) {
    //     var imageInputs = container.querySelectorAll('input[type="file"]');
    //     console.log(imageInputs.length);
    //     var validImages = Array.from(imageInputs).filter(input => input.files.length > 0);
    //     console.log(validImages);

    //     if (validImages.length < 5) {
    //         e.preventDefault();
    //         alert('Vous devez télécharger au moins 5 images.');
    //     }
    // });

    // Fonction pour ajouter l'écouteur d'événements de prévisualisation de l'image
    function addImagePreviewListener(input) {
        input.addEventListener('change', function (e) {
            var reader = new FileReader();
            var square = input.closest('.ifwa7km');
            var dashed = square.querySelector('.aoru8m9');
            reader.onload = function (e) {
                var img = square.querySelector('img.img-edit-ad');
                if (!img) {
                    img = document.createElement('img');
                    img.classList.add('img-edit-ad');
                    square.insertBefore(img, square.firstChild);
                    square.querySelector('svg').remove(); // Retirer l'icône de remplacement de l'image

                    // Ajouter l'écouteur de clic à la nouvelle image
                    img.addEventListener('click', function () {
                        input.click();
                    });
                }
                img.src = e.target.result;
                // Supprimer la classe f63wz7 lors de l'upload
                dashed.classList.remove('f63wz7');
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }

    // Ajouter un gestionnaire d'événement à chaque image existante
    document.querySelectorAll('.ifwa7km').forEach(function (square) {
        var input = square.querySelector('input[type="file"]');
        var img = square.querySelector('img.img-edit-ad');

        if (img) {
            img.addEventListener('click', function () {
                input.click();
            });
        }

        if (input) {
            addImagePreviewListener(input);
        }
    });

    // Ajouter une nouvelle image au clic sur le bouton d'ajout
    document.querySelector('.add-another-collection-widget').addEventListener('click', function () {
        var newIndex = container.children.length;
        var newForm = prototype.replace(/__name__/g, newIndex);

        var div = document.createElement('div');
        div.className = 'ifwa7km bmwtyu7';
        div.innerHTML = `
            <div class="aoru8m9 i9cqrtb f63wz7">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style="display: block; height: 64px; width: 64px; cursor: pointer; fill: currentcolor;">
                    <path d="M27 3a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM8.89 19.04l-.1.08L3 24.92V25a2 2 0 0 0 1.85 2H18.1l-7.88-7.88a1 1 0 0 0-1.32-.08zm12.5-6-.1.08-7.13 7.13L20.92 27H27a2 2 0 0 0 2-1.85v-5.73l-6.3-6.3a1 1 0 0 0-1.31-.08zM27 5H5a2 2 0 0 0-2 2v15.08l4.38-4.37a3 3 0 0 1 4.1-.14l.14.14 1.13 1.13 7.13-7.13a3 3 0 0 1 4.1-.14l.14.14L29 16.59V7a2 2 0 0 0-1.85-2zM8 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                </svg>
                ${newForm}
                <div class="f42wz6">
                    <div class="_s63vo4">
                        <button type="button" class="delete-button-ad-img">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(div);

        var input = div.querySelector('input[type="file"]');
        addImagePreviewListener(input);

        // Attacher l'écouteur de clic à l'icône SVG pour ouvrir l'input de fichier
        div.querySelector('svg').addEventListener('click', function () {
            input.click();
        });

        // Attacher l'écouteur de clic au bouton de suppression
        div.querySelector('.delete-button-ad-img').addEventListener('click', function () {
            div.remove();
        });
    });

    // Supprimer une image uploadée
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.delete-button-ad-img')) {
            var button = e.target.closest('.delete-button-ad-img');
            var square = button.closest('.ifwa7km');

            // Supprimer la div parente complète
            square.remove();
        }
    });
});
