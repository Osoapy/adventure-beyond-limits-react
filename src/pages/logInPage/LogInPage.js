import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../database/firebase";
import { useNavigate } from "react-router-dom";
import littleAipom from "../../assets/images/littleAipom.png";
import styles from "./logInPage.module.scss";

export default function LogInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Usuário logado:", user);
            sessionStorage.setItem("email", email);
            navigate("/my-teams");
        } catch (err) {
            console.error(err);
            setError("Email ou senha inválidos.");
        }
    };

    return (
        <div className={styles["login-container"]}>
            <form onSubmit={handleSubmit} className={styles["login-form"]}>
                <main>
                    <div className={styles["title-and-logo"]}> 
                        <h1>Log In</h1>

                        <img src={littleAipom} alt="Little Aipom" />
                    </div>
                    {error && <p className={styles["error-msg"]}>{error}</p>}

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Entrar</button>
                </main>
            </form>
        </div>
    );
}
