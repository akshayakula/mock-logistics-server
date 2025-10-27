# Analytics API Documentation

The Analytics API allows you to log and retrieve analytics data for load searches and bookings. This data is persisted in a JSON file at `data/analytics.json`.

## Endpoint 3: Log Analytics Data

**POST /api/analytics**

Log analytics data for searches, bookings, or other actions.

### Authentication
Required Header: `X-API-Key: [YOUR-API-KEY-HERE]`

### Request Body

All fields are optional. The API accepts flexible field names and additional custom fields.

**Standard Fields:**
- `mc_number` (string): Motor carrier number
- `origin_state` (string): Origin state code (e.g., "TX", "CA")
- `destination_state` or `dest_state` (string): Destination state code
- `load_id` or `booked_load` (string): Load identifier (e.g., "L-1088")
- `price` (number): Load price in USD
- `miles` (number): Distance in miles
- `weight` (number): Weight in pounds
- `equipment_type` (string): Equipment type (e.g., "Dry Van", "Reefer")
- `min_price`, `max_price` (number): Price range filters used in search
- `min_rpm`, `max_rpm` (number): RPM range filters used in search
- `action_type` (string): Type of action (e.g., "search", "booking")

**Additional Fields:**
You can include any additional custom fields in your request. They will be stored in the analytics entry.

### Example Requests

#### Example 1: Log a booking
```bash
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_number": "347040",
    "origin_state": "TX",
    "destination_state": "CA",
    "load_id": "L-1088",
    "price": 5000,
    "miles": 2511,
    "weight": 16098,
    "action_type": "booking"
  }' \
  https://mock-logistics-server.fly.dev/api/analytics
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Analytics data logged successfully",
  "entry": {
    "id": "A-1761588484706-nq2hmhla2",
    "timestamp": "2025-10-27T18:08:04.706Z",
    "mc_number": "347040",
    "origin_state": "TX",
    "destination_state": "CA",
    "load_id": "L-1088",
    "price": 5000,
    "miles": 2511,
    "weight": 16098,
    "action_type": "booking"
  }
}
```

#### Example 2: Log a search with field aliases
```bash
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_number": "347040",
    "origin_state": "TX",
    "dest_state": "NY",
    "booked_load": "L-5432",
    "price": 3500,
    "miles": 1800,
    "weight": 20000,
    "action_type": "search"
  }' \
  https://mock-logistics-server.fly.dev/api/analytics
```

#### Example 3: Log custom analytics data
```bash
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_number": "347040",
    "action_type": "quote_request",
    "custom_field": "custom_value",
    "user_agent": "Mozilla/5.0",
    "session_id": "abc123"
  }' \
  https://mock-logistics-server.fly.dev/api/analytics
```

---

## Retrieve Analytics Data

**GET /api/analytics**

Retrieve all analytics entries or filter by specific criteria.

### Authentication
Required Header: `X-API-Key: [YOUR-API-KEY-HERE]`

### Query Parameters (Optional)
You can filter by any field that exists in the analytics entries:
- `mc_number`: Filter by MC number
- `action_type`: Filter by action type
- `origin_state`: Filter by origin state
- `destination_state`: Filter by destination state
- Any other custom field

### Example Requests

#### Example 1: Get all analytics
```bash
curl -H "X-API-Key: YOUR-API-KEY" \
  https://mock-logistics-server.fly.dev/api/analytics
```

**Response:**
```json
{
  "count": 2,
  "data": [
    {
      "id": "A-1761588484706-nq2hmhla2",
      "timestamp": "2025-10-27T18:08:04.706Z",
      "mc_number": "347040",
      "origin_state": "TX",
      "destination_state": "CA",
      "load_id": "L-1088",
      "price": 5000,
      "miles": 2511,
      "weight": 16098,
      "action_type": "booking"
    },
    {
      "id": "A-1761588508112-20c0zoqx8",
      "timestamp": "2025-10-27T18:08:28.112Z",
      "mc_number": "347040",
      "origin_state": "TX",
      "destination_state": "NY",
      "load_id": "L-5432",
      "price": 3500,
      "miles": 1800,
      "weight": 20000,
      "action_type": "search"
    }
  ]
}
```

#### Example 2: Filter by action type
```bash
curl -H "X-API-Key: YOUR-API-KEY" \
  "https://mock-logistics-server.fly.dev/api/analytics?action_type=booking"
```

#### Example 3: Filter by MC number
```bash
curl -H "X-API-Key: YOUR-API-KEY" \
  "https://mock-logistics-server.fly.dev/api/analytics?mc_number=347040"
```

---

## Analytics Statistics

**GET /api/analytics/stats**

Get aggregated statistics about analytics data.

### Authentication
Required Header: `X-API-Key: [YOUR-API-KEY-HERE]`

### Example Request
```bash
curl -H "X-API-Key: YOUR-API-KEY" \
  https://mock-logistics-server.fly.dev/api/analytics/stats
```

**Response:**
```json
{
  "total_entries": 2,
  "by_action_type": {
    "booking": 1,
    "search": 1
  },
  "by_mc_number": {
    "347040": 2
  },
  "by_origin_state": {
    "TX": 2
  },
  "by_destination_state": {
    "CA": 1,
    "NY": 1
  }
}
```

---

## Field Aliases

The API supports the following field aliases for convenience:
- `dest_state` → `destination_state`
- `booked_load` → `load_id`

Both the original field name and its alias will be normalized to the standard field name when stored.

---

## Data Persistence

All analytics data is stored persistently in:
```
data/analytics.json
```

This file is created automatically on first use and survives server restarts.

---

## Complete Workflow Example

```bash
# 1. Search for a load
curl -H "X-API-Key: YOUR-API-KEY" \
  "https://mock-logistics-server.fly.dev/api/loads?origin_state=TX&min_rpm=2.0"

# 2. Log the search in analytics
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_number": "347040",
    "origin_state": "TX",
    "min_rpm": 2.0,
    "action_type": "search"
  }' \
  https://mock-logistics-server.fly.dev/api/analytics

# 3. Book a load (use load_id from search response)
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  "https://mock-logistics-server.fly.dev/api/loads/L-1088/book"

# 4. Log the booking in analytics
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_number": "347040",
    "origin_state": "TX",
    "destination_state": "CA",
    "load_id": "L-1088",
    "price": 5000,
    "miles": 2511,
    "weight": 16098,
    "action_type": "booking"
  }' \
  https://mock-logistics-server.fly.dev/api/analytics

# 5. View analytics statistics
curl -H "X-API-Key: YOUR-API-KEY" \
  https://mock-logistics-server.fly.dev/api/analytics/stats
```

---

## Error Responses

### Invalid API Key
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}
```

### Server Error
```json
{
  "error": "Server error",
  "message": "Error description"
}
```

