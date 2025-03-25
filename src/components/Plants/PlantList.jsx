import React from "react";

const currentUsername = localStorage.getItem("username");
const currentRole = localStorage.getItem("role");

const PlantList = ({ plants, selectedUserId, onExchange }) => {
    const isAdmin = currentRole === "ADMIN";

    return (
        <div className="grid">
            {plants.map((plant) => {
                // 🌿 если админ, сравниваем с selectedUserId
                // 👤 если обычный пользователь, сравниваем username
                const isSelfExchange = isAdmin
                    ? selectedUserId && parseInt(selectedUserId) === plant.userId
                    : plant.username === currentUsername;

                const showAsYours = !isAdmin && plant.username === currentUsername;

                return (
                    <div
                        key={plant.id}
                        className="card"
                        style={{
                            backgroundColor: "#bbf7d0",
                            borderRadius: "1rem",
                            padding: "1.5rem"
                        }}
                    >
                        <h2 style={{ color: "#15803d" }}>{plant.name}</h2>
                        <p>Тип: {plant.type}</p>
                        <p>{plant.description}</p>
                        <p>Регион: {plant.region}</p>
                        <p>
                            Пользователь:{" "}
                            <strong>{showAsYours ? "Ваша" : plant.username}</strong>
                        </p>

                        {isSelfExchange ? (
                            <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#666" }}>
                                Нельзя обмениваться с собой
                            </p>
                        ) : (
                            <button
                                className="button"
                                style={{ backgroundColor: "#22c55e" }}
                                onClick={() => onExchange(plant.id, plant.userId)}
                            >
                                Запросить обмен
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PlantList;