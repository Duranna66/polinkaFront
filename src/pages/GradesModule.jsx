import React, { useState } from "react";
import "./GradesModule.css";

const GradesModule = () => {
    const [student, setStudent] = useState("Иванов Иван");
    const [group, setGroup] = useState("ПМИ-101");
    const [grades, setGrades] = useState([
        { subject: "Математика", grade: "5" },
        { subject: "Физика", grade: "4" },
    ]);

    return (
        <div className="grades-container">
            <h1>Ведомость успеваемости</h1>

            <div className="selectors">
                <label>Студент</label>
                <input value={student} onChange={(e) => setStudent(e.target.value)} />

                <label>Группа</label>
                <input value={group} onChange={(e) => setGroup(e.target.value)} />
            </div>

            <h2>Оценки</h2>
            <div className="grades-list">
                {grades.map((item, i) => (
                    <div key={i} className="grade-row">
                        <span>{item.subject}</span>
                        <input value={item.grade} onChange={() => {}} />
                    </div>
                ))}
            </div>

            <button>Сохранить оценки</button>
        </div>
    );
};

export default GradesModule;