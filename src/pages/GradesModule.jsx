import React, { useEffect, useState } from "react";
import "./GradesModule.css";
import {
    getGrades,
    saveGrades,
    checkAuth,
    getAllStudents,
    getStudentProfile,
} from "../api";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const GradesAdminModule = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grades, setGrades] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [group, setGroup] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    const [newSubject, setNewSubject] = useState("");
    const [newGrade, setNewGrade] = useState("");

    const navigate = useNavigate();
    const validGrades = ["2", "3", "4", "5"];

    useEffect(() => {
        const init = async () => {
            try {
                await checkAuth();
                const all = await getAllStudents();
                setStudents(all);
            } catch (err) {
                navigate("/auth");
            }
        };
        init();
    }, [navigate]);

    const handleLoadGrades = async () => {
        if (!selectedStudent) return;

        setLoading(true);
        setError("");
        try {
            const [studentGrades, profile] = await Promise.all([
                getGrades(selectedStudent.value),
                getStudentProfile(selectedStudent.value),
            ]);

            const groupName = profile.group;
            setGroup(groupName);
            setStudentName(profile.fullName);

            const enriched = studentGrades.map((g) => ({
                ...g,
                group: groupName,
            }));

            setGrades(enriched);
        } catch (err) {
            setError("Ошибка при загрузке оценок");
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (index, newGrade) => {
        const updated = [...grades];
        updated[index].grade = newGrade;
        setGrades(updated);
    };

    const handleAddGrade = () => {
        if (!newSubject.trim() || !validGrades.includes(newGrade.trim())) {
            setFormError("Введите предмет и корректную оценку (2–5)");
            return;
        }

        setGrades([...grades, {
            subject: newSubject.trim(),
            grade: newGrade.trim(),
            group: group
        }]);

        setNewSubject("");
        setNewGrade("");
        setFormError("");
    };

    const handleSave = async () => {
        const invalid = grades.find(
            (g) => !g.subject.trim() || !validGrades.includes(g.grade.trim())
        );

        if (invalid) {
            alert("Некорректные значения в списке оценок");
            return;
        }

        try {
            const enrichedGrades = grades.map((g) => ({
                ...g,
                group: group,
            }));

            await saveGrades(selectedStudent.value, enrichedGrades);
            alert("Оценки сохранены");
        } catch (err) {
            alert("Оценки сохранены");
        }
    };

    const studentOptions = students.map((s) => ({
        value: s.id,
        label: s.fullName,
    }));

    return (
        <div className="grades-container">
            <h1>Админка: ведомость успеваемости</h1>

            <div className="selectors">
                <label>Выберите студента</label>
                <Select
                    options={studentOptions}
                    value={selectedStudent}
                    onChange={setSelectedStudent}
                    placeholder="Найти по имени..."
                    isSearchable
                />
                <button
                    onClick={handleLoadGrades}
                    disabled={loading || !selectedStudent}
                >
                    Загрузить оценки
                </button>
            </div>

            {error && <p className="error">{error}</p>}
            {loading && <p>Загрузка...</p>}

            {grades.length > 0 && (
                <>
                    <div className="selectors">
                        <label>Студент</label>
                        <input value={studentName} readOnly />
                        <label>Группа</label>
                        <input value={group} readOnly />
                    </div>

                    <h2>Оценки</h2>
                    <div className="grades-list">
                        {grades.map((item, i) => (
                            <div key={i} className="grade-row">
                                <span>{item.subject}</span>
                                <input
                                    value={item.grade}
                                    onChange={(e) =>
                                        handleGradeChange(i, e.target.value)
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <h3>Добавить оценку</h3>
                    <div className="add-grade-row">
                        <input
                            type="text"
                            placeholder="Предмет"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Оценка (2–5)"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                        />
                        <button onClick={handleAddGrade}>Добавить</button>
                    </div>
                    {formError && <p className="error">{formError}</p>}

                    <button onClick={handleSave}>Сохранить оценки</button>
                </>
            )}

            <button onClick={() => navigate("/main")}>Вернуться в меню</button>
        </div>
    );
};

export default GradesAdminModule;