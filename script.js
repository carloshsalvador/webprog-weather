/* 
TODOS: 
- localStorage
- geonames API o.a. für Orte (anstatt my-json-server)
- Detail-Ansicht
- Fahrenheit <-> Celsius
- Zwischen Ansichten Tabelle vs. Kacheln wechseln
- use strict?
- trim input, avoid duplicates, remove element, usw.
*/
const add_btn = document.getElementById('add_btn');
const search_btn = document.getElementById('search_btn');
const search_input = document.getElementById('search_input');
const selected_location = document.getElementById(
  'selected_location'
);
const weather_list = document.getElementById('weather_list');

const weatherURL = `https://api.open-meteo.com/v1/forecast?current_weather=true`;
const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=`;

function addLocation(name, temp, condition, image) {
  const new_location = document.createElement('div');
  new_location.classList.add('weather_location');
  new_location.innerHTML = `<div class="location">${name}</div>
    <div class="weather_info">
      <span>
        <span class="temperature">${temp} Grad</span>
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

async function doSearch() {
  const location_name = search_input.value.trim();
  if (location_name.length === 0) return;

  // TODO: Ort nur hinzufügen, wenn Daten gefunden wurden
  // TODO: Fehlermeldung falls keine Daten gefunden wurden
  // TODO: doppelte Orte vermeiden?
  const location = await searchLocation(location_name);
  // TODO: Wetter-Daten für location laden
  const temp = await loadWeatherData(
    location.latitude,
    location.longitude
  );

  // TODO: condition und image korrekt laden
  // TODO: doppelte Orte vermeiden?
  const condition = 'heiter';
  const image =
    'https://cdn.glitch.me/c569e324-22c3-491c-ab27-94a3498d6207%2Fsun-cloudy-line.png?v=1634724998045';
  addLocation(location.name, temp, condition, image);
  search_input.value = '';
}

async function doAddFromList() {
  const location_index = selected_location.value;
  const location = locations[location_index];

  const temp = await loadWeatherData(
    location.latitude,
    location.longitude
  );

  // TODO: condition und image korrekt laden
  // TODO: doppelte Orte vermeiden?
  const condition = 'heiter';
  const image =
    'https://cdn.glitch.me/c569e324-22c3-491c-ab27-94a3498d6207%2Fsun-cloudy-line.png?v=1634724998045';
  addLocation(location.name, temp, condition, image);
}

async function loadWeatherData(latitude, longitude) {
  const url = `${weatherURL}&latitude=${latitude}&longitude=${longitude}`;
  const data = await fetch(url);
  const json = await data.json();
  return Math.trunc(json.current_weather.temperature);
}

async function searchLocation(location) {
  const url = `${geoURL}${location}`;
  const data = await fetch(url);
  const json = await data.json();
  const { name, latitude, longitude } = json.results[0];
  return { name, latitude, longitude };
}

search_btn.addEventListener('click', doSearch);
add_btn.addEventListener('click', doAddFromList);

let locations = [
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

function setupLocationList() {
  locations.forEach((location, index) => {
    const option = document.createElement('option');
    option.innerHTML = location.name;
    option.setAttribute('value', index);
    selected_location.appendChild(option);
  });
}

setupLocationList();
