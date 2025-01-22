import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  cityId: number;  // Add cityId to the Coordinates interface
}

// Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number, // Temperature in Fahrenheit
    public humidity: number,
    public description: string,
    public icon: string
  ) {}
}

// Define an interface for the Forecast object
interface Forecast {
  date: string;
  temperature: number; // Temperature in Fahrenheit
  humidity: number;
  description: string;
  icon: string;
}

class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5';
  private apiKey: string = process.env.API_KEY!;

  // Update fetchLocationData to return coordinates and cityId
  private async fetchLocationData(query: string): Promise<Coordinates> {
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

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&cnt=5&units=imperial`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
  }

  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const forecastQuery = this.buildForecastQuery(coordinates);
    const response = await fetch(forecastQuery);
    const data = await response.json();
    return data;
  }

  private parseCurrentWeather(response: any): Weather {
    const { temp, humidity } = response.main;
    const { description, icon } = response.weather[0];
    return new Weather(temp, humidity, description, icon);
  }

  private parseForecast(response: any): Forecast[] {
    if (!response.list) {
      throw new Error('No forecast data available.');
    }

    const forecast: Forecast[] = response.list.map((item: any) => {
      const { dt_txt, main, weather } = item;
      const { temp, humidity } = main;
      const { description, icon } = weather[0] || {};  // Added safeguard for undefined
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
  async getWeatherForCity(city: string): Promise<{ cityId: number, current: Weather, forecast: Forecast[] }> {
    try {
      const coordinates = await this.fetchLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const forecastData = await this.fetchForecastData(coordinates);

      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecast = this.parseForecast(forecastData);

      return { 
        cityId: coordinates.cityId,  // Returning the city ID
        current: currentWeather, 
        forecast: forecast 
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error retrieving weather data: ${error.message}`);
      } else {
        console.error('An unknown error occurred while fetching weather data.');
      }
      throw error;
    }
  }
}

export default new WeatherService();
