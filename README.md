# Weather Dashboard API

This backend service powers a weather dashboard application that allows users to search for weather information for multiple cities. It fetches weather data using the OpenWeather API, stores the cities in a search history, and provides routes for interacting with this data.

## Endpoints

### Local Endpoints:
- **GET** `http://localhost:3000/`: Serves the index HTML page.
- **GET** `http://localhost:3000/api/weather/history`: Retrieves the list of cities from the search history.
- **POST** `http://localhost:3000/api/weather`: Accepts a city name, retrieves the weather data, adds the city to the search history, and returns the weather data.
- **DELETE** `http://localhost:3000/api/weather/history/:id`: Deletes a city from the search history by its unique ID.

### Deployed Endpoints (Render):
- **GET** `https://api-and-server-9sk2.onrender.com/`: Serves the index HTML page.
- **GET** `https://api-and-server-9sk2.onrender.com/api/weather/history`: Retrieves the list of cities from the search history.
- **POST** `https://api-and-server-9sk2.onrender.com/api/weather`: Accepts a city name, retrieves the weather data, adds the city to the search history, and returns the weather data.
- **DELETE** `https://api-and-server-9sk2.onrender.com/api/weather/history/:id`: Deletes a city from the search history by its unique ID.

## Features

- **Search Weather**: Users can search for a city and get the current weather and a 5-day forecast.
- **Weather Details**: Displays temperature, humidity, wind speed, and a weather icon.
- **Search History**: Displays a list of previously searched cities.
- **Delete from History**: Allows users to remove cities from their search history.

## Getting Started

1. **Install dependencies**:
   Run `npm install` in both the `client` and `server` directories to install required packages.

2. **Set up environment variables**:
   In the `server` directory, create a `.env` file with your OpenWeather API key:

