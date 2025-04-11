import './standardHeader.css';

export default function StandardHeader({ children }) {
    return (
        <header className="app-bar">
            <h1 className="app-bar-title">Pokémon Aventuras Além Dos Limites</h1>
            <nav className="app-bar-buttons">
                { children }
            </nav>
        </header>
    );
}