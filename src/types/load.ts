export interface Load {
  load_id: string;              // unique identifier (e.g. "L-8742")
  origin: string;               // pickup city and state (e.g. "Dallas, TX")
  destination: string;          // delivery city and state (e.g. "Atlanta, GA")
  pickup_datetime: string;      // ISO-8601 timestamp for pickup
  delivery_datetime: string;    // ISO-8601 timestamp for delivery
  equipment_type: string;       // "Dry Van", "Reefer", "Flatbed", etc.
  loadboard_rate: number;       // listed rate in USD
  notes: string;                // optional free-text details
  weight: number;               // load weight in pounds
  commodity_type: string;       // description of commodity
  num_of_pieces: number;        // number of pieces or pallets
  miles: number;                // total miles for the route
  dimensions: string;           // optional dimensions (LxWxH)
  run_type: string;             // "interstate" | "intrastate" | "either"
  origin_state: string;         // parsed 2-letter state code for origin
  destination_state: string;    // parsed 2-letter state code for destination
  booked: boolean;              // true if load already booked
  best_load_score: number;      // computed ranking score
  rpm: number;                  // rate per mile (derived)
}

export interface LoadQueryParams {
  origin_state?: string;
  destination_state?: string;
  equipment_type?: string;
  min_price?: string;
  max_price?: string;
  min_rpm?: string;
  max_rpm?: string;
  min_miles?: string;
  max_miles?: string;
  pickup_after?: string;
  pickup_before?: string;
  commodity_type?: string;
  run_type?: string;
  min_weight?: string;
  max_weight?: string;
}

