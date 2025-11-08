import React, {useEffect, useState} from "react";
import axios from "axios";
import {fetchAllNotes} from "../api";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const notes = await fetchAllNotes();
      setNotes(notes);
    } catch (err) {
      console.error("Error fetching notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Notes</h2>
      {loading ? (
        <p>Loading...</p>
      ) :  notes.length === 0 ? (<p>No notes found</p>) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <strong>{note.title}</strong> -- {note.content} <br />
              <em hidden={!note.source}>Source: {note.source}</em> <br />
              <em hidden={!note.tags?.length}>Tags: {note.tags}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NoteList
