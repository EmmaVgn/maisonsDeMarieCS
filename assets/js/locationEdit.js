"use strict";

import { APILoader } from '../vendor/googlemaps/extended-component-library';

const CONFIGURATION = {
    "ctaTitle": "Checkout",
    "mapOptions": {
        "center": {
            "lat": window.lat,
            "lng": window.lng
        },
        "fullscreenControl": false,
        "mapTypeControl": false,
        "streetViewControl": false,
        "zoom": 13,
        "zoomControl": true,
        "maxZoom": 22,
        "mapId": "bc0a6db69e0dbdea"
    },
    "mapsApiKey": window.google_api_key,
    "capabilities": {
        "addressAutocompleteControl": true,
        "mapDisplayControl": true,
        "ctaControl": false
    }
};

const location = {
    lat: window.lat,
    lng: window.lng
};

const SHORT_NAME_ADDRESS_COMPONENT_TYPES = new Set(['street_number', 'administrative_area_level_1', 'postal_code']);

const ADDRESS_COMPONENT_TYPES_IN_FORM = [
    'location',
    'locality',
    'administrative_area_level_1',
    'postal_code',
    'country',
];

function getFormInputElement(componentType) {
    return document.getElementById(`${componentType}-input`);
}

function fillInAddress(place) {
    function getComponentName(componentType) {
        for (const component of place.address_components || []) {
            if (component.types[0] === componentType) {
                return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType) ? component.short_name : component.long_name;
            }
        }
        return '';
    }

    function getComponentText(componentType) {
        return (componentType === 'location') ? `${getComponentName('street_number')} ${getComponentName('route')}` : getComponentName(componentType);
    }

    for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
        getFormInputElement(componentType).value = getComponentText(componentType);
    }
}

function renderAddress(place) {
    const mapEl = document.querySelector('gmp-map');
    const markerEl = document.querySelector('gmp-advanced-marker');

    if (place.geometry && place.geometry.location) {
        mapEl.center = place.geometry.location;
        markerEl.position = place.geometry.location;

        // Set hidden input values for lat and lng
        document.getElementById('lat').value = place.geometry.location.lat();
        document.getElementById('lng').value = place.geometry.location.lng();
    } else {
        markerEl.position = null;
    }
}

async function initMap() {
    const { Autocomplete } = await APILoader.importLibrary('places');

    const mapOptions = CONFIGURATION.mapOptions;
    mapOptions.mapId = mapOptions.mapId || 'DEMO_MAP_ID';
    mapOptions.center = mapOptions.center || { lat: 48.8588897, lng: 2.320041 };

    await customElements.whenDefined('gmp-map');
    document.querySelector('gmp-map').innerMap.setOptions(mapOptions);
    document.querySelector('gmp-advanced-marker').position = location;

    const autocomplete = new Autocomplete(getFormInputElement('location'), {
        fields: ['address_components', 'geometry', 'name'],
        types: ['address']
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert(`No details available for input: '${place.name}'`);
            return;
        }
        renderAddress(place);
        fillInAddress(place);

        document.getElementById('additional-fields').style.visibility = 'visible';
    });

    document.getElementById('additional-fields').style.visibility = 'visible';
}

async function resetMap() {
    const { Autocomplete } = await APILoader.importLibrary('places');

    // Réinitialisation de la carte
    const mapEl = document.querySelector('gmp-map');
    const markerEl = document.querySelector('gmp-advanced-marker');

    // Réinitialisation des options de carte avec la nouvelle position
    const mapOptions = CONFIGURATION.mapOptions;
    mapOptions.center = { lat: parseFloat(document.getElementById('lat').value), lng: parseFloat(document.getElementById('lng').value) };
    mapEl.innerMap.setOptions(mapOptions);

    // Réinitialisation du marker
    markerEl.position = mapOptions.center;

    // Réinitialisation de l'autocomplete
    const autocomplete = new Autocomplete(getFormInputElement('location'), {
        fields: ['address_components', 'geometry', 'name'],
        types: ['address']
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert(`No details available for input: '${place.name}'`);
            return;
        }
        renderAddress(place);
        fillInAddress(place);

        document.getElementById('additional-fields').style.visibility = 'visible';
    });

    document.getElementById('additional-fields').style.visibility = 'visible';
}


function handleTurboEvents() {
    // Réinitialiser la carte sur le chargement de la page ou du frame
    document.addEventListener('turbo:load', () => {
        resetMap();
    });

    // Réinitialiser la carte après la soumission du formulaire
    document.addEventListener('turbo:submit-end', () => {
        resetMap();
    });

    // Vous pouvez également ajouter d'autres événements Turbo si nécessaire
    document.addEventListener('turbo:frame-load', () => {
        resetMap();
    });
}

// Initialiser la carte et les champs d'adresse lors du chargement initial de la page
initMap();

// Gérer les événements Turbo
handleTurboEvents();
