# Mock Logistics API - AI Agent Integration Guide

Use this API to search for freight loads and book them.

---

## 🔑 API Authentication

**API Base URL**: `https://mock-logistics-server.fly.dev`

**API Key**: `acme_dev_c4a9d02fb3`

**Authentication Method**: Include the API key in the request headers

**Header Format**: `X-API-Key: acme_dev_c4a9d02fb3`

---

## 📊 API Endpoints

### 1. GET `/api/loads` - Find Available Loads

Search for the best available freight load based on your criteria. Returns ONE load that best matches your filters.

**Authentication**: Required (X-API-Key header)

**Base Request**:
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads"
```

#### Available Query Parameters

All parameters are **optional**. Use any combination to filter loads:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `origin_state` | string | 2-letter origin state code | `TX`, `CA`, `FL` |
| `destination_state` | string | 2-letter destination state code | `NY`, `GA`, `IL` |
| `equipment_type` | string | Type of truck needed | `Dry Van`, `Reefer`, `Flatbed`, `Step Deck`, `Box Truck`, `Tanker` |
| `min_price` | number | Minimum rate in USD | `1000`, `2500` |
| `max_price` | number | Maximum rate in USD | `5000`, `8000` |
| `min_rpm` | number | Minimum rate per mile | `1.5`, `2.0`, `2.5` |
| `max_rpm` | number | Maximum rate per mile | `3.0`, `3.5` |
| `min_miles` | number | Minimum distance | `500`, `1000` |
| `max_miles` | number | Maximum distance | `2000`, `2500` |
| `pickup_after` | ISO-8601 | Earliest pickup date | `2025-10-27T00:00:00Z` |
| `pickup_before` | ISO-8601 | Latest pickup date | `2025-11-01T00:00:00Z` |
| `commodity_type` | string | Type of cargo | `Electronics`, `Food & Beverage`, `Machinery` |
| `run_type` | string | Type of run | `interstate`, `intrastate`, `either` |
| `min_weight` | number | Minimum weight in lbs | `10000`, `20000` |
| `max_weight` | number | Maximum weight in lbs | `40000`, `45000` |

#### Example Requests

**1. Find any available load:**
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads"
```

**2. Find loads from Texas to California:**
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?origin_state=TX&destination_state=CA"
```

**3. Find Reefer loads with good pay (RPM > 2.5):**
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?equipment_type=Reefer&min_rpm=2.5"
```

**4. Find high-value, short-haul loads:**
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?min_price=3000&max_miles=1500"
```

**5. Find Dry Van loads from TX with specific criteria:**
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?origin_state=TX&equipment_type=Dry%20Van&min_rpm=2.0&min_price=2000"
```

**6. Find Electronics loads (specific commodity):**
```bash
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?commodity_type=Electronics&min_rpm=2.5"
```

#### Success Response Example

```json
{
  "load_id": "L-1088",
  "origin": "Houston, TX",
  "destination": "New York, NY",
  "pickup_datetime": "2025-11-06T00:42:04.040Z",
  "delivery_datetime": "2025-11-07T00:42:04.040Z",
  "equipment_type": "Step Deck",
  "loadboard_rate": 4705,
  "notes": "Team drivers preferred",
  "weight": 22547,
  "commodity_type": "Consumer Goods",
  "num_of_pieces": 24,
  "miles": 1748,
  "dimensions": "10'L x 5'W x 5'H",
  "run_type": "interstate",
  "origin_state": "TX",
  "destination_state": "NY",
  "booked": false,
  "best_load_score": 52.43,
  "rpm": 2.69
}
```

#### Error Response (No Loads Found)

```json
{
  "error": "No loads found",
  "message": "No available loads match the specified criteria"
}
```

---

### 2. POST `/api/loads/:load_id/book` - Book a Load

Book a specific load by its ID. Once booked, the load becomes unavailable to others.

**Authentication**: Required (X-API-Key header)

**URL Parameter**: `load_id` - The unique load identifier (e.g., `L-1088`)

#### Example Requests

**1. Book a specific load:**
```bash
curl -X POST \
  -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads/L-1088/book"
```

**2. Book the load you just found:**
```bash
# Step 1: Find a load
LOAD=$(curl -s -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?origin_state=TX")

# Step 2: Extract load_id
LOAD_ID=$(echo $LOAD | jq -r '.load_id')

# Step 3: Book it
curl -X POST \
  -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads/$LOAD_ID/book"
```

#### Success Response

```json
{
  "message": "Load successfully booked",
  "load": {
    "load_id": "L-1088",
    "origin": "Houston, TX",
    "destination": "New York, NY",
    "pickup_datetime": "2025-11-06T00:42:04.040Z",
    "delivery_datetime": "2025-11-07T00:42:04.040Z",
    "equipment_type": "Step Deck",
    "loadboard_rate": 4705,
    "notes": "Team drivers preferred",
    "weight": 22547,
    "commodity_type": "Consumer Goods",
    "num_of_pieces": 24,
    "miles": 1748,
    "dimensions": "10'L x 5'W x 5'H",
    "run_type": "interstate",
    "origin_state": "TX",
    "destination_state": "NY",
    "booked": true,
    "best_load_score": 52.43,
    "rpm": 2.69
  }
}
```

#### Error Responses

**Load Not Found (404):**
```json
{
  "error": "Load not found",
  "message": "No load found with ID: L-9999"
}
```

**Load Already Booked (400):**
```json
{
  "error": "Load already booked",
  "message": "Load L-1088 has already been booked"
}
```

---

## 🔍 Common Workflows

### Workflow 1: Find and Book Best Load
```bash
# 1. Find best available load
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads"

# 2. Book it (replace L-XXXX with actual load_id from response)
curl -X POST -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads/L-XXXX/book"
```

### Workflow 2: Find High-Paying Reefer Loads
```bash
# Search for reefer loads with RPM > 2.5 and price > $3000
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?equipment_type=Reefer&min_rpm=2.5&min_price=3000"
```

### Workflow 3: Find Loads from Specific Origin
```bash
# Find loads originating in Texas
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?origin_state=TX"
```

### Workflow 4: Find Short-Haul, High-Value Loads
```bash
# Loads under 1500 miles with price over $2500
curl -H "X-API-Key: acme_dev_c4a9d02fb3" \
  "https://mock-logistics-server.fly.dev/api/loads?max_miles=1500&min_price=2500"
```

---

## 📊 Check API Status

**Get API info and statistics:**
```bash
curl "https://mock-logistics-server.fly.dev/"
```

**Response:**
```json
{
  "message": "Mock Logistics Server API",
  "version": "1.0.0",
  "endpoints": {
    "loads": "GET /api/loads - Find best available load (auth required)",
    "book": "POST /api/loads/:load_id/book - Book a load (auth required)"
  },
  "authentication": "Include X-API-Key or Authorization header with your API key",
  "stats": {
    "total_loads": 100,
    "available_loads": 99,
    "booked_loads": 1
  }
}
```

---

## 🎯 Quick Reference

### API Endpoint Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/loads` | ✅ Required | Find best available load with filters |
| POST | `/api/loads/:load_id/book` | ✅ Required | Book a specific load |
| GET | `/` | ❌ Not required | Get API info and statistics |
| GET | `/health` | ❌ Not required | Health check |

### Authentication Header

**Always include this header for `/api/loads` endpoints:**
```
X-API-Key: acme_dev_c4a9d02fb3
```

### Equipment Types Available
- `Dry Van`
- `Reefer`
- `Flatbed`
- `Step Deck`
- `Box Truck`
- `Tanker`

### Commodity Types Available
- `Electronics`
- `Food & Beverage`
- `Machinery`
- `Automotive Parts`
- `Construction Materials`
- `Furniture`
- `Textiles`
- `Pharmaceuticals`
- `Chemicals`
- `Consumer Goods`
- `Agricultural Products`
- `Paper Products`

---

## 💡 Tips for AI Agents

1. **Always include the API key header** in your requests to `/api/loads` endpoints
2. **The API returns ONE best load** based on scoring (higher RPM and price = better score)
3. **Bookings are persistent** - once booked, a load stays booked
4. **Use multiple filters** to narrow down to your ideal load
5. **URL encode special characters** in query parameters (e.g., `Dry Van` → `Dry%20Van`)
6. **Check the response status** - 404 means no loads match your criteria
7. **Load IDs are unique** - format is `L-####` (e.g., `L-1088`)

---

## 🧪 Test Commands

**Copy and paste these to test the API:**

```bash
# Set API credentials
export API_KEY="acme_dev_c4a9d02fb3"
export API_URL="https://mock-logistics-server.fly.dev"

# Test 1: Get API status
curl "$API_URL/"

# Test 2: Find any load
curl -H "X-API-Key: $API_KEY" "$API_URL/api/loads"

# Test 3: Find Reefer loads
curl -H "X-API-Key: $API_KEY" "$API_URL/api/loads?equipment_type=Reefer"

# Test 4: Find high-paying loads
curl -H "X-API-Key: $API_KEY" "$API_URL/api/loads?min_rpm=2.5&min_price=3000"

# Test 5: Book a load (replace L-XXXX with actual load_id)
curl -X POST -H "X-API-Key: $API_KEY" "$API_URL/api/loads/L-1050/book"
```

---

## 📞 API Support

- **Base URL**: https://mock-logistics-server.fly.dev
- **API Key**: `acme_dev_c4a9d02fb3`
- **Total Loads**: 100 realistic freight loads
- **Persistence**: Bookings persist across server restarts
- **CORS**: Enabled for all origins

---

**Last Updated**: October 2025

