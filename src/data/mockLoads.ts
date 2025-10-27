import { Load } from '../types/load';

// Helper function to generate dates
const getRandomFutureDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Helper function to calculate RPM and best_load_score
const calculateDerivedFields = (loadboard_rate: number, miles: number): { rpm: number; best_load_score: number } => {
  const rpm = miles > 0 ? loadboard_rate / miles : 0;
  const best_load_score = (rpm * 2) + (loadboard_rate / 100);
  return { rpm, best_load_score };
};

// Mock load data generator
const generateMockLoads = (): Load[] => {
  const cities = [
    { city: 'Dallas, TX', state: 'TX' },
    { city: 'Atlanta, GA', state: 'GA' },
    { city: 'Chicago, IL', state: 'IL' },
    { city: 'Los Angeles, CA', state: 'CA' },
    { city: 'Phoenix, AZ', state: 'AZ' },
    { city: 'Philadelphia, PA', state: 'PA' },
    { city: 'Houston, TX', state: 'TX' },
    { city: 'Miami, FL', state: 'FL' },
    { city: 'Denver, CO', state: 'CO' },
    { city: 'Seattle, WA', state: 'WA' },
    { city: 'Boston, MA', state: 'MA' },
    { city: 'Portland, OR', state: 'OR' },
    { city: 'Las Vegas, NV', state: 'NV' },
    { city: 'Detroit, MI', state: 'MI' },
    { city: 'Memphis, TN', state: 'TN' },
    { city: 'Nashville, TN', state: 'TN' },
    { city: 'San Francisco, CA', state: 'CA' },
    { city: 'New York, NY', state: 'NY' },
    { city: 'Indianapolis, IN', state: 'IN' },
    { city: 'Kansas City, MO', state: 'MO' },
  ];

  const equipmentTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Box Truck', 'Tanker'];
  const commodityTypes = [
    'Electronics', 'Food & Beverage', 'Machinery', 'Automotive Parts',
    'Construction Materials', 'Furniture', 'Textiles', 'Pharmaceuticals',
    'Chemicals', 'Consumer Goods', 'Agricultural Products', 'Paper Products'
  ];

  const loads: Load[] = [];

  for (let i = 1; i <= 100; i++) {
    const origin = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];
    
    // Ensure origin and destination are different
    while (destination.city === origin.city) {
      destination = cities[Math.floor(Math.random() * cities.length)];
    }

    const miles = Math.floor(Math.random() * 2500) + 100; // 100-2600 miles
    const baseRate = miles * (1.5 + Math.random() * 1.5); // $1.50-$3.00 per mile
    const loadboard_rate = Math.round(baseRate);
    const weight = Math.floor(Math.random() * 43000) + 2000; // 2000-45000 lbs
    const num_of_pieces = Math.floor(Math.random() * 26) + 1; // 1-26 pallets
    const equipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    const commodity = commodityTypes[Math.floor(Math.random() * commodityTypes.length)];
    
    const pickupDaysOut = Math.floor(Math.random() * 10) + 1; // 1-10 days out
    const deliveryDaysOut = pickupDaysOut + Math.floor(Math.random() * 3) + 1; // 1-3 days after pickup
    
    const pickup_datetime = getRandomFutureDate(pickupDaysOut);
    const delivery_datetime = getRandomFutureDate(deliveryDaysOut);
    
    const run_type = origin.state === destination.state ? 'intrastate' : 'interstate';
    
    const { rpm, best_load_score } = calculateDerivedFields(loadboard_rate, miles);
    
    const dimensions = `${Math.floor(Math.random() * 40) + 8}'L x ${Math.floor(Math.random() * 6) + 4}'W x ${Math.floor(Math.random() * 6) + 4}'H`;
    
    const notes = [
      'TONU fee applies',
      'Detention after 2 hours',
      'Driver assist required',
      'Liftgate needed',
      'Appointment required',
      'Team drivers preferred',
      'Easy load/unload',
      'Tarps required',
      ''
    ][Math.floor(Math.random() * 9)];

    loads.push({
      load_id: `L-${1000 + i}`,
      origin: origin.city,
      destination: destination.city,
      pickup_datetime,
      delivery_datetime,
      equipment_type: equipment,
      loadboard_rate,
      notes,
      weight,
      commodity_type: commodity,
      num_of_pieces,
      miles,
      dimensions,
      run_type,
      origin_state: origin.state,
      destination_state: destination.state,
      booked: false, // All loads available by default
      best_load_score,
      rpm: parseFloat(rpm.toFixed(2))
    });
  }

  return loads;
};

// Generate and export the mock loads
export const mockLoads: Load[] = generateMockLoads();

// Helper function to reset a load's booked status (for testing)
export const resetLoad = (loadId: string): boolean => {
  const load = mockLoads.find(l => l.load_id === loadId);
  if (load) {
    load.booked = false;
    return true;
  }
  return false;
};

