import { useNavigate } from 'react-router-dom';
import styles from './signUpButton.module.scss';

export default function SignUpButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/signup')} className={styles["signUp-button"]}>
            Sign Up
        </button>
    );
}