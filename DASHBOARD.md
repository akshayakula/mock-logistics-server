# Analytics Dashboard

A beautiful web interface to view and analyze your logistics analytics data in real-time.

## 🌐 Access the Dashboard

**Live URL:** https://mock-logistics-server.fly.dev/analytics-dashboard

## 🔑 How to Use

1. **Visit the dashboard URL** in your web browser
2. **Enter your API key** in the input field
3. **Click "View Analytics"** to load your data
4. **Use the refresh button** to reload the latest data

### Direct Access with API Key

You can also pass the API key in the URL for direct access:

```
https://mock-logistics-server.fly.dev/analytics-dashboard?api_key=YOUR-API-KEY
```

## 📊 Dashboard Features

### Real-time Statistics
- **Total Entries** - Count of all analytics records
- **Total Bookings** - Number of booking actions
- **Total Searches** - Number of search actions
- **Unique MC Numbers** - Count of different motor carriers

### Data Breakdowns
- **By Origin State** - See which states have the most activity
- **By Destination State** - Track popular destination states
- **By MC Number** - Monitor activity per motor carrier

### Detailed Entry List
- View all analytics entries with full details
- Color-coded badges for action types (booking, search, etc.)
- Timestamps for each entry
- All custom fields displayed

## 🎨 Features

- ✨ Modern, responsive design
- 📱 Mobile-friendly interface
- 🔄 One-click refresh
- 🎯 Real-time data fetching
- 🔒 Secure API key authentication
- 💅 Beautiful gradient design
- 📈 Visual data organization

## 🖼️ Dashboard Sections

### Header
Displays the dashboard title and description

### Authentication Card
- Input field for API key
- Submit button to load analytics
- Error messages for invalid keys

### Statistics Grid
Four cards showing key metrics at a glance

### Breakdown Sections
Visual representation of data grouped by:
- Origin states
- Destination states
- MC numbers

### Recent Entries
Detailed cards showing:
- Entry ID
- Timestamp
- Action type badge
- All data fields

## 🔐 Security

- Dashboard page is publicly accessible
- Authentication is handled client-side with API key
- All API requests include the X-API-Key header
- Invalid keys show clear error messages

## 📱 Responsive Design

The dashboard works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Quick Start Example

```bash
# Open in your default browser (Mac/Linux)
open https://mock-logistics-server.fly.dev/analytics-dashboard

# Or use curl to test the endpoint
curl https://mock-logistics-server.fly.dev/analytics-dashboard
```

## 🎯 Use Cases

1. **Monitor Load Activity** - Track searches and bookings in real-time
2. **Analyze Geographic Patterns** - See which states are most active
3. **Track Carrier Performance** - Monitor activity by MC number
4. **Review Historical Data** - Browse through all past analytics entries
5. **Debug API Integration** - Verify data is being logged correctly

## 💡 Tips

- Bookmark the dashboard with your API key in the URL for quick access
- Use the refresh button to see new entries without reloading the page
- The dashboard shows all data, not just recent entries
- Entries are sorted by timestamp (newest first)

## 🔗 Related Endpoints

- `POST /api/analytics` - Log new analytics data
- `GET /api/analytics` - Retrieve analytics data (JSON)
- `GET /api/analytics/stats` - Get statistics (JSON)
- `GET /analytics-dashboard` - View this dashboard (HTML)

## 📚 Documentation

For API documentation, see:
- [ANALYTICS_API.md](./ANALYTICS_API.md) - Complete API reference
- [ANALYTICS_QUICKSTART.md](./ANALYTICS_QUICKSTART.md) - Quick start guide
- [README.md](./README.md) - Main documentation

