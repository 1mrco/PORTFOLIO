import express, { Request, Response } from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { kv } from "@vercel/kv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if running on Vercel
const isVercel = !!process.env.VERCEL;

// Data storage - use KV on Vercel, files locally
const DATA_DIR = isVercel ? "/tmp" : path.join(process.cwd(), "data");
const PLAYERS_FILE = path.join(DATA_DIR, "players.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CERTIFICATES_FILE = path.join(DATA_DIR, "certificates.json");

// Helper function to read from KV or file
async function readData(key: string, filePath: string, defaultValue: any): Promise<any> {
  // Try Vercel KV first if available
  if (isVercel && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const data = await kv.get(key);
      if (data) return data;
    } catch (error) {
      console.error(`Error reading from KV (${key}):`, error);
    }
  }
  
  // Fallback to file system (works locally and in /tmp on Vercel)
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (error) {
    console.error(`Error reading file (${filePath}):`, error);
  }
  
  return defaultValue;
}

// Helper function to write to KV or file
async function writeData(key: string, filePath: string, data: any): Promise<void> {
  // Try Vercel KV first if available
  if (isVercel && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      await kv.set(key, data);
      console.log(`Data saved to KV: ${key}`);
      return; // Successfully saved to KV
    } catch (error) {
      console.error(`Error writing to KV (${key}):`, error);
      // Fall through to file system
    }
  }
  
  // Fallback to file system (works locally and in /tmp on Vercel)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file (${filePath}):`, error);
    // Log data to console as last resort (for debugging)
    console.log(`Data that failed to save (${key}):`, JSON.stringify(data, null, 2));
  }
}

// Initialize data storage
if (!isVercel) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
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

app.get("/projects", async (_req: Request, res: Response) => {
  try {
    const data = await readData("projects", PROJECTS_FILE, { projects: [] });
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

app.get("/certificates", async (_req: Request, res: Response) => {
  try {
    const data = await readData("certificates", CERTIFICATES_FILE, { certificates: [] });
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
app.get("/data/messages", async (_req: Request, res: Response) => {
  try {
    const data = await readData("messages", MESSAGES_FILE, { messages: [] });
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

app.get("/data/players", async (_req: Request, res: Response) => {
  try {
    const data = await readData("players", PLAYERS_FILE, { players: [] });
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
      const messagesData = await readData("messages", MESSAGES_FILE, { messages: [] });
      messagesData.messages.push(messageData);
      
      // Keep only last 1000 messages
      if (messagesData.messages.length > 1000) {
        messagesData.messages = messagesData.messages.slice(-1000);
      }
      
      await writeData("messages", MESSAGES_FILE, messagesData);
      console.log(`Message saved from ${name} (${email})`);
    } catch (saveError) {
      console.error("Error saving message:", saveError);
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
app.post("/api/players", async (req: Request, res: Response) => {
  try {
    const { name, game, score } = req.body;

    if (!name || !game || typeof score !== "number") {
      return res.status(400).json({
        success: false,
        error: "Invalid player data"
      });
    }

    // Read existing players
    const data = await readData("players", PLAYERS_FILE, { players: [] });
    
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

    // Save to storage
    await writeData("players", PLAYERS_FILE, data);

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
app.get("/api/players", async (req: Request, res: Response) => {
  try {
    const game = req.query.game as string;
    const limit = parseInt(req.query.limit as string) || 50;

    const data = await readData("players", PLAYERS_FILE, { players: [] });
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
app.get("/api/messages", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;

    const data = await readData("messages", MESSAGES_FILE, { messages: [] });
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
app.get("/api/messages/export", async (req: Request, res: Response) => {
  try {
    const data = await readData("messages", MESSAGES_FILE, { messages: [] });
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
app.get("/api/players/export", async (req: Request, res: Response) => {
  try {
    const game = req.query.game as string;

    const data = await readData("players", PLAYERS_FILE, { players: [] });
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

// Export app for Vercel serverless functions
module.exports = app;

// Only listen if running locally (not on Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
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
}


