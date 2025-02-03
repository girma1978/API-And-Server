
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';  // Import Express
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();  // Create an Express app instance
const router = Router();

// Serve static assets from the client build directory
router.use(express.static(path.join(__dirname, '../../../client/dist')));

// Serve the index.html for all other requests
router.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

// Use the router in the app
app.use(router);

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default router;
