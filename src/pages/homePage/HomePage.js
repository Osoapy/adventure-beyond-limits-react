import './HomePage.css';
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    function navigateToPage(url) {
        navigate(url);
    }

    return (
        <div className="homepage-container">
        <header className="app-bar">
            <div className="app-bar-title">Pokédex</div>
            <div className="app-bar-buttons">
            <button className="app-bar-button" onClick={() => navigateToPage("/signup")}>Sign Up</button>
            <button className="app-bar-button" onClick={() => navigateToPage("/login")}>Log In</button>
            </div>
        </header>
        <main className="homepage-content">
            <h1>Bem-vindo ao mundo Pokémon!</h1>
            <p>Escolha seu parceiro e comece sua jornada!</p>
        </main>
        </div>
    );
}
