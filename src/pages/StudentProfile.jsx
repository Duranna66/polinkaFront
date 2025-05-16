import React from "react";
import "./StudentProfile.css";

const mockedData = {
    name: "Иванов Иван",
    group: "ПМИ-101",
    birthDate: "2002-05-16",
    grades: [
        { subject: "Математика", grade: "5" },
        { subject: "Физика", grade: "4" },
        { subject: "Информатика", grade: "5" },
    ],
};

export default function StudentProfile() {
    return (
        <div className="profile-container">
            <h1>Профиль студента</h1>
            <div className="info-block">
                <label>ФИО</label>
                <input value={mockedData.name} readOnly />

                <label>Группа</label>
                <input value={mockedData.group} readOnly />

                <label>Дата рождения</label>
                <input value={mockedData.birthDate} readOnly />
            </div>

            <h2>Оценки</h2>
            <div className="grades-list">
                {mockedData.grades.map((g, i) => (
                    <div key={i} className="grade-row">
                        <span>{g.subject}</span>
                        <span>{g.grade}</span>
                    </div>
                ))}
            </div>

            <button>Редактировать профиль</button>
        </div>
    );
}