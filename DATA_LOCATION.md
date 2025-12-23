# Data Storage Location and Export

## Where is the Data Stored?

All data is automatically saved to the `data/` directory:

### 1. Player Game Scores
**File:** `/Users/talbarkan/Desktop/portfolo/data/players.json`

This file contains all player scores in JSON format with the following structure:
```json
{
  "players": [
    {
      "name": "Player Name",
      "game": "Tic Tac Toe",
      "score": 5,
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Contact Form Messages
**File:** `/Users/talbarkan/Desktop/portfolo/data/messages.json`

This file contains all contact form submissions with:
- Name
- Email
- Subject
- Message
- Timestamp

**Note:** Messages are saved automatically even if email sending fails!

## How to View/Export Data

### 🌐 Live Excel-Like Views (Recommended!)

**Contact Messages - Live Table:**
- **URL:** `http://localhost:3000/data/messages`
- Beautiful Excel-like table view
- Auto-refreshes every 30 seconds
- Shows total count and statistics
- One-click CSV export button

**Game Scores - Live Table:**
- **URL:** `http://localhost:3000/data/players`
- Beautiful Excel-like table view
- Auto-refreshes every 30 seconds
- Filter by game type
- Shows rankings and top players
- One-click CSV export button

### Player Scores

**Option 1: Live Table View (Best!)**
- Visit: `http://localhost:3000/data/players`
- Beautiful table with rankings and stats

**Option 2: View JSON File**
- Open: `data/players.json`

**Option 3: Export to Excel/CSV**
- From live view: Click "Export CSV" button
- Direct download: `http://localhost:3000/api/players/export`
- Downloads CSV file (opens in Excel)
- Filter by game: `http://localhost:3000/api/players/export?game=Tic%20Tac%20Toe`

**Option 4: View as JSON in Browser**
- Visit: `http://localhost:3000/api/players`
- Filter: `http://localhost:3000/api/players?game=Tic%20Tac%20Toe&limit=10`

### Contact Messages

**Option 1: Live Table View (Best!)**
- Visit: `http://localhost:3000/data/messages`
- Beautiful table with all message details

**Option 2: View JSON File**
- Open: `data/messages.json`

**Option 3: Export to Excel/CSV**
- From live view: Click "Export CSV" button
- Direct download: `http://localhost:3000/api/messages/export`
- Downloads CSV file with all messages (opens in Excel)

**Option 4: View as JSON in Browser**
- Visit: `http://localhost:3000/api/messages`
- Limit results: `http://localhost:3000/api/messages?limit=50`

## CSV File Formats

### Player Scores CSV contains:
- **Name**: Player's name
- **Game**: Game name (e.g., "Tic Tac Toe")
- **Score**: Player's score
- **Date**: Date when score was recorded
- **Time**: Time when score was recorded

### Contact Messages CSV contains:
- **Name**: Sender's name
- **Email**: Sender's email address
- **Subject**: Message subject
- **Message**: Full message content
- **Date**: Date when message was sent
- **Time**: Time when message was sent

## CSV files can be opened in:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any spreadsheet application

## Automatic Saving

✅ **Game Scores**: Automatically saved when a player wins in Tic Tac Toe
✅ **Contact Messages**: Automatically saved when someone submits the contact form
✅ **No action required** - Everything is saved automatically!

## Notes

- Maximum of 1000 records per file (oldest records are removed when limit is reached)
- Each record includes a timestamp for tracking
- Messages are saved even if email sending fails
- All data is stored in JSON format and can be exported to CSV/Excel anytime

