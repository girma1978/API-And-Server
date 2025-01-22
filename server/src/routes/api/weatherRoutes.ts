import { Router } from 'express';
const router = Router();

// Import HistoryService
import HistoryService from '../../service/historyService.js'; 

// Import WeatherService
import WeatherService from '../../service/weatherService.js'; 

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // Get the city from the request body
  const { city } = req.body; 
  try {
    // Get weather data from WeatherService using the city name
    const weatherData = await WeatherService.getWeatherForCity(city); 

    // Save the city to search history using HistoryService
    await HistoryService.addCity(city); 

    // Respond with the weather data
    res.status(200).json(weatherData); 
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error retrieving weather data or saving city.' });
  }
});

// TODO: GET search history
router.get('/history', async (_, res) => { // _ means unused parameter
  try {
    // Fetch search history from HistoryService
    const history = await HistoryService.getCities(); 
    // Respond with the search history
    res.status(200).json(history); 
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params; // Get city ID from URL parameter
  try {
    // Remove the city from search history using HistoryService
    await HistoryService.removeCity(id); 
    // Success response
    res.status(200).json({ message: 'City deleted from history.' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error deleting city from history.' });
  }
});

export default router;

