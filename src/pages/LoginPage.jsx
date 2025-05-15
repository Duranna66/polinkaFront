import { useState } from "react";
import API from "./../api/authFetch";
import "./LoginPage.css";

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data);
            onLoginSuccess();
        } catch (err) {
            alert("Ошибка входа");
            console.error(err);
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-form" onSubmit={handleLogin}>
                <h2 className="login-title">Вход в систему</h2>
                <input
                    className="login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Логин"
                    required
                />
                <input
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Пароль"
                    required
                />
                <button className="login-button" type="submit">Войти</button>
            </form>
        </div>
    );
}

export default LoginPage;