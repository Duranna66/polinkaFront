import React from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();

    const modules = [
        { label: "Профиль", path: "/profile" },
        { label: "Расписание", path: "/schedule" },
        { label: "Оценки", path: "/grades" },
        { label: "Заявки", path: "/documents" },
    ];

    return (
        <div className="main-container">
            <h1>Главное меню</h1>

            <div className="intro-text">
                <p>
                    Это внутренний интерфейс для сотрудников и студентов МГТУ "СТАНКИН" — Московского государственного технологического университета «СТАНКИН», ведущего вуза в области машиностроения, информационных технологий и цифрового инжиниринга.
                </p>
                <p>
                    Через данную систему вы можете: просматривать личную информацию, вносить оценки, редактировать расписание, подавать заявки на документы и многое другое.
                </p>
            </div>

            <div className="button-grid">
                {modules.map((mod, idx) => (
                    <button key={idx} onClick={() => navigate(mod.path)}>
                        {mod.label}
                    </button>
                ))}
            </div>
        </div>
    );
}