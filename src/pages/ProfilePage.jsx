import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import {getCart, removeFromCart} from "../api";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (user?.email) {
            getCart(user.email)
                .then(setCartItems)
                .catch(() => setCartItems([]));
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };


    const handleRemove = (carId) => {
        if (!user?.email) return;

        removeFromCart(user.email, carId)
            .then(() => {
                setCartItems((prev) => prev.filter(item => item.id !== carId));
            })
            .catch(() => alert("Ошибка при удалении"));
    };

    return (
        <main className="profile-container">
            <div className="profile-card">
                <h2>👋 Добро пожаловать{user?.name ? `, ${user.name}` : ""}!</h2>
                <p>Вы успешно вошли в личный кабинет.</p>
                <button className="logout-btn" onClick={handleLogout}>Выйти</button>

                <hr style={{ margin: "30px 0" }} />

                <h3>🛒 Ваши товары в корзине:</h3>
                {cartItems.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <ul className="cart-list">
                        {cartItems.map((item) => (
                            <li key={item.id} className="cart-item">
                                <span><strong>{item.model}</strong> — {item.price.toLocaleString()} ₽</span>
                                <button onClick={() => handleRemove(item.id)} className="remove-btn">❌</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;