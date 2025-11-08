require('dotenv').config();
const db = require('./db');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

db.all(`SELECT title, content FROM notes`, (err, rows) => {
  if (err) return console.error(err);
  if (!rows || rows.length === 0) return console.log("No notes to send");

  const note = rows[Math.floor(Math.random() * rows.length)];
  const msg = `📘 *${note.title}*\n\n${note.content}`;

  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, msg, { parse_mode: "Markdown" });
});
