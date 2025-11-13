import React, { useState, useEffect } from "react";
import { addNote, polishNote, fetchTitles, fetchAllNotes, fetchRandomNote, fetchTags, fetchSources } from "../api";

const NoteForm = ({onNoteAdded}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");
  const [polished, setPolished] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [sources, setSources] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [filterSources, setFilterSources] = useState([]);
  const [tag, setTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [filterTags, setFilterTags] = useState([]);

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

    const loadSources = async () => {
      try {
        const data = await fetchSources();
        setSources(data.map((n) => n.source));
      } catch (err) {
        console.error("Error fetching sources", err);
      }
    }

    const loadTags = async () => {
      try {
        const data = await fetchTags();
        setAllTags(data);
        console.log("tags: ", allTags);
      } catch (err) {
        console.error("Error fetching tags", err);
      }
    }

    loadTitles();
    loadSources();
    loadTags();
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (value.trim() === "") {
      setFilteredTitles([]);
      setShowTitleSuggestions(false);
      return;
    }

    const matches = titles.filter((title) =>
      title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTitles(matches.slice(0, 5)); // show top 5 matches
    setShowTitleSuggestions(matches.length > 0);
  }

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);

    if (value.trim() === "") {
      setFilterSources([]);
      setShowSourceSuggestions(false);
      return;
    }

    const matchs = sources.filter((source) =>
      source.toLowerCase().includes(value.toLowerCase())
    );
    setFilterSources(matchs.slice(0, 5)); // show top 5 matches
    setShowSourceSuggestions(matchs.length > 0);
  }

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags(value);

    if (value.trim() === "") {
      setFilterTags([]);
      setShowTagSuggestions(false);
      return;
    }
    const latestTag = value.split(",").pop().trim();
    if (allTags.length === 0) return;
    const matchs = allTags.filter((tag) =>
      tag?.toLowerCase().includes(latestTag.toLowerCase())
    );

    setFilterTags(matchs.slice(0, 5)); // show top 5 matches
    setShowTagSuggestions(matchs.length > 0);
  }

  const handleSelectTitle = (title) => {
    setTitle(title);
    setFilteredTitles([]);
    setShowTitleSuggestions(false);
  }

  const handleSelectSource = (source) => {
    setSource(source);
    setFilterSources([]);
    setShowSourceSuggestions(false);
  }

  const handleSelectTag = (tag) => {
    setTag(tag);
    setFilterTags([]);
    setShowTagSuggestions(false);
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
            onFocus={() => title && setShowTitleSuggestions(true)}
            onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 200)}
          />
          {showTitleSuggestions && filteredTitles.length > 0 && (
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
          onChange={handleSourceChange}
          style={{ width: "100%", padding: "8px" }}
          onFocus={() => source && setShowSourceSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSourceSuggestions(false, 200))}
        />
        {showSourceSuggestions && filterSources.length > 0 && (
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
            {filterSources.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelectSource(s)}
                // onKeyDown={() => handleSelectSource(t)}
                style={{
                  padding: "6px 8px",
                  cursor: "pointer"
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={handleTagChange}
          style={{ width: "100%", padding: "8px" }}
          onFocus={() => tag && setShowTagSuggestions(true)}
          onBlur={() => setTimeout(() => setShowTagSuggestions(false, 200))}
        />
        {showTagSuggestions && filterTags.length > 0 && (
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
            {filterTags.map((t, i) => (
              <li
                key={i}
                onClick={() => handleSelectTag(t)}
                // onKeyDown={() => handleSelectSource(t)}
                style={{
                  padding: "6px 8px",
                  cursor: "pointer"
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {t}
              </li>
            ))}
          </ul>
        )}

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
