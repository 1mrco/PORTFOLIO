# Portfolio Website

A modern, interactive portfolio website built with Node.js, Express, TypeScript, and EJS.

## Features

- 🎨 Modern glassmorphism UI design
- 🌓 Light/Dark theme toggle
- 📧 Contact form with email integration
- 🎮 Interactive games (Tic Tac Toe)
- 📊 Live data views for messages and game scores
- 📁 Easy project and certificate management via JSON files
- 📱 Fully responsive design

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** TypeScript, EJS templates
- **Styling:** CSS with glassmorphism effects
- **Email:** Nodemailer
- **Testing:** Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

See `EMAIL_SETUP.md` for Gmail App Password setup instructions.

## Project Structure

```
portfolo/
├── src/
│   ├── server.ts          # Express server
│   ├── views/             # EJS templates
│   └── public/ts/         # TypeScript source files
├── public/                # Static files
│   ├── css/              # Stylesheets
│   ├── js/               # Compiled JavaScript
│   └── images/           # Images
├── data/                 # JSON data files
│   ├── projects.json    # Project data
│   └── certificates.json # Certificate data
└── dist/                # Compiled output
```

## Adding Projects & Certificates

Edit the JSON files in the `data/` directory:

- `data/projects.json` - Add/edit projects
- `data/certificates.json` - Add/edit certificates

See `HOW_TO_ADD_PROJECTS_AND_CERTIFICATES.md` for detailed instructions.

## Data Management

- Contact messages: Automatically saved to `data/messages.json`
- Game scores: Automatically saved to `data/players.json`
- View live data: `/data/messages` and `/data/players`
- Export to CSV: `/api/messages/export` and `/api/players/export`

See `AUTOMATIC_DATA_STORAGE.md` for more details.

## Deployment

This is a Node.js application. Recommended hosting:

- **Vercel** (Recommended - Free & Easy)
- **Render** (Free tier available)
- **Railway** (Free tier available)

See `GITHUB_DEPLOYMENT_GUIDE.md` for deployment instructions.

## License

MIT

## Author

Talib Arkan Talib

