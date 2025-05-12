import React, { useEffect, useState } from "react";
import "./TopNavbar.css";
import { Link } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";
import { getCart } from "../api";

const TopNavbar = ({ user, setUser, localCars }) => {
    const [cartCount, setCartCount] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };



    useEffect(() => {
        if (user?.email) {
            getCart(user.email).then((items) => {
                setCartCount(items.length);
            });
        }
    }, [user]);

    return (
        <>
            <header className="site-header">
                <div className="logo">
                    <Link to="/">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Renault_2021.svg/500px-Renault_2021.svg.png"
                            alt="Renault Logo"
                        />
                    </Link>
                </div>
                <div className="header-text">
                    <h1>Автосалон RENAULT</h1>
                    <p>Официальный дилер Renault в вашем городе</p>
                </div>
            </header>
            <hr />

            <nav className="menu-wrapper">
                <ul className="menu">
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/catalog">Каталог</Link></li>
                    <li><Link to="/contacts">Контакты</Link></li>
                    <li>
                        {user ? (
                            <Link to="/profile" className="user-link">
                                👤 {user.name}
                                {cartCount > 0 && (
                                    <span className="cart-count">+{cartCount}</span>
                                )}
                            </Link>
                        ) : (
                            <Link to="/login">Личный кабинет</Link>
                        )}
                    </li>
                </ul>
                <div className="toolbar-right">
                    <SearchAutocomplete localCars={localCars} />
                </div>
            </nav>
        </>
    );
};

export const Footer = () => {
    return (
        <footer>
            <hr />
            <Link to="/legal">
                <button>&copy; 2025 Автосалон RENAULT. Все права защищены.</button>
            </Link>
        </footer>
    );
};

export default TopNavbar;