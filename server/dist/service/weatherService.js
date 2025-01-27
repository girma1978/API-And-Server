import dotenv from 'dotenv';
dotenv.config();
// Define a class for the Weather object
class Weather {
    temperature;
    humidity;
    description;
    icon;
    constructor(temperature, // Temperature in Fahrenheit
    humidity, description, icon) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.description = description;
        this.icon = icon;
    }
}
class WeatherService {
    baseURL = 'https://api.openweathermap.org/data/2.5';
    apiKey = process.env.API_KEY;
    // Update fetchLocationData to return coordinates and cityId
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/weather?q=${query}&appid=${this.apiKey}&units=imperial`);
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(`City not found: ${query}`);
        }
        return {
            lat: data.coord.lat,
            lon: data.coord.lon,
            cityId: data.id // Adding city ID to the coordinates object
        };
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    }
    buildForecastQuery(coordinates) {
        return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&cnt=5&units=imperial`;
    }
    async fetchWeatherData(coordinates) {
        const weatherQuery = this.buildWeatherQuery(coordinates);
        const response = await fetch(weatherQuery);
        const data = await response.json();
        return data;
    }
    async fetchForecastData(coordinates) {
        const forecastQuery = this.buildForecastQuery(coordinates);
        const response = await fetch(forecastQuery);
        const data = await response.json();
        return data;
    }
    parseCurrentWeather(response) {
        const { temp, humidity } = response.main;
        const { description, icon } = response.weather[0];
        return new Weather(temp, humidity, description, icon);
    }
    parseForecast(response) {
        if (!response.list) {
            throw new Error('No forecast data available.');
        }
        const forecast = response.list.map((item) => {
            const { dt_txt, main, weather } = item;
            const { temp, humidity } = main;
            const { description, icon } = weather[0] || {}; // Added safeguard for undefined
            return {
                date: dt_txt,
                temperature: temp || 0,
                humidity: humidity || 0,
                description: description || 'No description available',
                icon: icon || 'default-icon',
            };
        });
        return forecast;
    }
    // Updated method to return city ID alongside weather data
    async getWeatherForCity(city) {
        try {
            const coordinates = await this.fetchLocationData(city);
            const weatherData = await this.fetchWeatherData(coordinates);
            const forecastData = await this.fetchForecastData(coordinates);
            const currentWeather = this.parseCurrentWeather(weatherData);
            const forecast = this.parseForecast(forecastData);
            return {
                cityId: coordinates.cityId, // Returning the city ID
                current: currentWeather,
                forecast: forecast
            };
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error retrieving weather data: ${error.message}`);
            }
            else {
                console.error('An unknown error occurred while fetching weather data.');
            }
            throw error;
        }
    }
}
export default new WeatherService();
