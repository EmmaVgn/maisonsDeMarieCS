document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    var container = document.querySelector('.image-input-content');
    var submitButton = form.querySelector('button[type="submit"]');
    var index = container.children.length;
    var element = document.getElementById('prototype-data');
    if (element) {
        var prototypeElement  = element.getAttribute('data-prototype');
        var prototype = JSON.parse(prototypeElement);
    }

    // Validation du nombre d'images
    submitButton.addEventListener('click', function (e) {
        var imageInputs = container.querySelectorAll('input[type="file"]');
        var validImages = Array.from(imageInputs).filter(input => input.files.length > 0);

        if (validImages.length < 5) {
            e.preventDefault();
            alert('Vous devez télécharger au moins 5 images.');
        }
    });

    // Ajouter un gestionnaire d'événement à chaque carré
    document.querySelectorAll('.image-square').forEach(function (square) {
        square.addEventListener('click', function () {
            var input = square.querySelector('input[type="file"]');
            input.click();
        });

        var input = square.querySelector('input[type="file"]');
        addImagePreviewListener(input);
    });

    // Fonction pour ajouter l'écouteur d'événements de prévisualisation de l'image
    function addImagePreviewListener(input) {
        input.addEventListener('change', function (e) {
            var reader = new FileReader();
            var square = input.closest('.image-square');
            reader.onload = function (e) {
                var img = square.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    square.appendChild(img);
                }
                img.src = e.target.result;
                square.classList.add('filled');
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }

    // Ajouter une nouvelle div de class image-square
    document.querySelector('.add-another-collection-widget').addEventListener('click', function () {
        var newIndex = container.children.length;
        var newForm = prototype.replace(/ad_step8_form_images___name__/g, 'ad_step8_form_images_' + newIndex + '_imageFile_file');

        var div = document.createElement('div');
        div.className = 'image-square half-width';
        div.innerHTML = newForm + '<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style="display: block; height: 32px; width: 32px; fill: currentcolor;"><path d="M27 3a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM8.89 19.04l-.1.08L3 24.92V25a2 2 0 0 0 1.85 2H18.1l-7.88-7.88a1 1 0 0 0-1.32-.08zm12.5-6-.1.08-7.13 7.13L20.92 27H27a2 2 0 0 0 2-1.85v-5.73l-6.3-6.3a1 1 0 0 0-1.31-.08zM27 5H5a2 2 0 0 0-2 2v15.08l4.38-4.37a3 3 0 0 1 4.1-.14l.14.14 1.13 1.13 7.13-7.13a3 3 0 0 1 4.1-.14l.14.14L29 16.59V7a2 2 0 0 0-1.85-2zM8 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path></svg></span>';

        container.appendChild(div);

        var input = div.querySelector('input[type="file"]');
        addImagePreviewListener(input);

        div.addEventListener('click', function () {
            input.click();
        });
    });

    // Supprimer l'image uploadée
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.delete-button-ad-img')) {
            var button = e.target.closest('.delete-button-ad-img');
            var square = button.closest('.image-square');
            var input = square.querySelector('input[type="file"]');

            if (input) {
                input.value = '';
            }

            var img = square.querySelector('img');
            if (img) {
                img.remove();
            }

            square.classList.remove('filled');
        }
    });
});
