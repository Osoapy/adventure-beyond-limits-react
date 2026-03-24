import './App.scss';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/landingPage/LandingPage';
import SignUpPage from './pages/signUpPage/SignUpPage';
import LogInPage from './pages/logInPage/LogInPage';
import MyTeamsPage from './pages/myTeamsPage/MyTeamsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/my-teams" element={<MyTeamsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
