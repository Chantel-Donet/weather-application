//default load city = Johannesburg
let city = "Johannesburg";
callApiCity(city);
//date functions - get current date and last update time, display date and update time
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
  let currentDateDisplay = document.querySelector("#current-date");
  currentDateDisplay.innerHTML = `${currentDay}, ${currentDate} ${currentMonth} ${year}`;
}

let now = new Date();
getCurrentDate(now);

function displayLastUpdateTime(lastUpdateTimestamp) {
  lastUpdate = new Date(lastUpdateTimestamp);

  let hour = lastUpdate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = lastUpdate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  lastUpdate = `${hour}:${minutes}`;

  lastUpdateTimeDisplay = document.querySelector("#last-uptime-time");
  lastUpdateTimeDisplay.innerHTML = `Last updated at ${lastUpdate}`;
}
//search form actions - Search for a city and send to API
function searchCity(event) {
  event.preventDefault();
  let input = document.querySelector("#city-search-input");
  callApiCity(input.value);
}

let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", searchCity);

//location button actions - get location and sent to API
function locationSubmit(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(geoLocation);
}
function geoLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  callApiCoords(latitude, longitude);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", locationSubmit);

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

//api call return calculations and formatting - current weather update
function getResponse(response) {
  let city = response.data.name;
  let currentTempValue = response.data.main.temp;
  currentTempValue = Math.round(currentTempValue);
  let todayMaxTempValue = response.data.main.temp_max;
  todayMaxTempValue = Math.round(todayMaxTempValue);
  let todayMinTempValue = response.data.main.temp_min;
  todayMinTempValue = Math.round(todayMinTempValue);
  let todayWeatherDescription = response.data.weather[0].description;
  let todayHumidityValue = response.data.main.humidity;
  let todayWindSpeedValue = response.data.wind.speed;

  todayWindSpeedValue = todayWindSpeedValue * 3.6;
  todayWindSpeedValue = Math.round(todayWindSpeedValue);

  let lastUpdateTimestamp = response.data.dt;
  lastUpdateTimestamp = lastUpdateTimestamp * 1000;
  let weatherIconID = response.data.weather[0].icon;
  let celciusTemperatureValue = response.data.main.temp;
  let coordinates = response.data.coord;
  updateToday(
    city,
    currentTempValue,
    todayMinTempValue,
    todayMaxTempValue,
    todayHumidityValue,
    todayWindSpeedValue,
    todayWeatherDescription
  );
  displayLastUpdateTime(lastUpdateTimestamp);
  updateWeatherIcons(weatherIconID);
  callAPIOneCall(coordinates);
}
function updateToday(
  city,
  currentTempValue,
  todayMinTempValue,
  todayMaxTempValue,
  todayHumidityValue,
  todayWindSpeedValue,
  todayWeatherDescription
) {
  let currentCityDisplay = document.querySelector("#current-city");
  currentCityDisplay.innerHTML = `${city}`;
  let currentTempDisplay = document.querySelector(".temperature-value");
  currentTempDisplay.innerHTML = `${currentTempValue}`;
  let todayMaxTempDisplay = document.querySelector(".today-max");
  todayMaxTempDisplay.innerHTML = `${todayMaxTempValue}`;
  let todayMinTempDisplay = document.querySelector(".today-min");
  todayMinTempDisplay.innerHTML = `${todayMinTempValue}`;
  let todayWeatherDescriptionDisplay = document.querySelector(
    ".today-weather-description"
  );
  todayWeatherDescriptionDisplay.innerHTML = `${todayWeatherDescription}`;
  let todayHumidityDisplay = document.querySelector(".humidity");
  todayHumidityDisplay.innerHTML = `${todayHumidityValue}`;
  let todayWindSpeedDisplay = document.querySelector(".wind");
  todayWindSpeedDisplay.innerHTML = `${todayWindSpeedValue}`;
}
//weather api call - get one call - forecast data

function callAPIOneCall(coordinates) {
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;

  let apiKey = "063b1a129bc4b537be4d2fdc8b4f29c8";
  let unit = "metric";
  let forecastWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

  axios.get(forecastWeatherApi).then(displayForecast);
}

//forecast display

function displayForecast(forecastResponseData) {
  function formatDays(timestamp) {
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let forecastTimestamp = new Date(timestamp * 1000);
    let forecastDays = days[forecastTimestamp.getDay()];
    return forecastDays;
  }
  let forecastData = forecastResponseData.data.daily;

  console.log(forecastData);
  let forecastHTML = `<div class="row justify-content-center align-items-center gx-5">`;

  forecastData.forEach(function (forecast, index) {
    if (index > 0 && index < 6)
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
      
            <img src="icons/${
              forecast.weather[0].icon
            }.png" class="std-icon" /> <br />${formatDays(forecast.dt)}<br />
            ${Math.round(
              forecast.temp.max
            )}°C<img src="icons/low temperature.png" class="temp-icon" /><br />
            ${Math.round(forecast.temp.min)}°C
            <img src="icons/high temperature.png" class="temp-icon" />
          </div>
          `;
  });

  forecastHTML = forecastHTML + `</div>`;

  let forecastDisplay = document.querySelector("#weather-forecast");

  forecastDisplay.innerHTML = forecastHTML;
}
//Weather icon updates

function updateWeatherIcons(weatherIconID) {
  let weatherIconElement = document.querySelector(".current-weather-icon");
  if (weatherIconID === "50d" || weatherIconID === "50n") {
    weatherIconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${weatherIconID}@2x.png`
    );
  } else {
    weatherIconElement.setAttribute("src", `icons/${weatherIconID}.png`);
  }
}

//celcuis to fareheit conversion
function convertFarenheit(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let temperatureDisplay = document.querySelector(".temperature-value");
  let farenheitTemperatureValue = celciusTemperatureValue * 1.8 + 32;
  farenheitTemperatureValue = Math.round(farenheitTemperatureValue);
  temperatureDisplay.innerHTML = `${farenheitTemperatureValue}`;
}

let farenheitLink = document.querySelector(".farenheit");
farenheitLink.addEventListener("click", convertFarenheit);

let celciusTemperatureValue = null;
//farenheit to celcuis conversion
function convertCelcius(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let temperatureDisplay = document.querySelector(".temperature-value");
  celciusTemperatureValue = Math.round(celciusTemperatureValue);
  temperatureDisplay.innerHTML = celciusTemperatureValue;
}

let celciusLink = document.querySelector(".celcius");
celciusLink.addEventListener("click", convertCelcius);
