const API_KEY = "33015401ef71e3aaf4ac578e3564fd3f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});

// Initialize with a default city
window.addEventListener("load", () => {
  getWeatherByCity("London");
});

// Main function to get weather data
async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name");
    return;
  }

  await getWeatherByCity(city);
}

// Function to fetch weather data by city name
async function getWeatherByCity(city) {
  showLoading();

  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "City not found. Please check the spelling and try again."
        );
      } else {
        throw new Error(
          "Failed to fetch weather data. Please try again later."
        );
      }
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

// Function to display weather data
function displayWeather(data) {
  const { name, main, weather, wind, sys } = data;
  const { temp, feels_like, humidity, pressure } = main;
  const { description, icon } = weather[0];
  const { speed } = wind;

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const weatherHTML = `
    <div class="current-weather">
      <h2 class="city-name">${name}, ${sys.country}</h2>
      <p class="date">${date}</p>
      <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <div class="temperature">${Math.round(temp)}°C</div>
      <div class="description">${description}</div>
      <div class="feels-like">Feels like: ${Math.round(feels_like)}°C</div>
    </div>

    <div class="weather-details">
      <div class="detail-card">
        <div class="detail-icon">💧</div>
        <div class="detail-value">${humidity}</div>
        <div class="detail-label">Humidity</div>
      </div>

      <div class="detail-card">
        <div class="detail-icon">💨</div>
        <div class="detail-value">${speed}</div>
        <div class="detail-label">Wind Speed</div>
      </div>

      <div class="detail-card">
        <div class="detail-icon">🌡️</div>
        <div class="detail-value">${pressure}</div>
        <div class="detail-label">Pressure</div>
      </div>

      <div class="detail-card">
        <div class="detail-icon">👁️</div>
        <div class="detail-value">${getVisibility(data.visibility)}</div>
        <div class="detail-label">Visibility</div>
      </div>
    </div>
  `;

  weatherInfo.innerHTML = weatherHTML;
}

// Helper function to format visibility
function getVisibility(visibility) {
  if (visibility >= 10000) return "Excellent";
  if (visibility >= 5000) return "Good";
  if (visibility >= 2000) return "Moderate";
  return "Poor";
}

// Function to show loading state
function showLoading() {
  weatherInfo.innerHTML = '<div class="loading">Loading weather data...</div>';
}

// Function to show error message
function showError(message) {
  weatherInfo.innerHTML = `<div class="error">${message}</div>`;
}
