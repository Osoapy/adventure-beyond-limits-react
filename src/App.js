import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlayerSheet from './components/playerSheet/PlayerSheet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="App"><PlayerSheet></PlayerSheet></div>} />
      </Routes>
    </Router>
  );
}

export default App;
