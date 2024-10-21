document.addEventListener('turbo:load', function () {
    // Initialisation des éléments interactifs lorsque la page est chargée par Turbo
    initEquipmentSelection();
});

document.addEventListener('turbo:frame-load', function (event) {
    // Vérifiez que l'élément chargé est bien le frame ou l'élément que nous voulons
    if (event.target.id === 'edit-equipment-detail-frame') {
        initEquipmentSelection();
    }
});

function initEquipmentSelection() {
    const criteriaItems = document.querySelectorAll('.g1befea9 input[type="radio"]');
    const equipmentContainers = document.querySelectorAll('.a16fjqk4');
    const labels = document.querySelectorAll('.g1befea9 .c12tvzjc.c1vj3tio');

    // Masquer tous les conteneurs d'équipement par défaut
    equipmentContainers.forEach(container => {
        container.style.display = 'none';
    });

    criteriaItems.forEach(item => {
        item.addEventListener('change', function () {
            const criteriaId = this.value;

            // Masque tous les champs d'équipement et affiche uniquement celui sélectionné
            equipmentContainers.forEach(container => container.style.display = 'none');

            const equipmentContainer = document.getElementById('equipment_' + criteriaId);
            if (equipmentContainer) {
                equipmentContainer.style.display = 'flex';
            }

            labels.forEach(label => {
                label.classList.remove('cfmmg6r'); // Retirer la classe de tous les labels
            });
            this.closest('.g1befea9').querySelector('.c12tvzjc.c1vj3tio').classList.add('cfmmg6r');
        });

        // Si un critère est déjà coché (par ex: après une soumission échouée), afficher ses équipements
        if (item.checked) {
            const criteriaId = item.value;
            const equipmentContainer = document.getElementById('equipment_' + criteriaId);
            if (equipmentContainer) {
                equipmentContainer.style.display = 'flex';
            }
            this.closest('.g1befea9').querySelector('.c12tvzjc.c1vj3tio').classList.add('cfmmg6r');
        }
    });
}

// Appel initial pour gérer les cas où Turbo n'est pas impliqué
initEquipmentSelection();