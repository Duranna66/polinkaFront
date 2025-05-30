import React, { useEffect, useState } from "react";
import "./ScheduleEdit.css";
import { getSchedule, saveSchedule, checkAuth } from "../api";
import { useNavigate } from "react-router-dom";

const ScheduleAdmin = () => {
    const [group, setGroup] = useState("ПМИ-101");
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth();
            } catch (err) {
                navigate("/auth");
            }
        };
        verifyAuth();
    }, [navigate]);

    const loadSchedule = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getSchedule(group);
            setSchedule(data);
        } catch (err) {
            setError("Ошибка при загрузке расписания");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...schedule];
        updated[index][field] = value;
        setSchedule(updated);
    };

    const addRow = () => {
        setSchedule([...schedule, { day: "", subject: "", time: "" }]);
    };

    const handleSave = async () => {
        try {
            const enriched = schedule.map((row) => ({
                ...row,
                group: group, // 👈 добавляем группу явно
            }));

            await saveSchedule(enriched);
            alert("Расписание сохранено");
        } catch (err) {
            alert("Расписание сохранено");
        }
    };

    return (
        <div className="schedule-container">
            <h1>Админка: редактирование расписания</h1>

            <div className="selectors">
                <label>Группа</label>
                <input
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                />
                <button onClick={loadSchedule} disabled={loading}>
                    Загрузить
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            <h2>Расписание</h2>
            <div className="schedule-list">
                {schedule.map((item, i) => (
                    <div key={i} className="schedule-row">
                        <input
                            value={item.day}
                            placeholder="День"
                            onChange={(e) => handleChange(i, "day", e.target.value)}
                        />
                        <input
                            value={item.subject}
                            placeholder="Предмет"
                            onChange={(e) => handleChange(i, "subject", e.target.value)}
                        />
                        <input
                            value={item.time}
                            placeholder="Время"
                            onChange={(e) => handleChange(i, "time", e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <button onClick={addRow}>Добавить строку</button>
            <button onClick={handleSave}>Сохранить расписание</button>
            <button onClick={() => navigate("/main")}>Вернуться в меню</button>
        </div>
    );
};

export default ScheduleAdmin;