import React, { useState, useEffect } from "react";
import { addNote, polishNote, fetchTitles, fetchAllNotes, fetchRandomNote } from "../api";

const NoteForm = ({onNoteAdded}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");
  const [polished, setPolished] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notes, setNotes] = useState([]);
  const [randomNote, setRandomNote] = useState(null);

  useEffect(() => {
    const loadTitles = async () => {
      try {
        const data = await fetchTitles();
        setTitles(data.map((t) => t.title));
      } catch (err) {
        console.error("Error fetching titles", err);
      }
    };

    loadTitles();
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (value.trim() === "") {
      setFilteredTitles([]);
      setShowSuggestions(false);
      return;
    }

    const matches = titles.filter((title) =>
      title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTitles(matches.slice(0, 5)); // show top 5 matches
    setShowSuggestions(matches.length > 0);
  }

  const handleSelectTitle = (title) => {
    setTitle(title);
    setFilteredTitles([]);
    setShowSuggestions(false);
  }

  const handlePolish = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const polished = await polishNote(content);
      setPolished(polished);
    } catch (err) {
      console.error("Error polishing note", err);
      alert("Failed to polish note");
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (textToSave) => {
    const note = {
      title,
      content: textToSave,
      source,
      tags: tags.split(",").map(t => t.trim()),
    };
    setLoading(true);
    try{
      await addNote(note);
      alert("Note saved successfully");
      setTitle("");
      setContent("");
      setSource("");
      setTags("");
      setPolished("");
      if(onNoteAdded) onNoteAdded();
    } catch (err) {
      console.error("Error saving note", err);
      alert("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required");
    saveNote(content);
  };

  const getRandomNote = () => {
    fetchRandomNote().then(setRandomNote);
  }

  useEffect(() => {
    getRandomNote();
  }, []);

  return (
    <div style={{width: "100%", maxWidth: 600, margin: "auto"}}>
      <form onSubmit={handleSubmit} className="note-form">
        <div style={{position:"relative"}}>
          <input
            type="text"
            placeholder="Title*"
            value={title}
            // onChange={(e) => setTitle(e.target.value)}
            onChange={handleTitleChange}
            required
            style={{ width: "100%", padding: "8px" }}
            onFocus={() => title && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && filteredTitles.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "4px",
                border: "1px solid #ccc",
                position: "absolute",
                width: "100%",
                background: "#fff",
                zIndex: 10,
                maxHeight: "150px",
                overflowY: "auto"
              }}
            >
              {filteredTitles.map((t, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectTitle(t)}
                  style={{
                    padding: "6px 8px",
                    cursor: "pointer",
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        <textarea
          placeholder="Content*"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <div className="buttons" style={{display: "flex", gap: "10px", marginTop: "10px"}}>
          <button type="button" onClick={handlePolish} disabled={loading}>
            {loading ? "Polishing..." : "✨ Polish"}
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save note"}
          </button>
        </div>
      </form>
      {polished && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <h4>Polished note:</h4>
          <p>{polished}</p>
          <button
            onClick={() => saveNote(polished)}
            disabled={loading}
            style={{ marginTop: "10px"}}
          >Save polished note
          </button>
        </div>
      )}

      {/** --- Random note section --- */}
      {randomNote && (
        <div style={{ marginTop: "30px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px"}}>
          <h4>{randomNote.title}</h4>
          <p>{randomNote.content}</p>
          <small hidden={!randomNote.source}>Source: {randomNote.source}</small>
          <small hidden={!randomNote.tags?.length}>Tags: {randomNote.tags?.join(", ")}</small>
          <div style={{marginTop: "10px"}}>
            <button onClick={getRandomNote}>Re-randomize</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteForm;
