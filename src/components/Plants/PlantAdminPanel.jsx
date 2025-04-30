import React, { useState } from "react";
import authFetch from "../../api/authFetch";

const PlantAdminPanel = ({ plants, onRefresh }) => {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [formData, setFormData] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg, color = "#c084fc") => {
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
            await authFetch(`/api/plants/${selectedPlant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            showToast("✅ Растение обновлено");
            setSelectedPlant(null);
            onRefresh();
        } catch {
            showToast("❌ Ошибка при обновлении", "#ef4444");
        }
    };

    const handleDelete = async () => {
        try {
            await authFetch(`/api/plants/${selectedPlant.id}`, {
                method: "POST",
            });
            showToast("🗑️ Удалено");
            setSelectedPlant(null);
            onRefresh();
        } catch {
            showToast("❌ Ошибка при удалении", "#ef4444");
        }
    };

    return (
        <div className="card" style={{
            backgroundColor: "#9333ea",
            borderRadius: "1rem",
            padding: "2rem",
            marginTop: "3rem",
            color: "#fff",
            boxShadow: "0 0 20px rgba(199, 84, 255, 0.5)",
            position: "relative"
        }}>
            <h2 style={{ marginBottom: "1rem" }}>✏️ Удалить / Редактировать растение</h2>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2rem"
            }}>
                {plants.map((plant) => (
                    <div
                        key={plant.id}
                        onClick={() => handleSelect(plant)}
                        style={{
                            padding: "1rem",
                            borderRadius: "1rem",
                            cursor: "pointer",
                            backgroundColor: selectedPlant?.id === plant.id ? "#c084fc" : "#a855f7",
                            boxShadow: selectedPlant?.id === plant.id ? "0 0 12px #e9d5ff" : "none",
                            color: "#fff",
                            transition: "all 0.3s"
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

                    {["name", "type", "description", "username", "region"].map((field) => (
                        <div key={field} style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.3rem" }}>
                                {field === "username" ? "Имя пользователя" : field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            {field === "description" ? (
                                <textarea
                                    value={formData[field]}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    rows={3}
                                    style={inputStyle}
                                />
                            ) : (
                                <input
                                    value={formData[field]}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    style={inputStyle}
                                />
                            )}
                        </div>
                    ))}

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button onClick={handleUpdate} style={buttonStyle("#c084fc", "#1a001f")}>
                            Сохранить изменения
                        </button>
                        <button onClick={handleDelete} style={buttonStyle("#ef4444", "white")}>
                            Удалить растение
                        </button>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div style={{
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
                }}>
                    {toastMessage.msg}
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "0.6rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#f3e8ff",
    color: "#1a001f",
    fontSize: "1rem",
    boxSizing: "border-box"
};

const buttonStyle = (bg, textColor) => ({
    backgroundColor: bg,
    color: textColor,
    padding: "0.6rem 1.2rem",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
});

export default PlantAdminPanel;