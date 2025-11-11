require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const TelegramBot = require('node-telegram-bot-api');
const apiLogger = require('./logger');
const api = require('./api');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

app.use(apiLogger);
app.use(api)

// --- Routes ---

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});
