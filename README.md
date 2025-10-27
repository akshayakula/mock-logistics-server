# Mock Logistics Server

A lightweight Express server with mock logistics load data, providing flexible search and booking capabilities. Perfect for testing freight broker applications, load boards, and logistics software.

## Features

- 🚚 **80 Mock Loads** with realistic data (origin, destination, rates, equipment types, etc.)
- 🔍 **Flexible Search** with support for 14+ query parameters
- 📦 **Smart Scoring** algorithm to return the best available load
- 🔐 **Simple API Key Authentication**
- 🌐 **CORS Enabled** for all origins
- 🚀 **fly.io Ready** with Docker configuration
- 📊 **Complete Load Data** including RPM, weight, commodity, dimensions, and more
- 📈 **Analytics API** for logging and tracking searches, bookings, and custom events

## Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Create a `.env` file:**
```bash
# Copy the example
cp .env.example .env

# Edit .env and set your API key
API_KEY=your-secret-api-key-here
PORT=3000
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Test the API:**
```bash
# Health check (no auth required)
curl http://localhost:3000/health

# Get best available load (auth required)
curl -H "X-API-Key: your-secret-api-key-here" \
  http://localhost:3000/api/loads
```

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Documentation

### Authentication

All `/api/*` endpoints require authentication. Include your API key in either:
- `X-API-Key` header (recommended)
- `Authorization` header (supports Bearer token format)

**Example:**
```bash
curl -H "X-API-Key: your-secret-api-key-here" \
  http://localhost:3000/api/loads
```

### Endpoints

#### 1. GET `/api/loads` - Find Best Available Load

Returns ONE best available (non-booked) load matching the specified filters. Loads are ranked by `best_load_score` (calculated from RPM and price).

**Query Parameters (all optional):**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `origin_state` | string | 2-letter state code | `TX` |
| `destination_state` | string | 2-letter state code | `CA` |
| `equipment_type` | string | Equipment type | `Dry Van`, `Reefer`, `Flatbed` |
| `min_price` | number | Minimum rate in USD | `1000` |
| `max_price` | number | Maximum rate in USD | `5000` |
| `min_rpm` | number | Minimum rate per mile | `1.5` |
| `max_rpm` | number | Maximum rate per mile | `3.0` |
| `min_miles` | number | Minimum distance | `500` |
| `max_miles` | number | Maximum distance | `2000` |
| `pickup_after` | ISO-8601 | Earliest pickup date | `2025-10-27T00:00:00Z` |
| `pickup_before` | ISO-8601 | Latest pickup date | `2025-11-01T00:00:00Z` |
| `commodity_type` | string | Type of commodity | `Electronics` |
| `run_type` | string | `interstate`, `intrastate`, or `either` | `interstate` |
| `min_weight` | number | Minimum weight in lbs | `10000` |
| `max_weight` | number | Maximum weight in lbs | `40000` |

**Example Requests:**

```bash
# Get any available load
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/loads

# Filter by states and equipment
curl -H "X-API-Key: your-api-key" \
  "http://localhost:3000/api/loads?origin_state=TX&destination_state=CA&equipment_type=Dry%20Van"

# Filter by price range and RPM
curl -H "X-API-Key: your-api-key" \
  "http://localhost:3000/api/loads?min_price=2000&max_price=5000&min_rpm=2.0"

# Filter by distance and dates
curl -H "X-API-Key: your-api-key" \
  "http://localhost:3000/api/loads?min_miles=500&max_miles=1500&pickup_after=2025-10-27T00:00:00Z"
```

**Success Response (200):**
```json
{
  "load_id": "L-1042",
  "origin": "Dallas, TX",
  "destination": "Los Angeles, CA",
  "pickup_datetime": "2025-10-29T08:00:00.000Z",
  "delivery_datetime": "2025-10-31T17:00:00.000Z",
  "equipment_type": "Dry Van",
  "loadboard_rate": 3500,
  "notes": "Appointment required",
  "weight": 35000,
  "commodity_type": "Electronics",
  "num_of_pieces": 18,
  "miles": 1435,
  "dimensions": "45'L x 8'W x 7'H",
  "run_type": "interstate",
  "origin_state": "TX",
  "destination_state": "CA",
  "booked": false,
  "best_load_score": 39.88,
  "rpm": 2.44
}
```

**Error Response (404):**
```json
{
  "error": "No loads found",
  "message": "No available loads match the specified criteria"
}
```

#### 2. POST `/api/loads/:load_id/book` - Book a Load

Marks a specific load as booked, making it unavailable for future searches.

**URL Parameters:**
- `load_id` - The unique load identifier (e.g., `L-1042`)

**Example Request:**
```bash
curl -X POST \
  -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/loads/L-1042/book
```

**Success Response (200):**
```json
{
  "message": "Load successfully booked",
  "load": {
    "load_id": "L-1042",
    "origin": "Dallas, TX",
    "destination": "Los Angeles, CA",
    "booked": true,
    ...
  }
}
```

**Error Responses:**

**404 - Load Not Found:**
```json
{
  "error": "Load not found",
  "message": "No load found with ID: L-9999"
}
```

**400 - Already Booked:**
```json
{
  "error": "Load already booked",
  "message": "Load L-1042 has already been booked"
}
```

#### 3. POST `/api/analytics` - Log Analytics Data

Log analytics data for searches, bookings, or custom events. All analytics data is stored persistently.

**See [ANALYTICS_API.md](./ANALYTICS_API.md) for complete documentation.**

**Quick Example:**
```bash
curl -X POST \
  -H "X-API-Key: your-api-key" \
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

**Additional Analytics Endpoints:**
- `GET /api/analytics` - Retrieve analytics data with optional filters
- `GET /api/analytics/stats` - Get aggregated analytics statistics

#### 4. GET `/` - API Info

Returns information about the API endpoints (no authentication required).

#### 5. GET `/health` - Health Check

Returns server health status (no authentication required).

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

## Load Data Schema

Each load contains the following fields:

```typescript
{
  load_id: string;              // unique identifier (e.g. "L-1042")
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
  dimensions: string;           // dimensions (LxWxH)
  run_type: string;             // "interstate" | "intrastate" | "either"
  origin_state: string;         // 2-letter state code for origin
  destination_state: string;    // 2-letter state code for destination
  booked: boolean;              // true if load already booked
  best_load_score: number;      // computed ranking score
  rpm: number;                  // rate per mile (derived)
}
```

## Best Load Scoring

The `best_load_score` is calculated using the formula:

```
best_load_score = (rpm × 2) + (loadboard_rate ÷ 100)
```

This prioritizes:
1. Higher rate per mile (RPM) - better profitability per distance
2. Higher total rate - better overall revenue

Loads are sorted by this score, and the highest-scoring available load is returned.

## Deployment to fly.io

### Prerequisites
- Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
- Sign up for a [fly.io account](https://fly.io/app/sign-up)

### Deploy Steps

1. **Login to fly.io:**
```bash
flyctl auth login
```

2. **Launch the app (first time only):**
```bash
flyctl launch
```

When prompted:
- Choose an app name or accept the suggested one
- Select a region
- Don't set up a PostgreSQL database (we use in-memory storage)
- Don't deploy yet (we need to set secrets first)

3. **Set your API key secret:**
```bash
flyctl secrets set API_KEY=your-secure-api-key-here
```

4. **Deploy:**
```bash
flyctl deploy
```

5. **Open your app:**
```bash
flyctl open
```

Your API will be available at `https://your-app-name.fly.dev`

### Environment Variables

Set environment variables using fly.io secrets:

```bash
flyctl secrets set API_KEY=your-secret-key
flyctl secrets set PORT=3000
```

## Development

### Project Structure

```
/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── middleware/
│   │   └── auth.ts           # API key authentication
│   ├── routes/
│   │   ├── loads.ts          # Load endpoints
│   │   └── analytics.ts      # Analytics endpoints
│   ├── data/
│   │   ├── mockLoads.ts      # Mock data generator
│   │   ├── storage.ts        # Persistent load storage
│   │   └── analyticsStorage.ts # Persistent analytics storage
│   └── types/
│       ├── load.ts           # Load TypeScript interfaces
│       └── analytics.ts      # Analytics TypeScript interfaces
├── data/
│   ├── loads.json            # Persistent load data
│   └── analytics.json        # Persistent analytics data
├── Dockerfile                 # Docker config for fly.io
├── fly.toml                   # fly.io configuration
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── ANALYTICS_API.md           # Analytics API documentation
```

### Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types without building

## Data Storage

### Load Data

The server includes 100 pre-generated mock loads with:
- Diverse routes across 20+ major US cities
- 6 equipment types (Dry Van, Reefer, Flatbed, Step Deck, Box Truck, Tanker)
- 12 commodity types (Electronics, Food & Beverage, Machinery, etc.)
- Realistic pricing ($1.50-$3.00 per mile)
- Weight ranges (2,000-45,000 lbs)
- Future pickup dates (1-10 days out)
- ~15% pre-booked loads

Load data is **persistent** and stored in `data/loads.json`. If the file doesn't exist on startup, it will be created with the mock data. Bookings persist across server restarts.

### Analytics Data

Analytics data is stored persistently in `data/analytics.json`. All logged analytics entries (searches, bookings, custom events) are preserved across server restarts.

## CORS

CORS is enabled for all origins (`*`), making it easy to call from any web application, mobile app, or testing tool.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
