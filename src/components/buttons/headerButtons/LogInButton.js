import { useNavigate } from 'react-router-dom';

export default function LogInButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/login')} className="app-bar-button">
            Log In
        </button>
    );
}