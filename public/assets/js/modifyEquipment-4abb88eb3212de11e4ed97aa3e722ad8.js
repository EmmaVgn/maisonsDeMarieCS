document.addEventListener('DOMContentLoaded', function () {
    initializeEquipmentModification();
});

document.addEventListener('turbo:load', function () {
    initializeEquipmentModification();
});

document.addEventListener('turbo:frame-load', function () {
    initializeEquipmentModification();
});

function initializeEquipmentModification() {
    const modifyButton = document.getElementById('modify-equipment-button');

    if (modifyButton) {
        modifyButton.addEventListener('click', function () {
            // Désactiver le bouton "Modifier"
            modifyButton.disabled = true;

            // Affiche les icônes de suppression et cache les images d'équipement
            document.querySelectorAll('.img-unchecked-delete-eq').forEach(function (img) {
                img.style.display = 'inline';
            });

            document.querySelectorAll('.edit-eq-svg').forEach(function (imageSvg) {
                imageSvg.style.display = 'none';
            });

            // Affiche le bouton "OK" s'il n'existe pas déjà
            if (!document.getElementById('ok-button')) {
                const newOkButton = document.createElement('button');
                newOkButton.innerText = 'OK';
                newOkButton.id = 'ok-button';
                newOkButton.classList.add('bv26nx5', 'c1tr46x1'); // Ajoutez des classes de style selon vos besoins
                modifyButton.parentElement.appendChild(newOkButton);

                newOkButton.addEventListener('click', function () {
                    // Réinitialise les éléments à leur état initial
                    document.querySelectorAll('.img-unchecked-delete-eq').forEach(function (img) {
                        img.style.display = 'none';
                    });

                    document.querySelectorAll('.img-checked-delete-eq').forEach(function (img) {
                        img.style.display = 'none';
                    });

                    document.querySelectorAll('.edit-eq-svg').forEach(function (imageSvg) {
                        imageSvg.style.display = 'inline';
                    });

                    // Supprime le bouton "OK"
                    newOkButton.remove();

                    // Réactiver le bouton "Modifier"
                    modifyButton.disabled = false;
                });
            }

            // Ajouter des événements de clic pour les images de suppression
            document.querySelectorAll('.img-unchecked-delete-eq').forEach(function (deleteImg) {
                deleteImg.addEventListener('click', function () {
                    let parentDiv = deleteImg.closest('.i12mny15');
                    if (parentDiv) {
                        let checkbox = parentDiv.querySelector('.delete-equipment-checkbox');
                        if (checkbox) {
                            checkbox.checked = true;

                            // Afficher l'icône cochée et masquer l'icône décochée
                            deleteImg.style.display = 'none';
                            let checkedDeleteImg = parentDiv.querySelector('.img-checked-delete-eq');
                            if (checkedDeleteImg) {
                                checkedDeleteImg.style.display = 'inline';
                            }
                        }
                    }
                });
            });

            // Ajouter des événements de clic pour les images cochées de suppression
            document.querySelectorAll('.img-checked-delete-eq').forEach(function (checkedDeleteImg) {
                checkedDeleteImg.addEventListener('click', function () {
                    let parentDiv = checkedDeleteImg.closest('.i12mny15');
                    if (parentDiv) {
                        let checkbox = parentDiv.querySelector('.delete-equipment-checkbox');
                        if (checkbox) {
                            checkbox.checked = false;

                            // Afficher l'icône décochée et masquer l'icône cochée
                            checkedDeleteImg.style.display = 'none';
                            let uncheckedDeleteImg = parentDiv.querySelector('.img-unchecked-delete-eq');
                            if (uncheckedDeleteImg) {
                                uncheckedDeleteImg.style.display = 'inline';
                            }
                        }
                    }
                });
            });
        });
    }
}