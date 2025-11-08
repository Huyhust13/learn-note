import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import favicon from './assets/favicon.png';
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}> Add Note</Link>
        <Link to="/notes" >All Notes</Link>
      </nav>

      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<NoteForm />} />
          <Route path="/notes" element={<NoteList />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
