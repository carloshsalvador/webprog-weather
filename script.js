/* 
TODOS: 
- localStorage
- View:
  - Detail-Ansicht
  - Zwischen Ansichten Tabelle vs. Kacheln wechseln
  - Fahrenheit <-> Celsius
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

async function doSearch() {
  const location_name = search_input.value.trim();
  if (location_name.length === 0) return;

  // TODO: doppelte Orte vermeiden?
  const location = await searchLocation(location_name);
  if (location === null) {
    alert('Ort nicht gefunden');
    return;
  }

  // TODO: Wetter-Daten für location laden
  const { temp, weathercode } = await loadWeatherData(
    location.latitude,
    location.longitude
  );

  const condition = weatherCodes.get(weathercode);
  // TODO: image korrekt laden
  // TODO: doppelte Orte vermeiden?
  const image =
    'https://cdn.glitch.me/c569e324-22c3-491c-ab27-94a3498d6207%2Fsun-cloudy-line.png?v=1634724998045';
  addLocation(location.name, temp, condition, image);
  search_input.value = '';
}

async function doAddFromList() {
  const location_index = selected_location.value;
  const location = locations[location_index];

  const { temp, weathercode } = await loadWeatherData(
    location.latitude,
    location.longitude
  );

  // TODO: image korrekt laden
  // TODO: doppelte Orte vermeiden?
  const condition = weatherCodes.get(weathercode);
  const image =
    'https://cdn.glitch.me/c569e324-22c3-491c-ab27-94a3498d6207%2Fsun-cloudy-line.png?v=1634724998045';
  addLocation(location.name, temp, condition, image);
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
weatherCodes.set(0, 'klar');
weatherCodes.set(1, 'überwiegend klar');
weatherCodes.set(2, 'teilweise bewölkt');
weatherCodes.set(3, 'zunehmend bewölkt');
weatherCodes.set(45, 'neblig');
weatherCodes.set(48, 'neblig mit Reif');
weatherCodes.set(51, 'leichter Sprühregen');
weatherCodes.set(53, 'Sprühregen');
weatherCodes.set(55, 'starker Sprühregen');
weatherCodes.set(56, 'leichter gefrierender Nieselregen');
weatherCodes.set(57, 'gefrierender Nieselregen');
weatherCodes.set(61, 'leichter Regen');
weatherCodes.set(63, 'Regen');
weatherCodes.set(65, 'starker Regen');
weatherCodes.set(66, 'leichter gefrierender Regen');
weatherCodes.set(67, 'gefrierender Regen');
weatherCodes.set(71, 'leichter Schneefall');
weatherCodes.set(73, 'Schneefall');
weatherCodes.set(75, 'starker Schneefall');
weatherCodes.set(77, 'Schneehagel');
weatherCodes.set(80, 'leichte Regenschauer');
weatherCodes.set(81, 'Regenschauer');
weatherCodes.set(82, 'starker Regenschauer');
weatherCodes.set(85, 'leichte Schneeschauer');
weatherCodes.set(86, 'Schneeschauer');
weatherCodes.set(95, 'leichtes Gewitter');
weatherCodes.set(96, 'leichtes Gewitter mit Hagel');
weatherCodes.set(99, 'Gewitter mit Hagel');

function setupLocationList() {
  locations.forEach((location, index) => {
    const option = document.createElement('option');
    option.innerHTML = location.name;
    option.setAttribute('value', index);
    selected_location.appendChild(option);
  });
}

setupLocationList();
