import React, { useState } from "react";
import "./ScheduleEdit.css";

const ScheduleEdit = () => {
    const [group, setGroup] = useState("ПМИ-101");
    const [period, setPeriod] = useState("Осень 2025");
    const [schedule, setSchedule] = useState([
        { day: "Понедельник", subject: "Математика", time: "10:00" },
        { day: "Вторник", subject: "Физика", time: "12:00" },
    ]);

    return (
        <div className="schedule-container">
            <h1>Редактирование расписания</h1>

            <div className="selectors">
                <label>Группа</label>
                <input value={group} onChange={(e) => setGroup(e.target.value)} />

                <label>Период</label>
                <input value={period} onChange={(e) => setPeriod(e.target.value)} />
            </div>

            <h2>Расписание</h2>
            <div className="schedule-list">
                {schedule.map((item, i) => (
                    <div key={i} className="schedule-row">
                        <span>{item.day}</span>
                        <span>{item.subject}</span>
                        <span>{item.time}</span>
                    </div>
                ))}
            </div>

            <button>Сохранить расписание</button>
        </div>
    );
};

export default ScheduleEdit;