import React, { useState } from "react";

const API_BASE = "http://localhost:8080";

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
            localStorage.setItem("token", data.token); // сохраняем токен
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            onLogin();
        } catch (err) {
            setError("Ошибка входа");
        }
    };

    return (
        <div style={{
            maxWidth: 300,
            margin: "5rem auto",
            padding: "2rem",
            backgroundColor: "#fff",
            borderRadius: "1rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
            <h2>Вход</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    width: "100%",
                    marginBottom: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
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
                    marginBottom: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                    boxSizing: "border-box"
                }}
            />

            <button
                onClick={handleLogin}
                style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "#22c55e",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "0.5rem",
                    boxSizing: "border-box"
                }}
            >
                Войти
            </button>
        </div>
    );
};

export default LoginForm;