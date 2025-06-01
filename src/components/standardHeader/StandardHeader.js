import './standardHeader.css';
import aipomLogo from '../../assets/aipomLogo.png';
import aipomTitle from '../../assets/aipomDex.png';

export default function StandardHeader({ children }) {
    return (
        <header className="app-bar">
            <div className="app-bar-background"></div>
            <img className="app-bar-site-icon" src={aipomLogo}/>
            <img className="app-bar-site-title" src={aipomTitle}/>
            <nav className="app-bar-buttons">
                { children }
            </nav>
        </header>
    );
}