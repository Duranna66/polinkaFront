import React from "react";

const currentUsername = localStorage.getItem("username");
const currentRole = localStorage.getItem("role");

const PlantList = ({ plants, selectedUserId, onExchange }) => {
    const isAdmin = currentRole === "ADMIN";

    return (
        <div
            className="plant-row"
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                justifyContent: "flex-start"
            }}
        >
            {plants.map((plant) => {
                const isSelfExchange = isAdmin
                    ? selectedUserId && parseInt(selectedUserId) === plant.userId
                    : plant.username === currentUsername;

                const showAsYours = !isAdmin && plant.username === currentUsername;

                return (
                    <div
                        key={plant.id}
                        className="card"
                        style={{
                            backgroundColor: "#9333ea",
                            borderRadius: "1rem",
                            padding: "1.5rem",
                            color: "#fff",
                            boxShadow: "0 0 20px rgba(199, 84, 255, 0.4)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "250px",
                            maxWidth: "260px",
                            width: "100%",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.03)";
                            e.currentTarget.style.boxShadow = "0 0 25px rgba(255, 255, 255, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 20px rgba(199, 84, 255, 0.4)";
                        }}
                    >
                        <h2 style={{
                            fontSize: "1.5rem",
                            marginBottom: "0.75rem",
                            fontWeight: "bold",
                            color: "#ffffff"
                        }}>{plant.name}</h2>
                        <p>Тип: {plant.type}</p>
                        <p>{plant.description}</p>
                        <p>Регион: {plant.region}</p>
                        <p>
                            Пользователь:{" "}
                            <strong>{showAsYours ? "Ваша" : plant.username}</strong>
                        </p>

                        {isSelfExchange ? (
                            <p style={{
                                fontSize: "0.9rem",
                                marginTop: "1rem",
                                color: "#ddd"
                            }}>
                                Нельзя обмениваться с собой
                            </p>
                        ) : (
                            <button
                                className="button"
                                style={{
                                    backgroundColor: "#c084fc",
                                    color: "#1a001f",
                                    fontWeight: "bold",
                                    width: "100%",
                                    padding: "0.75rem",
                                    border: "none",
                                    borderRadius: "0.75rem",
                                    boxShadow: "0 0 12px rgba(199, 84, 255, 0.6)",
                                    cursor: "pointer",
                                    marginTop: "1rem"
                                }}
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