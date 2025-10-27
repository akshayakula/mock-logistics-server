export interface AnalyticsEntry {
  id: string;                    // unique identifier for this analytics entry
  timestamp: string;             // ISO-8601 timestamp when this was logged
  classification?: string;       // call classification: "Successful", "Failed Price", "Failed MC Validation", "Failed Load Matching"
  mc_number?: string;            // carrier MC number (optional)
  origin_state?: string;         // origin state from query
  destination_state?: string;    // destination state from query
  load_id?: string;              // the load that was found/booked
  price?: number;                // the price of the load
  miles?: number;                // miles of the load
  weight?: number;               // weight of the load in pounds
  equipment_type?: string;       // equipment type if queried
  min_price?: number;            // minimum price filter if used
  max_price?: number;            // maximum price filter if used
  min_rpm?: number;              // minimum RPM filter if used
  max_rpm?: number;              // maximum RPM filter if used
  action_type?: string;          // "search" or "booking" or "other"
  [key: string]: any;            // allow additional fields
}

export interface AnalyticsPayload {
  classification?: string;       // call classification
  mc_number?: string;
  origin_state?: string;
  destination_state?: string;
  dest_state?: string;           // alias for destination_state
  load_id?: string;
  booked_load?: string;          // alias for load_id
  price?: number;
  miles?: number;
  weight?: number;
  equipment_type?: string;
  min_price?: number;
  max_price?: number;
  min_rpm?: number;
  max_rpm?: number;
  action_type?: string;
  [key: string]: any;            // allow additional fields
}

