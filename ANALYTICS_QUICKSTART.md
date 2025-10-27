# Analytics API - Quick Start

## Overview
The analytics endpoint allows you to log and track searches, bookings, and custom events from your logistics application.

## Quick Example: Log a Booking

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
  http://localhost:3000/api/analytics
```

## Using Field Aliases

The API supports these aliases for convenience:
- `dest_state` → `destination_state`
- `booked_load` → `load_id`

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
  http://localhost:3000/api/analytics
```

## Retrieve Analytics

```bash
# Get all analytics
curl -H "X-API-Key: YOUR-API-KEY" \
  http://localhost:3000/api/analytics

# Filter by action type
curl -H "X-API-Key: YOUR-API-KEY" \
  "http://localhost:3000/api/analytics?action_type=booking"

# Get statistics
curl -H "X-API-Key: YOUR-API-KEY" \
  http://localhost:3000/api/analytics/stats
```

## Complete Workflow

```bash
# 1. Search for a load
LOAD=$(curl -s -H "X-API-Key: YOUR-API-KEY" \
  "http://localhost:3000/api/loads?origin_state=TX")

# 2. Log the search
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_number": "347040",
    "origin_state": "TX",
    "action_type": "search"
  }' \
  http://localhost:3000/api/analytics

# 3. Book the load (extract load_id from the search result)
curl -X POST \
  -H "X-API-Key: YOUR-API-KEY" \
  "http://localhost:3000/api/loads/L-1088/book"

# 4. Log the booking with full details
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
  http://localhost:3000/api/analytics
```

## Data Storage

All analytics data is stored in:
```
data/analytics.json
```

This file persists across server restarts, allowing you to build analytics dashboards and reports.

## Full Documentation

For complete API documentation including all fields and options, see [ANALYTICS_API.md](./ANALYTICS_API.md)

