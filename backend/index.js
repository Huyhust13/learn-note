require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const OpenAI = require('openai');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

// OpenAI client
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

async function polishText(content) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Giúp tôi viết lại câu input này cho mượt, hiệu chỉnh thông tin nếu phát hiện sau và làm cho nó thành một bài học, câu trả lời phải ngắn gọn, số lượng từ tương đương với câu đầu vào hoặc chỉ hơn kém nhau 20%:\n\n${content}` }
    ]
  })
  return response.choices[0].message.content;
}

// --- Routes ---

// Polish note with OpenAI
app.post('/polish', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  try {
    const polished = await polishText(content);
    res.json({ polished });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI error" });
  }
});

// Add note
app.post('/add_note', (req, res) => {
  const { title, content, source, tags } = req.body;
  const tagsStr = Array.isArray(tags) ? tags.join(",") : "";
  db.run(
    `INSERT INTO notes (title, content, source, tags) VALUES (?, ?, ?, ?)`,
    [title, content, source, tagsStr],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "ok", id: this.lastID });
    }
  );
});

// Random note
app.get('/random_note', (req, res) => {
  db.all(`SELECT id, title, content, source FROM notes`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    const note = rows[Math.floor(Math.random() * rows.length)];
    res.json(note);
  });
});

// Get all note
app.get('/all_notes', (req, res) => {
  db.all(`SELECT id, title, content, source FROM notes`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    res.json(rows);
  })
})

app.get("/titles", (req, res) => {
  db.all(`SELECT id, title FROM notes ORDER BY date_added DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    res.json(rows);
  });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${port}`);
});
