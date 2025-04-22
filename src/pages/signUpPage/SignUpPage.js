import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./signUpPage.css";
import aipomBackground from "../../assets/bananaBackground.jpg"
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setSuccess("Conta criada com sucesso!");
            sessionStorage.setItem("email", user.email.toLowerCase());
            navigate("/create-player");
        } catch (err) {
            console.error(err);
            setError("Erro ao criar conta.");
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <img className="form-background-img" src={aipomBackground}/>

                <main>
                    <h1>Sign Up</h1>

                    <label htmlFor="email">E-mail</label>
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

                    <label htmlFor="confirmPassword">Confirmar Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Criar Conta</button>
                </main>
            </form>
        </div>
    );
}
