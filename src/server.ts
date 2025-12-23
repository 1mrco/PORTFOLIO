import express, { Request, Response } from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Data storage file paths
const DATA_DIR = path.join(process.cwd(), "data");
const PLAYERS_FILE = path.join(DATA_DIR, "players.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CERTIFICATES_FILE = path.join(DATA_DIR, "certificates.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(PLAYERS_FILE)) {
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify({ players: [] }, null, 2));
}

if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify({ messages: [] }, null, 2));
}

if (!fs.existsSync(PROJECTS_FILE)) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify({ projects: [] }, null, 2));
}

if (!fs.existsSync(CERTIFICATES_FILE)) {
  fs.writeFileSync(CERTIFICATES_FILE, JSON.stringify({ certificates: [] }, null, 2));
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(process.cwd(), "public")));

// Basic locals for all views
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.siteTitle = "Talib Arkan Talib | Portfolio";
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.render("home", {
    pageTitle: "Home",
    name: "Talib Arkan Talib",
    pageScript: "home.js"
  });
});

app.get("/projects", (_req: Request, res: Response) => {
  try {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
    res.render("projects", {
      pageTitle: "Projects",
      pageScript: "projects.js",
      projects: data.projects || []
    });
  } catch (error) {
    console.error("Error loading projects:", error);
    res.render("projects", {
      pageTitle: "Projects",
      pageScript: "projects.js",
      projects: []
    });
  }
});

app.get("/certificates", (_req: Request, res: Response) => {
  try {
    const data = JSON.parse(fs.readFileSync(CERTIFICATES_FILE, "utf-8"));
    res.render("certificates", {
      pageTitle: "Certificates",
      pageScript: "certificates.js",
      certificates: data.certificates || []
    });
  } catch (error) {
    console.error("Error loading certificates:", error);
    res.render("certificates", {
      pageTitle: "Certificates",
      pageScript: "certificates.js",
      certificates: []
    });
  }
});

app.get("/games", (_req: Request, res: Response) => {
  res.render("games", {
    pageTitle: "Games",
    pageScript: "games.js"
  });
});

// Live data views - Excel-like tables
app.get("/data/messages", (_req: Request, res: Response) => {
  try {
    const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    const messages = (data.messages || [])
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.render("data-messages", {
      pageTitle: "Contact Messages",
      messages
    });
  } catch (error) {
    console.error("Error loading messages:", error);
    res.render("data-messages", {
      pageTitle: "Contact Messages",
      messages: []
    });
  }
});

app.get("/data/players", (_req: Request, res: Response) => {
  try {
    const data = JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf-8"));
    let players = (data.players || [])
      .sort((a: any, b: any) => b.score - a.score);

    // Get unique games
    const games = [...new Set(players.map((p: any) => p.game))].filter(Boolean);

    // Get unique player count
    const uniquePlayers = new Set(players.map((p: any) => p.name)).size;

    res.render("data-players", {
      pageTitle: "Game Scores",
      players,
      games,
      uniquePlayers
    });
  } catch (error) {
    console.error("Error loading players:", error);
    res.render("data-players", {
      pageTitle: "Game Scores",
      players: [],
      games: [],
      uniquePlayers: 0
    });
  }
});

// Contact form endpoint
app.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address"
      });
    }

    // Save message to file automatically
    const messageData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const messagesData = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
      messagesData.messages.push(messageData);
      
      // Keep only last 1000 messages
      if (messagesData.messages.length > 1000) {
        messagesData.messages = messagesData.messages.slice(-1000);
      }
      
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messagesData, null, 2));
      console.log(`Message saved from ${name} (${email})`);
    } catch (saveError) {
      console.error("Error saving message to file:", saveError);
      // Continue even if save fails
    }

    // Try to send email (optional - message is already saved)
    const emailUser = process.env.EMAIL_USER || "talb.arkan2003@gmail.com";
    const emailPass = process.env.EMAIL_PASS;

    if (emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass
          }
        });

        const mailOptions = {
          from: email,
          to: "talb.arkan2003@gmail.com",
          replyTo: email,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
          text: `
New Contact Form Submission

From: ${name} (${email})
Subject: ${subject}

Message:
${message}
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent for message from ${name}`);
      } catch (emailError) {
        console.error("Error sending email (message still saved):", emailError);
        // Don't fail the request if email fails - message is already saved
      }
    } else {
      console.log("Email not configured, but message saved to file");
    }

    res.json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later."
    });
  }
});

// Player data endpoints
interface PlayerData {
  name: string;
  game: string;
  score: number;
  timestamp: string;
}

// Save player score
app.post("/api/players", (req: Request, res: Response) => {
  try {
    const { name, game, score } = req.body;

    if (!name || !game || typeof score !== "number") {
      return res.status(400).json({
        success: false,
        error: "Invalid player data"
      });
    }

    // Read existing players
    const data = JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf-8"));
    
    // Add new player record
    const playerData: PlayerData = {
      name: name.trim(),
      game,
      score,
      timestamp: new Date().toISOString()
    };

    data.players.push(playerData);

    // Keep only last 1000 records to prevent file from growing too large
    if (data.players.length > 1000) {
      data.players = data.players.slice(-1000);
    }

    // Save to file
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(data, null, 2));

    res.json({
      success: true,
      message: "Player data saved successfully"
    });
  } catch (error) {
    console.error("Error saving player data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save player data"
    });
  }
});

// Get player scores (leaderboard)
app.get("/api/players", (req: Request, res: Response) => {
  try {
    const game = req.query.game as string;
    const limit = parseInt(req.query.limit as string) || 50;

    const data = JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf-8"));
    let players = data.players || [];

    // Filter by game if specified
    if (game) {
      players = players.filter((p: PlayerData) => p.game === game);
    }

    // Sort by score (descending) and limit
    players = players
      .sort((a: PlayerData, b: PlayerData) => b.score - a.score)
      .slice(0, limit);

    res.json({
      success: true,
      players
    });
  } catch (error) {
    console.error("Error reading player data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to read player data"
    });
  }
});

// Get all contact messages
app.get("/api/messages", (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;

    const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    let messages = data.messages || [];

    // Sort by timestamp (newest first) and limit
    messages = messages
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error("Error reading messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to read messages"
    });
  }
});

// Export messages as CSV (Excel-compatible)
app.get("/api/messages/export", (req: Request, res: Response) => {
  try {
    const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    let messages = data.messages || [];

    // Sort by timestamp (newest first)
    messages = messages.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Create CSV content
    const headers = ["Name", "Email", "Subject", "Message", "Date", "Time"];
    const csvRows = [headers.join(",")];

    messages.forEach((msg: any) => {
      const date = new Date(msg.timestamp);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();
      const row = [
        `"${msg.name.replace(/"/g, '""')}"`,
        `"${msg.email.replace(/"/g, '""')}"`,
        `"${msg.subject.replace(/"/g, '""')}"`,
        `"${msg.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${dateStr}"`,
        `"${timeStr}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="contact-messages-${Date.now()}.csv"`);
    res.setHeader("Content-Length", Buffer.byteLength(csvContent, "utf-8"));

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export messages"
    });
  }
});

// Export player data as CSV (Excel-compatible)
app.get("/api/players/export", (req: Request, res: Response) => {
  try {
    const game = req.query.game as string;

    const data = JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf-8"));
    let players = data.players || [];

    // Filter by game if specified
    if (game) {
      players = players.filter((p: PlayerData) => p.game === game);
    }

    // Sort by timestamp (newest first)
    players = players.sort((a: PlayerData, b: PlayerData) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Create CSV content
    const headers = ["Name", "Game", "Score", "Date", "Time"];
    const csvRows = [headers.join(",")];

    players.forEach((player: PlayerData) => {
      const date = new Date(player.timestamp);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();
      const row = [
        `"${player.name.replace(/"/g, '""')}"`,
        `"${player.game}"`,
        player.score,
        `"${dateStr}"`,
        `"${timeStr}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="player-scores-${Date.now()}.csv"`);
    res.setHeader("Content-Length", Buffer.byteLength(csvContent, "utf-8"));

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting player data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export player data"
    });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Player data stored in: ${PLAYERS_FILE}`);
  if (!process.env.EMAIL_PASS) {
    // eslint-disable-next-line no-console
    console.warn("⚠️  WARNING: EMAIL_PASS not set. Contact form emails will not work.");
  }
});


