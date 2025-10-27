import { Request, Response, NextFunction } from 'express';

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  // Check for API key in X-API-Key or Authorization header
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  // Get valid API key from environment variable
  const validApiKey = process.env.API_KEY || 'demo-api-key-12345';
  
  if (!apiKey) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide an API key in X-API-Key or Authorization header'
    });
    return;
  }
  
  // Remove "Bearer " prefix if present in Authorization header
  const cleanApiKey = typeof apiKey === 'string' 
    ? apiKey.replace(/^Bearer\s+/i, '') 
    : apiKey;
  
  if (cleanApiKey !== validApiKey) {
    res.status(401).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
    return;
  }
  
  // API key is valid, proceed to next middleware
  next();
};

