const apiKey = '718963b7af0803fcac4de0ea84c38141';

const weatherContainer = document.getElementById("weather");
const cityEl = document.getElementById("city");
const cityInput = document.getElementById('cityInput');
const toggleUnit = document.getElementById('toggleUnit');
const heroSection = document.getElementById('heroSection');

let units = 'imperial';
let temperatureSymbol = '°F';


function getWeatherImage(mainWeather) {
  const images = {
    Clear: "https://images.unsplash.com/photo-1501975558162-0be0b2d00d7b?auto=format&fit=crop&w=1600&q=80",
    Clouds: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1600&q=80",
    Rain: "https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&w=1600&q=80",
    Snow: "https://images.unsplash.com/photo-1601758123927-69a0b1fda233?auto=format&w=1600&q=80",
    Thunderstorm: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&w=1600&q=80",
    Drizzle: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=1600&q=80",
    Mist: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&w=1600&q=80"
  };
  return images[mainWeather] || images.Clear;
}

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert('Please enter a city name.');

  try {
    weatherContainer.innerHTML = '';
    cityEl.textContent = '';

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}&cnt=10`);
    const data = await response.json();
    if (data.cod !== "200") return alert(data.message);

    cityEl.textContent = `Hourly Weather for ${data.city.name}, ${data.city.country}`;
    heroSection.classList.add('hide');

    const mainWeather = data.list[0].weather[0].main;
    let weatherBg = document.getElementById('weatherBg');
    if (!weatherBg) {
      weatherBg = document.createElement('div');
      weatherBg.id = 'weatherBg';
      weatherBg.className = 'weather-bg';
      document.body.appendChild(weatherBg);
    }
    weatherBg.style.backgroundImage = `url('${getWeatherImage(mainWeather)}')`;

    data.list.forEach(item => {
      const temp = Math.round(item.main.temp);
      const desc = item.weather[0].description;
      const icon = item.weather[0].icon;
      const date = new Date(item.dt * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

      const div = document.createElement('div');
      div.className = 'weather_item';
      div.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
        <div>${temp}${temperatureSymbol}</div>
        <div>${desc}</div>
        <div>${date}</div>
      `;
      weatherContainer.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert('Error fetching weather data');
  }
}


toggleUnit.addEventListener('click', () => {
  units = units === 'imperial' ? 'metric' : 'imperial';
  temperatureSymbol = units === 'imperial' ? '°F' : '°C';
  fetchWeather();
});


document.getElementById('searchBtn').addEventListener('click', fetchWeather);
cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchWeather(); });
