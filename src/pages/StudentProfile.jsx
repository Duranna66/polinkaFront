import React, { useEffect, useState } from "react";
import "./StudentProfile.css";
import { useNavigate } from "react-router-dom";
import {
    getStudentProfile,
    getGrades,
    checkAuth,
    updateStudentProfile,
    getAllStudents,
    createStudentProfile,
} from "../api";

export default function StudentProfileAdmin() {
    const [students, setStudents] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [profile, setProfile] = useState(null);
    const [grades, setGrades] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

    const handleLoad = async () => {
        if (!selectedId) return;

        setLoading(true);
        setError("");
        try {
            const profileData = await getStudentProfile(selectedId);
            const gradesData = await getGrades(selectedId);
            setProfile(profileData);
            setGrades(gradesData);
            setEditMode(false);
        } catch (err) {
            setError("Ошибка при загрузке студента");
            setProfile(null);
            setGrades([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setSelectedId("");
        setProfile({
            fullName: "",
            group: "",
            birthDate: "",
        });
        setGrades([]);
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            if (!profile.fullName || !profile.group || !profile.birthDate) {
                alert("Все поля обязательны");
                return;
            }

            if (selectedId) {
                await updateStudentProfile(selectedId, profile);
                alert("Профиль обновлён");
            } else {
                await createStudentProfile(profile);
                alert("Студент создан");
            }

            setEditMode(false);
            const updated = await getAllStudents();
            setStudents(updated);
        } catch (err) {
            alert("Студент создан");
        }
    };

    const handleChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="profile-container">
            <h1>Админ-панель: Профиль студента</h1>

            <div className="search-section">
                <label>Выберите студента:</label>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    <option value="">-- Выберите --</option>
                    {students.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.fullName}
                        </option>
                    ))}
                </select>

                <button onClick={handleLoad} disabled={loading || !selectedId}>
                    Загрузить
                </button>

                <button onClick={handleCreateNew}>Создать нового</button>

                {error && <p className="error">{error}</p>}
            </div>

            {loading && <p>Загрузка...</p>}

            {profile && (
                <div className="info-block">
                    <label>ФИО</label>
                    <input
                        value={profile.fullName}
                        readOnly={!editMode}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                    />

                    <label>Группа</label>
                    <input
                        value={profile.group}
                        readOnly={!editMode}
                        onChange={(e) => handleChange("group", e.target.value)}
                    />

                    <label>Дата рождения</label>
                    <input
                        value={profile.birthDate}
                        readOnly={!editMode}
                        onChange={(e) => handleChange("birthDate", e.target.value)}
                    />

                    {editMode ? (
                        <button onClick={handleSave}>Сохранить</button>
                    ) : (
                        <button onClick={() => setEditMode(true)}>Редактировать</button>
                    )}
                </div>
            )}

            <button onClick={() => navigate("/main")}>Вернуться в меню</button>
        </div>
    );
}