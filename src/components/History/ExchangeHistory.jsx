import React from "react";
import authFetch from "../../api/authFetch";

const ExchangeHistory = ({ selectedUserId, history, allHistory, activeTab, switchTab, refreshHistory, onHide }) => {
    const handleStatusUpdate = async (id, status) => {
        try {
            await authFetch(`/api/exchanges/${id}/status?status=${status}`, {
                method: "PATCH",
            });

            // Обновить только текущий активный таб
            if (selectedUserId) {
                await switchTab(activeTab);
            } else {
                await refreshHistory(); // для админа или общего списка
            }

        } catch (error) {
            alert("Ошибка при обновлении статуса");
        }
    };

    const exchanges = selectedUserId ? history : allHistory;

    return (
        <div
            className="card"
            style={{
                backgroundColor: "#fff",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                marginBottom: "2rem"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    🪵 История обменов
                </h2>
                <button
                    onClick={onHide}
                    style={{
                        backgroundColor: "#ccc",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.4rem 1rem",
                        fontWeight: "bold",
                        color: "#333"
                    }}
                >
                    Скрыть
                </button>
            </div>

            {selectedUserId && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <button
                        onClick={() => switchTab("offered")}
                        style={{
                            backgroundColor: activeTab === "offered" ? "#22c55e" : "#ccc",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                            color: "#fff"
                        }}
                    >
                        Предложенные
                    </button>
                    <button
                        onClick={() => switchTab("request")}
                        style={{
                            backgroundColor: activeTab === "request" ? "#22c55e" : "#ccc",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                            color: "#fff"
                        }}
                    >
                        Запрошенные
                    </button>
                </div>
            )}

            {exchanges.map((ex, i) => (
                <div key={i} style={{ marginBottom: "0.75rem" }}>
                    <p>
                        #{ex.id} | <b>{ex.status}</b> |{" "}
                        {activeTab === "offered"
                            ? `от ${ex.offeredBy?.username}`
                            : `→ ${ex.requestedBy?.username}`}{" "}
                        | <i>{ex.plant?.name}</i>
                    </p>

                    {activeTab === "offered" && ex.status === "pending" && (
                        <div style={{marginTop: "0.5rem", display: "flex", gap: "0.5rem"}}>
                        <button
                                onClick={() => handleStatusUpdate(ex.id, "Accepted")}
                                style={{
                                    backgroundColor: "#22c55e",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    padding: "0.25rem 0.75rem"
                                }}
                            >
                                Принять
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(ex.id, "Declined")}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    padding: "0.25rem 0.75rem"
                                }}
                            >
                                Отклонить
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ExchangeHistory;