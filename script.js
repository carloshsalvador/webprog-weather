/* 
TODOS: 
- localStorage:
  - Ort entfernen
- doppelte Orte vermeiden (storage, view, Beispiel-Orte)?
- View:
  - Zwischen Ansichten Tabelle vs. Kacheln wechseln
  - Detail-Ansicht
  - Kachel entsprechend Temperatur einfärben
- Suche des Ortes durch Enter-Taste auslösen
- use strict?
*/
const add_btn = document.getElementById('add_btn');
const search_btn = document.getElementById('search_btn');
const search_input = document.getElementById('search_input');
const selected_location = document.getElementById(
  'selected_location'
);
const display_radio = document.querySelectorAll(
  'input[name="display_mode"]'
);
const weather_list = document.getElementById('weather_list');

const weatherURL = `https://api.open-meteo.com/v1/forecast?current_weather=true`;
const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=`;

let locationsList = [];

function addLocation(name, temp, condition, image) {
  const new_location = document.createElement('div');
  new_location.classList.add('weather_location');
  new_location.innerHTML = `<div class="location">${name}</div>
    <div class="weather_info">
      <span>
        <span class="temperature">${temp}°</span>
        <span class="condition">${condition}</span>
      </span>
      <img
        class="weather_img"
        src="${image}"
        alt="${condition}"
      />
    </div>
  `;
  weather_list.appendChild(new_location);
}

function saveLocations(loc) {
  locationsList.push(loc);
  localStorage.setItem('locations', JSON.stringify(locationsList));
}

function loadLocations() {
  const tmpLocations = localStorage.getItem('locations');
  if (tmpLocations === null) return;
  locationsList = JSON.parse(tmpLocations);
}

async function doSearch() {
  const location_name = search_input.value.trim();
  if (location_name.length === 0) return;

  const location = await searchLocation(location_name);
  if (location === null) {
    alert('Ort nicht gefunden');
    return;
  }

  const { temp, weathercode } = await loadWeatherData(
    location.latitude,
    location.longitude
  );

  const { condition, icon } = weatherCodes.get(weathercode);
  const image = `/img/weather/${icon}.svg`;
  addLocation(location.name, temp, condition, image);
  const { name, latitude, longitude } = location;
  saveLocations({ name, latitude, longitude });
  search_input.value = '';
}

async function doAddFromList() {
  const location_index = selected_location.value;
  const location = locations[location_index];

  const { temp, weathercode } = await loadWeatherData(
    location.latitude,
    location.longitude
  );

  const { condition, icon } = weatherCodes.get(weathercode);
  const image = `/img/weather/${icon}.svg`;
  addLocation(location.name, temp, condition, image);
  const { name, latitude, longitude } = location;
  saveLocations({ name, latitude, longitude });
}

async function loadWeatherData(latitude, longitude) {
  const url = `${weatherURL}&latitude=${latitude}&longitude=${longitude}`;
  const data = await fetch(url);
  const json = await data.json();
  const temp = Math.trunc(json.current_weather.temperature);
  const weathercode = json.current_weather.weathercode;
  return { temp, weathercode };
}

async function searchLocation(location) {
  const url = `${geoURL}${location}`;
  const data = await fetch(url);
  const json = await data.json();
  if (!json.results) return null;
  const { name, latitude, longitude } = json.results[0];
  return { name, latitude, longitude };
}

search_btn.addEventListener('click', doSearch);
add_btn.addEventListener('click', doAddFromList);
for (const radioButton of display_radio) {
  radioButton.addEventListener('change', () => {
    if (radioButton.value === 'table') {
      alert('Noch nicht implementiert');
      radioButton.checked = false;
    }
  });
}

const locations = [
  {
    name: 'Berlin',
    latitude: 52.52,
    longitude: 13.41,
  },
  {
    name: 'Basel',
    latitude: 47.55,
    longitude: 7.58,
  },
  {
    name: 'Barcelona',
    latitude: 41.4,
    longitude: 2.16,
  },
  {
    name: 'London',
    latitude: 51.5,
    longitude: -0.11,
  },
  {
    name: 'Paris',
    latitude: 48.85,
    longitude: 2.35,
  },
  {
    name: 'Hamburg',
    latitude: 53.55,
    longitude: 9.99,
  },
  {
    name: 'Kopenhagen',
    latitude: 55.67,
    longitude: 12.57,
  },
  {
    name: 'Rom',
    latitude: 41.88,
    longitude: 12.48,
  },
  {
    name: 'New York',
    latitude: 40.71,
    longitude: -74,
  },
];

const weatherCodes = new Map();
weatherCodes.set(0, { condition: 'klar', icon: 'sun' });
weatherCodes.set(1, {
  condition: 'überwiegend klar',
  icon: 'sun-foggy',
});
weatherCodes.set(2, {
  condition: 'teilweise bewölkt',
  icon: 'sun-cloudy',
});
weatherCodes.set(3, {
  condition: 'zunehmend bewölkt',
  icon: 'cloudy',
});
weatherCodes.set(45, { condition: 'neblig', icon: 'foggy' });
weatherCodes.set(48, { condition: 'neblig mit Reif', icon: 'foggy' });
weatherCodes.set(51, {
  condition: 'leichter Sprühregen',
  icon: 'rainy',
});
weatherCodes.set(53, { condition: 'Sprühregen', icon: 'drizzle' });
weatherCodes.set(55, {
  condition: 'starker Sprühregen',
  icon: 'drizzle',
});
weatherCodes.set(56, {
  condition: 'leichter gefrierender Nieselregen',
  icon: 'hail',
});
weatherCodes.set(57, {
  condition: 'gefrierender Nieselregen',
  icon: 'hail',
});
weatherCodes.set(61, { condition: 'leichter Regen', icon: 'rainy' });
weatherCodes.set(63, { condition: 'Regen', icon: 'drizzle' });
weatherCodes.set(65, {
  condition: 'starker Regen',
  icon: 'heavy-showers',
});
weatherCodes.set(66, {
  condition: 'leichter gefrierender Regen',
  icon: '',
});
weatherCodes.set(67, { condition: 'gefrierender Regen', icon: '' });
weatherCodes.set(71, {
  condition: 'leichter Schneefall',
  icon: 'snowy',
});
weatherCodes.set(73, { condition: 'Schneefall', icon: 'snowy' });
weatherCodes.set(75, {
  condition: 'starker Schneefall',
  icon: 'snowy',
});
weatherCodes.set(77, { condition: 'Schneehagel', icon: 'snowy' });
weatherCodes.set(80, {
  condition: 'leichte Regenschauer',
  icon: 'rainy',
});
weatherCodes.set(81, { condition: 'Regenschauer', icon: 'showers' });
weatherCodes.set(82, {
  condition: 'starker Regenschauer',
  icon: 'heavy-showers',
});
weatherCodes.set(85, {
  condition: 'leichte Schneeschauer',
  icon: 'snowy',
});
weatherCodes.set(86, { condition: 'Schneeschauer', icon: 'snowy' });
weatherCodes.set(95, {
  condition: 'leichtes Gewitter',
  icon: 'thunderstorms',
});
weatherCodes.set(96, {
  condition: 'leichtes Gewitter mit Hagel',
  icon: 'thunderstorms',
});
weatherCodes.set(99, {
  condition: 'Gewitter mit Hagel',
  icon: 'thunderstorms',
});

function setupLocationList() {
  locations.forEach((location, index) => {
    const option = document.createElement('option');
    option.innerHTML = location.name;
    option.setAttribute('value', index);
    selected_location.appendChild(option);
  });
}

function setupLocationView() {
  locationsList.forEach(async (location) => {
    const { temp, weathercode } = await loadWeatherData(
      location.latitude,
      location.longitude
    );

    const { condition, icon } = weatherCodes.get(weathercode);
    const image = `/img/weather/${icon}.svg`;
    addLocation(location.name, temp, condition, image);
  });
}

setupLocationList();
loadLocations();
setupLocationView();
