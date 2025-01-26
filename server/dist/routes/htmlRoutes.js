import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
// Dynamically serve index.html from 'client' or 'client/dist' based on environment
router.get('/', (_, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        // Serve the index.html from 'client/dist' if in production
        res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'dist', 'index.html'));
    }
    else {
        // Serve the index.html directly from 'client' during development
        res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
    }
});
export default router;
