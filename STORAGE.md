# Storage System Documentation

## Overview

The Mock Logistics Server now uses a JSON file-based persistent storage system that saves load data and bookings to disk.

---

## How It Works

### Local Storage
- **Location**: `data/loads.json`
- **Format**: JSON file containing all 100 loads
- **Initialization**: Auto-creates on first run with 100 available loads
- **Persistence**: Bookings persist across server restarts

### Storage Operations

```typescript
// Initialize storage with default loads
initializeIfEmpty(mockLoads);

// Get all loads
getAllLoads();

// Update a specific load
updateLoad(loadId, { booked: true });

// Reset all loads to available
resetAllLoads();
```

---

## Key Features

### ✅ Persistent Bookings
When you book a load, it's saved to `data/loads.json` and remains booked even after:
- Server restarts
- Code changes
- Container rebuilds (local Docker)

### ✅ 100 Mock Loads
All loads generated with:
- Realistic routes across 20+ US cities
- 6 equipment types
- 12 commodity types
- Pricing: $1.50-$3.00 per mile
- **All marked as available by default**

### ✅ Automatic Initialization
On first run, the server:
1. Checks if `data/loads.json` exists
2. If not, creates it with 100 fresh loads
3. If yes, loads existing data (preserving bookings)

---

## API Stats

The root endpoint now shows real-time statistics:

```bash
curl https://mock-logistics-server.fly.dev/
```

```json
{
  "message": "Mock Logistics Server API",
  "version": "1.0.0",
  "endpoints": {...},
  "stats": {
    "total_loads": 100,
    "available_loads": 99,
    "booked_loads": 1
  }
}
```

---

## Storage Location

### Local Development
```
/Users/akshayakula/Developer/mock-logistics-server/data/loads.json
```

### Docker Container
```
/app/data/loads.json
```

### fly.io (Important!)
⚠️ **Ephemeral Storage**: On fly.io, the container filesystem is ephemeral. Data persists during the session but resets when:
- Machines restart
- New deployments happen
- Machines scale up/down

**For production persistence on fly.io**, consider:
1. **fly.io Volumes** - Persistent storage attached to machines
2. **External Database** - PostgreSQL, MongoDB, etc.
3. **S3/Object Storage** - Store JSON file in cloud storage

---

## File Structure

```
mock-logistics-server/
├── data/                    # Storage directory (gitignored)
│   └── loads.json          # Persistent load data (59KB)
├── src/
│   ├── data/
│   │   ├── storage.ts      # Storage operations
│   │   └── mockLoads.ts    # Mock data generator
│   ├── routes/
│   │   └── loads.ts        # Uses storage system
│   └── index.ts            # Initializes storage
```

---

## Testing Persistence Locally

```bash
# 1. Start server
npm run dev

# 2. Check initial stats
curl http://localhost:3000/
# Shows: 100 total, 100 available, 0 booked

# 3. Book a load
curl -X POST -H "X-API-Key: acme_dev_c4a9d02fb3" \
  http://localhost:3000/api/loads/L-1001/book

# 4. Check stats again
curl http://localhost:3000/
# Shows: 100 total, 99 available, 1 booked

# 5. Restart server
# Stop and start again

# 6. Check stats after restart
curl http://localhost:3000/
# Still shows: 100 total, 99 available, 1 booked ✅
```

---

## Resetting Data

To reset all loads back to available:

### Option 1: Delete the file
```bash
rm data/loads.json
# Server will recreate with 100 fresh loads on next start
```

### Option 2: Use the reset function
Add this endpoint to your routes (not currently exposed):
```typescript
import { resetAllLoads } from '../data/storage';

router.post('/reset', (req, res) => {
  resetAllLoads();
  res.json({ message: 'All loads reset to available' });
});
```

---

## Migration Notes

### What Changed?
**Before**: In-memory storage (data lost on restart)
```typescript
import { mockLoads } from '../data/mockLoads';
const load = mockLoads.find(l => l.load_id === id);
load.booked = true; // Lost on restart
```

**After**: Persistent storage (data survives restart)
```typescript
import { getAllLoads, updateLoad } from '../data/storage';
const loads = getAllLoads();
updateLoad(loadId, { booked: true }); // Saved to disk
```

### Backward Compatible
- Same API endpoints
- Same request/response format
- No breaking changes

---

## Storage File Example

```json
[
  {
    "load_id": "L-1001",
    "origin": "Dallas, TX",
    "destination": "Atlanta, GA",
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
    "destination_state": "GA",
    "booked": false,
    "best_load_score": 39.88,
    "rpm": 2.44
  },
  ...99 more loads
]
```

---

## Production Considerations

### For True Production Persistence on fly.io:

#### Option 1: fly.io Volumes
```bash
# Create a volume
flyctl volumes create data --size 1

# Update fly.toml
[[mounts]]
  source = "data"
  destination = "/app/data"

# Deploy
flyctl deploy
```

#### Option 2: External Database
- Replace JSON storage with PostgreSQL/MongoDB
- Use fly.io Postgres addon
- Update storage.ts to use database client

#### Option 3: S3/Object Storage
- Store loads.json in AWS S3 or similar
- Read/write to cloud storage instead of local file
- Survives all restarts and scaling

---

## Summary

✅ **100 loads** - All available by default  
✅ **Persistent bookings** - Saved to disk locally  
✅ **Automatic initialization** - Sets up on first run  
✅ **Real-time stats** - Shows available/booked counts  
✅ **Easy reset** - Delete file to start fresh  
⚠️ **fly.io** - Use volumes or database for production persistence  

---

**Last Updated**: October 2025

