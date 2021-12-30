//date functions - get current date and time to display
function getCurrentDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[now.getDay()];
  let currentDate = now.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentMonth = months[now.getMonth()];
  let year = now.getFullYear();
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentDateDisplay = document.querySelector("#current-date-time");
  currentDateDisplay.innerHTML = `${currentDay}, ${currentDate} ${currentMonth} ${year}, ${hour}:${minutes}`;
}

let now = new Date();
getCurrentDate(now);

//search form actions - Search for a city and send to API
function searchCity(event) {
  event.preventDefault();
  let input = document.querySelector("#city-search-input");
  callApiCity(input.value);
}

let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", searchCity);

/*
function showWeather(event) {
  let celciusTemperature = document.querySelector(".degrees-value");
  let farenheitTemperatureValue = 20 * 1.8 + 32;
  celciusTemperature.innerHTML = `${farenheitTemperatureValue}`;
}


let farenheit = document.querySelector(".farenheit");
farenheit.addEventListener("click", showWeather);
console.log(document.querySelector(".farenheit")); 
*/

//api call return calculations and formatting - current weather update
function getResponse(response) {
  console.log(response);
  let city = response.data.name;
  let currentTempValue = response.data.main.temp;
  currentTempValue = Math.round(currentTempValue);
  let todayMaxTempValue = response.data.main.temp_max;
  todayMaxTempValue = Math.round(todayMaxTempValue);
  let todayMinTempValue = response.data.main.temp_min;
  todayMinTempValue = Math.round(todayMinTempValue);
  let todayHumidityValue = response.data.main.humidity;
  console.log(todayHumidityValue);

  let todayWindSpeedValue = response.data.wind.speed;
  todayWindSpeedValue = todayWindSpeedValue * 3.6;

  todayWindSpeedValue = Math.round(todayWindSpeedValue);
  console.log(todayWindSpeedValue);
  updateToday(
    city,
    currentTempValue,
    todayMinTempValue,
    todayMaxTempValue,
    todayHumidityValue,
    todayWindSpeedValue
  );
}
function updateToday(
  city,
  currentTempValue,
  todayMinTempValue,
  todayMaxTempValue,
  todayHumidityValue,
  todayWindSpeedValue
) {
  let currentCityDisplay = document.querySelector("#current-city");
  currentCityDisplay.innerHTML = `${city}`;
  let currentTempDisplay = document.querySelector(".degrees-value");
  currentTempDisplay.innerHTML = `${currentTempValue}`;
  let todayMaxTempDisplay = document.querySelector(".today-max");
  todayMaxTempDisplay.innerHTML = `${todayMaxTempValue}`;
  let todayMinTempDisplay = document.querySelector(".today-min");
  todayMinTempDisplay.innerHTML = `${todayMinTempValue}`;
  let todayHumidityDisplay = document.querySelector(".humidity");
  todayHumidityDisplay.innerHTML = `${todayHumidityValue}`;
  let todayWindSpeedDisplay = document.querySelector(".wind");
  todayWindSpeedDisplay = `${todayWindSpeedValue}`;
}

//Weather api calls - get current Weather

function callApiCity(city) {
  let apiKey = "063b1a129bc4b537be4d2fdc8b4f29c8";
  let unit = "metric";
  let weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(weatherApi).then(getResponse);
}
function callApiCoords(latitude, longitude) {
  let apiKey = "063b1a129bc4b537be4d2fdc8b4f29c8";
  let unit = "metric";
  let weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

  axios.get(weatherApi).then(getResponse);
}

//location button actions - get location and sent to API
function locationSubmit(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(geoLocation);
}
function geoLocation(position) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  callApiCoords(latitude, longitude);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", locationSubmit);
