import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NoteDetails from "./pages/NoteDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/note/:id" element={<NoteDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
