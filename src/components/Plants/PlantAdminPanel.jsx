import React, { useState } from "react";
import authFetch from "../../api/authFetch";

const PlantAdminPanel = ({ plants, onRefresh }) => {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [formData, setFormData] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg, color = "#22c55e") => {
        setToastMessage({ msg, color });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSelect = (plant) => {
        setSelectedPlant(plant);
        setFormData({
            name: plant.name,
            type: plant.type,
            description: plant.description,
            username: plant.username,
            region: plant.region
        });
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleUpdate = async () => {
        try {
            await authFetch(`http://localhost:8080/plants/${selectedPlant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            showToast("✅ Растение обновлено");
            setSelectedPlant(null);
            onRefresh();
        } catch {
            showToast("❌ Ошибка при обновлении", "red");
        }
    };

    const handleDelete = async () => {

            try {
                await authFetch(`http://localhost:8080/plants/${selectedPlant.id}`, {
                    method: "POST",
                });
                showToast("🗑️ Удалено");
                setSelectedPlant(null);
                onRefresh();
            } catch {
                showToast("❌ Ошибка при удалении", "red");
            }
    };

    return (
        <div className="card" style={{ padding: "2rem", marginTop: "3rem", position: "relative" }}>
            <h2>✏️ Удалить / Редактировать растение</h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                {plants.map((plant) => (
                    <div
                        key={plant.id}
                        onClick={() => handleSelect(plant)}
                        style={{
                            border: "2px solid green",
                            padding: "1rem",
                            borderRadius: "1rem",
                            cursor: "pointer",
                            backgroundColor: selectedPlant?.id === plant.id ? "#a7f3d0" : "transparent",
                        }}
                    >
                        <strong>{plant.name}</strong>
                        <div>{plant.type}</div>
                        <div>{plant.description}</div>
                        <div>{plant.username} — {plant.region}</div>
                    </div>
                ))}
            </div>

            {selectedPlant && (
                <div>
                    <h3>Редактировать «{selectedPlant.name}»</h3>

                    <label>Название</label>
                    <input
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="admin-input"
                    />

                    <label>Тип</label>
                    <input
                        value={formData.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                        className="admin-input"
                    />

                    <label>Описание</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="admin-input"
                    />

                    <label>Имя пользователя (username)</label>
                    <input
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        className="admin-input"
                    />

                    <label>Регион</label>
                    <input
                        value={formData.region}
                        onChange={(e) => handleChange("region", e.target.value)}
                        className="admin-input"
                    />

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            onClick={handleUpdate}
                            style={{
                                backgroundColor: "#22c55e",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                            }}
                        >
                            Сохранить изменения
                        </button>

                        <button
                            onClick={handleDelete}
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                            }}
                        >
                            Удалить растение
                        </button>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "2rem",
                        right: "2rem",
                        backgroundColor: toastMessage.color,
                        color: "white",
                        padding: "1rem 1.5rem",
                        borderRadius: "0.75rem",
                        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                        fontWeight: "bold",
                        zIndex: 1000,
                    }}
                >
                    {toastMessage.msg}
                </div>
            )}
        </div>
    );
};

export default PlantAdminPanel;