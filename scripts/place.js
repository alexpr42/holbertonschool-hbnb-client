function getPlaceIdFromURL() {
   const params = new URLSearchParams(window.location.search);
   return params.get('placeId');
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
            alert('Failed to load place details.');
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetailsSection = document.getElementById('place-details');
    placeDetailsSection.innerHTML = '';  // Clear existing content

    // Create elements to display place details
    const nameElement = document.createElement('h1');
    nameElement.textContent = place.name;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = place.description;

    const locationElement = document.createElement('p');
    locationElement.textContent = `Location: ${place.location}`;

    // Create an image gallery if there are images
    if (place.images && place.images.length > 0) {
        const imageGallery = document.createElement('div');
        imageGallery.classList.add('image-gallery');

        place.images.forEach(imgUrl => {
            const imgElement = document.createElement('img');
            imgElement.src = imgUrl;
            imgElement.alt = `${place.name} image`;
            imageGallery.appendChild(imgElement);
        });

        placeDetailsSection.appendChild(imageGallery);
    }

    // Append the created elements to the place details section
    placeDetailsSection.appendChild(nameElement);
    placeDetailsSection.appendChild(descriptionElement);
    placeDetailsSection.appendChild(locationElement);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkAuthentication() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');
    const placeId = getPlaceIdFromURL();

    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';
        fetchPlaceDetails(token, placeId);
    }
}