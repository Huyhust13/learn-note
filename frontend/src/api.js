// src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL; // from .env

export const fetchRandomNote = async () => {
  const res = await axios.get(`${API_URL}/random_note`);
  return res.data;
};

export const addNote = async (note) => {
  const res = await axios.post(`${API_URL}/add_note`, note);
  return res.data;
};

export const polishNote = async (content) => {
  const res = await axios.post(`${API_URL}/polish`, { content });
  return res.data.polished;
};

export const fetchAllNotes = async () => {
  const res = await axios.get(`${API_URL}/all_notes`);
  console.log(res.data);
  return res.data;
};

export const fetchTitles = async () => {
  const res = await axios.get(`${API_URL}/titles`);
  return res.data;
};
