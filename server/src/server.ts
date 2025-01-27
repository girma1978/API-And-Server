import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

// Configure CORS to allow requests from any origin (you can narrow this down for security)
app.use(cors({
  origin: '*', // Allow all origins; adjust for security as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow methods as necessary
}));

// Set up the port from the environment or default to 3001
const PORT = process.env.PORT || 3001;

// Serve static files from 'client/dist' (adjust for the actual path)
app.use(express.static('client/dist')); // Static file serving for the client

// Middleware to parse incoming requests of various content types
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Connect dynamic routes
app.use(routes); // This imports and uses all the routes from your 'routes/index.js' file

// Handle generic errors for invalid routes (404)
app.use((req, res) => {
  res.status(404).send({ error: 'Not Found' }); // Custom 404 for unmatched routes
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
