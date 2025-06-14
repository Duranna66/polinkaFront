import React, { useState } from "react";
import "./AuthPages.css";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Введите логин и пароль");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await loginUser({ email: username, password });
            navigate("/main");
        } catch (err) {
            setError("Неверный логин или пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Вход в систему</h2>

            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="auth-error">{error}</p>}

            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Вход..." : "Войти"}
            </button>
        </div>
    );
}