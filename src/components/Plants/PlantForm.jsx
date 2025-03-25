import React from "react";

const PlantForm = ({ newPlant, users, onChange, onSubmit }) => {
    const isAdmin = localStorage.getItem("role") === "ADMIN";

    if (!isAdmin) return null;

    return (
        <div
            className="card"
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 0 15px rgba(34,197,94,0.2)",
                marginTop: "2rem",
            }}
        >
            <h2 style={{ marginBottom: "1.5rem" }}>➕ Добавить новое растение</h2>

            <div style={{display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px"}}>
                <input
                    placeholder="Название"
                    value={newPlant.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ccc"
                    }}
                />
                <input
                    placeholder="Тип"
                    value={newPlant.type}
                    onChange={(e) => onChange("type", e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ccc"
                    }}
                />
                <textarea
                    placeholder="Описание"
                    value={newPlant.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                    style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ccc",
                        resize: "none"
                    }}
                />
                <select
                    value={newPlant.userId}
                    onChange={(e) => onChange("userId", e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ccc"
                    }}
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
                        backgroundColor: "#22c55e",
                        color: "white",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "0.5rem",
                        cursor: "pointer"
                    }}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
};

export default PlantForm;