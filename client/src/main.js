import './styles/jass.css';

/*

API Base URL: Switch between development and production environments
*/
const API_BASE = import.meta.env.PROD
  ? 'https://api-and-server-9sk2.onrender.com' // Render backend URL
  : '/api';

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/weather/`, {
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
    const response = await fetch(`${API_BASE}/api/weather/history`, {
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
    await fetch(`${API_BASE}/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting city from history:', error);
  }
};

/* The rest of the file remains unchanged */
