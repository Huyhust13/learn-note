const express = require("express");
const router = express.Router();
const db = require("./db");
const { polishText } = require('./services/openai');

router.post("/polish", async (req, res) => {
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
router.post('/add_note', (req, res) => {
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
router.get('/random_note', (req, res) => {
  db.all(`SELECT id, title, content, source FROM notes`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    const note = rows[Math.floor(Math.random() * rows.length)];
    res.json(note);
  });
});

// Get all note
router.get('/all_notes', (req, res) => {
  db.all(`SELECT id, title, content, tags, source FROM notes`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    res.json(rows);
  })
})

router.get("/titles", (req, res) => {
  db.all(`SELECT id, title FROM notes ORDER BY date_added DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    res.json(rows);
  });
});

router.get("/sources", (req, res) => {
  db.all(`SELECT id, source FROM notes ORDER BY date_added DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    res.json(rows);
  });
})

router.get("/tags", (req, res) => {
  db.all(`SELECT id, tags FROM notes ORDER BY date_added DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "No notes found" });
    let tags = [];
    rows.forEach(row => {
      if (row.tags !== '') {
        tags = tags.concat(row.tags.split(","));
      }
    });
    tags = tags.filter((tag, index) => tags.indexOf(tag) === index);
    res.json(tags);
  });
})

module.exports = router;
