import { Router, Request, Response } from 'express';
import { addAnalyticsEntry, getAllAnalytics, getAnalyticsCount, getAnalyticsByFilter, clearAnalytics } from '../data/analyticsStorage';
import { AnalyticsPayload } from '../types/analytics';

const router = Router();

/**
 * POST /api/analytics
 * Log analytics data for searches and bookings
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const payload = req.body as AnalyticsPayload;
    
    // Normalize the payload (handle aliases)
    const normalizedData = {
      classification: payload.classification,
      mc_number: payload.mc_number,
      origin_state: payload.origin_state,
      destination_state: payload.destination_state || payload.dest_state,
      load_id: payload.load_id || payload.booked_load,
      price: payload.price ? Number(payload.price) : undefined,
      miles: payload.miles ? Number(payload.miles) : undefined,
      weight: payload.weight ? Number(payload.weight) : undefined,
      equipment_type: payload.equipment_type,
      min_price: payload.min_price ? Number(payload.min_price) : undefined,
      max_price: payload.max_price ? Number(payload.max_price) : undefined,
      min_rpm: payload.min_rpm ? Number(payload.min_rpm) : undefined,
      max_rpm: payload.max_rpm ? Number(payload.max_rpm) : undefined,
      action_type: payload.action_type || 'unknown'
    };
    
    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(normalizedData).filter(([_, v]) => v !== undefined)
    );
    
    // Add any additional fields that weren't in the standard set
    const additionalFields = Object.keys(payload)
      .filter(key => !['classification', 'mc_number', 'origin_state', 'destination_state', 'dest_state', 
                       'load_id', 'booked_load', 'price', 'miles', 'weight', 
                       'equipment_type', 'min_price', 'max_price', 'min_rpm', 
                       'max_rpm', 'action_type'].includes(key))
      .reduce((obj, key) => {
        obj[key] = payload[key];
        return obj;
      }, {} as any);
    
    const entryData = {
      ...cleanedData,
      ...additionalFields
    };
    
    // Save to analytics storage
    const savedEntry = addAnalyticsEntry(entryData);
    
    res.status(201).json({
      success: true,
      message: 'Analytics data logged successfully',
      entry: savedEntry
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

/**
 * GET /api/analytics
 * Retrieve all analytics data or filter by criteria
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const query = req.query;
    
    // If no query params, return all analytics
    if (Object.keys(query).length === 0) {
      const allAnalytics = getAllAnalytics();
      res.json({
        count: allAnalytics.length,
        data: allAnalytics
      });
      return;
    }
    
    // Otherwise, filter by query params
    const filteredAnalytics = getAnalyticsByFilter(query as any);
    res.json({
      count: filteredAnalytics.length,
      data: filteredAnalytics
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

/**
 * GET /api/analytics/stats
 * Get analytics statistics
 */
router.get('/stats', (req: Request, res: Response): void => {
  try {
    const allAnalytics = getAllAnalytics();
    const totalCount = allAnalytics.length;
    
    // Count by action type
    const byActionType = allAnalytics.reduce((acc, entry) => {
      const action = entry.action_type || 'unknown';
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by MC number
    const byMcNumber = allAnalytics.reduce((acc, entry) => {
      if (entry.mc_number) {
        acc[entry.mc_number] = (acc[entry.mc_number] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Count by origin state
    const byOriginState = allAnalytics.reduce((acc, entry) => {
      if (entry.origin_state) {
        acc[entry.origin_state] = (acc[entry.origin_state] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Count by destination state
    const byDestinationState = allAnalytics.reduce((acc, entry) => {
      if (entry.destination_state) {
        acc[entry.destination_state] = (acc[entry.destination_state] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Count by classification
    const byClassification = allAnalytics.reduce((acc, entry) => {
      if (entry.classification) {
        acc[entry.classification] = (acc[entry.classification] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      total_entries: totalCount,
      by_action_type: byActionType,
      by_mc_number: byMcNumber,
      by_origin_state: byOriginState,
      by_destination_state: byDestinationState,
      by_classification: byClassification
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

/**
 * DELETE /api/analytics
 * Clear all analytics data
 */
router.delete('/', (req: Request, res: Response): void => {
  try {
    clearAnalytics();
    
    res.json({
      success: true,
      message: 'All analytics data has been cleared'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

export default router;

