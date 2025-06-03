import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import littleAipom from "../../assets/littleAipom.png";
import "./logInPage.css";

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
            navigate("/main");
        } catch (err) {
            console.error(err);
            setError("Email ou senha inválidos.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <main>
                    <div className="title-and-logo"> 
                        <h1>Log In</h1>

                        <img className="signup-form-img" src={littleAipom} alt="Little Aipom" />
                    </div>
                    {error && <p className="error-msg">{error}</p>}

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
