import React, { useState } from "react";

const API_BASE = "/api";

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                setError("Неверный логин или пароль");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            onLogin();
        } catch {
            setError("Ошибка входа");
        }
    };

    return (
        <div
            style={{
                maxWidth: 420,
                margin: "6rem auto",
                padding: "2.5rem",
                background: "linear-gradient(to bottom right, #3b0764, #4c1d95)",
                color: "#fff",
                borderRadius: "1.5rem",
                boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "1.8rem", fontSize: "1.8rem", color: "#f3e8ff" }}>
                🌙 Вход
            </h2>

            {error && <p style={{ color: "#f87171", marginBottom: "1rem" }}>{error}</p>}

            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    width: "100%",
                    marginBottom: "1rem",
                    padding: "0.85rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #a855f7",
                    backgroundColor: "#1e1b4b",
                    color: "#fff",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box"
                }}
            />

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: "100%",
                    marginBottom: "1.25rem",
                    padding: "0.85rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #a855f7",
                    backgroundColor: "#1e1b4b",
                    color: "#fff",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box"
                }}
            />

            <button
                onClick={handleLogin}
                style={{
                    width: "100%",
                    padding: "0.9rem",
                    backgroundColor: "#c084fc",
                    color: "#1a001f",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    border: "none",
                    borderRadius: "0.75rem",
                    boxShadow: "0 0 12px rgba(199, 84, 255, 0.5)",
                    cursor: "pointer",
                    boxSizing: "border-box"
                }}
            >
                Войти
            </button>
        </div>
    );
};

export default LoginForm;