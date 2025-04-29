import React from "react";

const PlantForm = ({ newPlant, users, onChange, onSubmit }) => {
    const isAdmin = localStorage.getItem("role") === "ADMIN";

    if (!isAdmin) return null;

    return (
        <div
            className="card"
            style={{
                backgroundColor: "#9333ea",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 0 20px rgba(199,84,255,0.6)",
                marginTop: "2rem",
                color: "#fff"
            }}
        >
            <h2 style={{ marginBottom: "1.5rem", fontWeight: "bold" }}>➕ Добавить новое растение</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}>
                <input
                    placeholder="Название"
                    value={newPlant.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    style={inputStyle}
                />
                <input
                    placeholder="Тип"
                    value={newPlant.type}
                    onChange={(e) => onChange("type", e.target.value)}
                    style={inputStyle}
                />
                <textarea
                    placeholder="Описание"
                    value={newPlant.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "none" }}
                />
                <select
                    value={newPlant.userId}
                    onChange={(e) => onChange("userId", e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Выберите пользователя</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.username} ({u.region})
                        </option>
                    ))}
                </select>
                <button
                    onClick={onSubmit}
                    disabled={!newPlant.name || !newPlant.type || !newPlant.userId}
                    style={{
                        padding: "0.75rem",
                        backgroundColor: "#c084fc",
                        color: "#1a001f",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        boxShadow: "0 0 10px rgba(199,84,255,0.6)",
                        transition: "background-color 0.3s"
                    }}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
};

const inputStyle = {
    padding: "0.6rem 1rem",
    borderRadius: "0.75rem",
    border: "none",
    backgroundColor: "#f3e8ff",
    color: "#1a001f",
    fontSize: "1rem",
    boxSizing: "border-box"
};

export default PlantForm;