import { Router, Request, Response } from 'express';
import { getAllLoads, updateLoad } from '../data/storage';
import { Load, LoadQueryParams } from '../types/load';

const router = Router();

/**
 * GET /api/loads
 * Find the best available load based on flexible filters
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const query = req.query as LoadQueryParams;
    
    // Start with all non-booked loads from persistent storage
    let availableLoads = getAllLoads().filter(load => !load.booked);
    
    // Apply filters based on query parameters
    
    // Filter by origin state
    if (query.origin_state) {
      availableLoads = availableLoads.filter(
        load => load.origin_state.toLowerCase() === query.origin_state!.toLowerCase()
      );
    }
    
    // Filter by destination state
    if (query.destination_state) {
      availableLoads = availableLoads.filter(
        load => load.destination_state.toLowerCase() === query.destination_state!.toLowerCase()
      );
    }
    
    // Filter by equipment type
    if (query.equipment_type) {
      availableLoads = availableLoads.filter(
        load => load.equipment_type.toLowerCase() === query.equipment_type!.toLowerCase()
      );
    }
    
    // Filter by price range
    if (query.min_price) {
      const minPrice = parseFloat(query.min_price);
      availableLoads = availableLoads.filter(load => load.loadboard_rate >= minPrice);
    }
    
    if (query.max_price) {
      const maxPrice = parseFloat(query.max_price);
      availableLoads = availableLoads.filter(load => load.loadboard_rate <= maxPrice);
    }
    
    // Filter by RPM range
    if (query.min_rpm) {
      const minRpm = parseFloat(query.min_rpm);
      availableLoads = availableLoads.filter(load => load.rpm >= minRpm);
    }
    
    if (query.max_rpm) {
      const maxRpm = parseFloat(query.max_rpm);
      availableLoads = availableLoads.filter(load => load.rpm <= maxRpm);
    }
    
    // Filter by miles range
    if (query.min_miles) {
      const minMiles = parseInt(query.min_miles);
      availableLoads = availableLoads.filter(load => load.miles >= minMiles);
    }
    
    if (query.max_miles) {
      const maxMiles = parseInt(query.max_miles);
      availableLoads = availableLoads.filter(load => load.miles <= maxMiles);
    }
    
    // Filter by pickup date range
    if (query.pickup_after) {
      const pickupAfter = new Date(query.pickup_after);
      availableLoads = availableLoads.filter(
        load => new Date(load.pickup_datetime) >= pickupAfter
      );
    }
    
    if (query.pickup_before) {
      const pickupBefore = new Date(query.pickup_before);
      availableLoads = availableLoads.filter(
        load => new Date(load.pickup_datetime) <= pickupBefore
      );
    }
    
    // Filter by commodity type
    if (query.commodity_type) {
      availableLoads = availableLoads.filter(
        load => load.commodity_type.toLowerCase().includes(query.commodity_type!.toLowerCase())
      );
    }
    
    // Filter by run type
    if (query.run_type) {
      availableLoads = availableLoads.filter(
        load => load.run_type === query.run_type || load.run_type === 'either'
      );
    }
    
    // Filter by weight range
    if (query.min_weight) {
      const minWeight = parseInt(query.min_weight);
      availableLoads = availableLoads.filter(load => load.weight >= minWeight);
    }
    
    if (query.max_weight) {
      const maxWeight = parseInt(query.max_weight);
      availableLoads = availableLoads.filter(load => load.weight <= maxWeight);
    }
    
    // If no loads match the filters, return 404
    if (availableLoads.length === 0) {
      res.status(404).json({
        error: 'No loads found',
        message: 'No available loads match the specified criteria'
      });
      return;
    }
    
    // Sort by best_load_score (highest first) and return the best one
    availableLoads.sort((a, b) => b.best_load_score - a.best_load_score);
    const bestLoad = availableLoads[0];
    
    res.json(bestLoad);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

/**
 * POST /api/loads/:load_id/book
 * Mark a specific load as booked
 */
router.post('/:load_id/book', (req: Request, res: Response): void => {
  try {
    const { load_id } = req.params;
    
    // Find the load by ID from persistent storage
    const loads = getAllLoads();
    const load = loads.find(l => l.load_id === load_id);
    
    if (!load) {
      res.status(404).json({
        error: 'Load not found',
        message: `No load found with ID: ${load_id}`
      });
      return;
    }
    
    // Check if already booked
    if (load.booked) {
      res.status(400).json({
        error: 'Load already booked',
        message: `Load ${load_id} has already been booked`
      });
      return;
    }
    
    // Mark as booked in persistent storage
    const updatedLoad = updateLoad(load_id, { booked: true });
    
    res.json({
      message: 'Load successfully booked',
      load: updatedLoad
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

export default router;

