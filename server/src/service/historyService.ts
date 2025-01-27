import { fileURLToPath } from 'url'; // For converting import.meta.url to file path
import { dirname, resolve } from 'path'; // For path manipulation
import fs from 'fs/promises'; // For file system operations
import { v4 as uuidv4 } from 'uuid';

// Convert the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the City class to represent individual cities with an ID and name
class City {
  constructor(public id: string, public name: string) {}
}

// Define the structure of the cities array, and use the `City` class for typing
class HistoryService {
  // Resolve the correct path for searchHistory.json file, making sure it's absolute
  private filePath = resolve(__dirname, '../../db/searchHistory.json');

  // Define a private read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      if (data.trim() === "") {
        return []; // Return an empty array if the file is empty
      }
      // Parse and map raw data to `City` class objects
      const cities: { id: string; name: string }[] = JSON.parse(data);
      return cities.map((city) => new City(city.id, city.name)); // Map raw data to `City` class
    } catch (error) {
      console.error("Error reading the file:", error);
      throw error; // Rethrow error after logging
    }
  }

  // Define a private write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      // Write the cities array to the searchHistory.json file, with indentation for readability
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error("Error writing to the file:", error);
      throw error; // Rethrow error after logging
    }
  }

  // Public method that gets all cities from the searchHistory.json file
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Public method to add a new city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    const cities = await this.getCities(); // Get the current cities
    const newCity = new City(uuidv4(), city); // Create a new city with a unique ID
    cities.push(newCity); // Add the new city to the cities array
    await this.write(cities); // Write the updated array back to the file
  }

  // BONUS: Public method to remove a city from the searchHistory.json file by its ID
  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities(); // Get the current cities
    const updatedCities = cities.filter((city) => city.id !== id); // Filter out the city to be removed
    await this.write(updatedCities); // Write the updated cities back to the file
  }
}

// Export a singleton instance of the HistoryService class
export default new HistoryService();
