import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api"; // убедись, что эти функции есть в api.js
import "./LoginForm.css";

const LoginRegisterForm = ({ setUser }) => {
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleTabSwitch = (tab) => setActiveTab(tab);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser(loginData);
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user)); // 👉 Сохраняем в localStorage
            navigate("/profile");
        } catch (err) {
            setMessage("❌ Неверный логин или пароль");
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(registerData);
            setMessage("✅ Регистрация успешна! Теперь войдите.");
            setActiveTab("login");
        } catch (err) {
            setMessage("❌ Ошибка регистрации");
        }
    };

    const handleInputChange = (e, isLogin = true) => {
        const { name, value } = e.target;
        isLogin
            ? setLoginData({ ...loginData, [name]: value })
            : setRegisterData({ ...registerData, [name]: value });
    };

    return (
        <main className="auth-container">
            <div className="auth-tabs">
                <button
                    className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => handleTabSwitch("login")}
                >
                    Вход
                </button>
                <button
                    className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => handleTabSwitch("register")}
                >
                    Регистрация
                </button>
            </div>

            {activeTab === "login" && (
                <div className="tab-content active">
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <h2>Вход в личный кабинет</h2>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={(e) => handleInputChange(e, true)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Пароль:</label>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={(e) => handleInputChange(e, true)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-btn">Войти</button>
                        {message && <p className="login-message">{message}</p>}
                    </form>
                </div>
            )}

            {activeTab === "register" && (
                <div className="tab-content active">
                    <form className="auth-form" onSubmit={handleRegisterSubmit}>
                        <h2>Регистрация</h2>
                        <div className="form-group">
                            <label>Имя:</label>
                            <input type="text" name="name" value={registerData.name} onChange={(e) => handleInputChange(e, false)} required />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" value={registerData.email} onChange={(e) => handleInputChange(e, false)} required />
                        </div>
                        <div className="form-group">
                            <label>Пароль:</label>
                            <input type="password" name="password" value={registerData.password} onChange={(e) => handleInputChange(e, false)} required />
                        </div>
                        <button type="submit" className="auth-btn">Зарегистрироваться</button>
                    </form>
                </div>
            )}
        </main>
    );
};

export default LoginRegisterForm;