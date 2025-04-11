import { useNavigate } from 'react-router-dom';

export default function SignUpButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/signup')} className="app-bar-button">
            Sign Up
        </button>
    );
}