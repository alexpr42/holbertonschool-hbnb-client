document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('username-id').value;
          const password = document.getElementById('password-id').value;

          try {
              const response = await fetch('http://127.0.0.1:5000/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password })
              });

              if (response.ok) {
                  const data = await response.json();
                  document.cookie = `token=${data.access_token}; path=/`;
                  window.location.href = 'index.html';
              } else {
                  alert('Login failed: ' + response.statusText);
              }
          } catch (error) {
              console.error('Error:', error);
              alert('An error occurred. Please try again.');
          }
      });
  }

  checkAuthentication();
});

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (!token) {
      loginLink.style.display = 'block';
  } else {
      loginLink.style.display = 'none';
      fetchPlaces(token);
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// async function fetchPlaces(token) {
//   try {
//       const response = await fetch('http://127.0.0.1:5000/places', {
//           method: 'GET',
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//           }
//       });

//       if (response.ok) {
//           const places = await response.json();
//           displayPlaces(places);
//       } else {
//           console.error('Error:', response.statusText);
//           alert('Failed to load places: ' + response.statusText);
//       }
//   } catch (error) {
//       console.error('Error:', error);
//   }
// }

// function displayPlaces(places, country) {
//   const pList = document.querySelector('.row');
//   pList.innerHTML = '';

//   places.forEach(place => {
//       const pElement = document.createElement('li');
//       pElement.classList.add('place-card');
//       pElement.innerHTML = `
//           <div class="place">
//               <h2 class="place-name">${place.description}</h2>
//               <img src="404image" alt="image"/>
//               <p id="price">Price per night: ${place.price_per_night}</p>
//               <p id="location">Location: ${place.city_name}, ${place.country_name}</p>
//               <a href="place.html"><button class="details-button">View Details</button></a>
//           </div>
//       `;
//       pList.appendChild(pElement);
//   });
// }

document.addEventListener('DOMContentLoaded', () => {
    const countriesselect = document.getElementById('country-filter');
    const placesContaiter = document.getElementById('row');
    
    let countries = [];
    let places = [];

    const fetchCountries = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/countries');
            const data = await response.json();
            console.log(data);
            countries = data;
            console.log(countries);
            populateCountriesDropdown();
        } catch (error) {
            console.error('Unable to fetch countries', error);
        }
    };

    const fetchPlaces = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/places');
            const data = await response.json();
            places = data;
            console.log(places)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const populateCountriesDropdown = () => {
        const allOptions = document.createElement('option');
        allOptions.value = 'all';
        allOptions.textContent = 'All'; 
        countriesselect.appendChild(allOptions);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            console.log(option.textContent);
            countriesselect.appendChild(option);
        });
    };
    const displayPlaces = (selected) => {
        placesContaiter.innerHTML = '';
        
        const filteredPlaces = selected === 'all' ? places : places.filter(place => place.country_code === selected);

        filteredPlaces.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.innerHTML = `
                <div class="place">
                    <h2 class="place-name">${place.description}</h2>
                    <img src="${place.image_url || '404image'}" alt="image"/>
                    <p id="price">Price per night: ${place.price_per_night}</p>
                    <p id="location">Location: ${place.city_name}, ${place.country_name}</p>
                    <a href="place.html"><button class="details-button">View Details</button></a>
                </div>
            `;
            placesContaiter.appendChild(placeElement);
        });
    }

    countriesselect.addEventListener('change', (event) => {
        const selected = event.target.value;
        displayPlaces(selected);
    });

    fetchCountries();
    fetchPlaces();
});


