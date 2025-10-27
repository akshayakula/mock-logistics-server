import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loadsRouter from './routes/loads';
import { authenticateApiKey } from './middleware/auth';
import { initializeIfEmpty, getAllLoads } from './data/storage';
import { mockLoads } from './data/mockLoads';

// Load environment variables
dotenv.config();

// Initialize persistent storage with mock data
const loads = initializeIfEmpty(mockLoads);
console.log(`📊 Loaded ${loads.length} total loads (${loads.filter(l => !l.booked).length} available, ${loads.filter(l => l.booked).length} booked)`);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no auth required)
app.get('/', (req: Request, res: Response) => {
  const allLoads = getAllLoads();
  const availableCount = allLoads.filter(l => !l.booked).length;
  const bookedCount = allLoads.filter(l => l.booked).length;
  
  res.json({
    message: 'Mock Logistics Server API',
    version: '1.0.0',
    endpoints: {
      loads: 'GET /api/loads - Find best available load (auth required)',
      book: 'POST /api/loads/:load_id/book - Book a load (auth required)'
    },
    authentication: 'Include X-API-Key or Authorization header with your API key',
    stats: {
      total_loads: allLoads.length,
      available_loads: availableCount,
      booked_loads: bookedCount
    }
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Apply authentication middleware to all /api routes
app.use('/api/loads', authenticateApiKey, loadsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚚 Mock Logistics Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 API endpoint: http://localhost:${PORT}/api/loads`);
  console.log(`🔐 API Key: ${process.env.API_KEY || 'demo-api-key-12345'}`);
});

export default app;

