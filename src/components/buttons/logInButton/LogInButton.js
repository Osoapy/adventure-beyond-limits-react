import { useNavigate } from 'react-router-dom';
import styles from './logInButton.module.scss';

export default function LogInButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/login')} className={styles["logIn-button"]}>
            Log In
        </button>
    );
}