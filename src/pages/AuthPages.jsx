import React, { useState } from "react";
import "./AuthPages.css";

export default function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (username && password) {
            alert("Успешный вход (замокано)");
        } else {
            alert("Введите логин и пароль");
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
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
}