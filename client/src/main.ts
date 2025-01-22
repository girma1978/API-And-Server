import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: cityName }), // Ensure correct payload format
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await response.json();
    console.log('weatherData: ', weatherData); // Log to inspect the data

    if (weatherData && weatherData.current && weatherData.forecast) {
      renderCurrentWeather(weatherData.current); // Use the current weather data
      renderForecast(weatherData.forecast); // Use the forecast data
    } else {
      console.error('Invalid weather data or no forecast available');
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

const fetchSearchHistory = async () => {
  try {
    const response = await fetch('/api/weather/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching search history:', error);
    return []; // Return empty array in case of error
  }
};

const deleteCityFromHistory = async (id: string) => {
  try {
    await fetch(`/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting city from history:', error);
  }
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  const { temperature, humidity, description, icon } = currentWeather;

  // Assuming temperature is in Celsius, converting to Fahrenheit for display
  const tempF = (temperature * 9) / 5 + 32;

  heading.textContent = `Current Weather: ${description}`;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', description);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF.toFixed(1)}°F`;
  windEl.textContent = `Wind: N/A`;  // Wind data is not available in current data
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (todayContainer) {
    todayContainer.innerHTML = ''; // Clear previous content
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = ''; // Clear previous content
    forecastContainer.append(headingCol);
  }

  // Render each forecast card
  for (let i = 0; i < forecast.length; i++) {
    renderForecastCard(forecast[i]);
  }
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, description, temperature, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  // Convert temperature to Fahrenheit
  const tempF = (temperature * 9) / 5 + 32;

  // Add content to elements
  cardTitle.textContent = date;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', description);
  tempEl.textContent = `Temp: ${tempF.toFixed(1)} °F`;
  windEl.textContent = `Wind: N/A`; // Wind data is not available in forecast data
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async (searchHistory: any) => {
  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!searchHistory.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center">No Previous Search History</p>';
    }

    // * Start at end of history array and count down to show the most recent cities at the top.
    for (let i = searchHistory.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(searchHistory[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error('City cannot be blank');
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: Event) => {
  if (event.target instanceof HTMLElement && event.target.matches('.history-btn')) {
    const city = event.target.textContent!;
    fetchWeather(city).then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: Event) => {
  event.stopPropagation();
  
  const target = event.target as HTMLElement;
  if (target && target.hasAttribute('data-city')) {
    const cityID = JSON.parse(target.getAttribute('data-city')!).id;
    deleteCityFromHistory(cityID).then(getAndRenderHistory);
  }
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
