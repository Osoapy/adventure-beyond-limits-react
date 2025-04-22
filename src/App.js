import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from './pages/signUpPage/SignUpPage';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/logInPage/LogInPage';
import MyAccountPage from './pages/myAccountPage/MyAccountPage';
import CreatePlayer from './pages/createPlayer/CreatePlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/create-player" element={<CreatePlayer />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MyAccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
