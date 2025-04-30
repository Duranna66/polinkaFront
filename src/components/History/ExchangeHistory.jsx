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
                backgroundColor: "#9333ea",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 0 20px rgba(199, 84, 255, 0.6)",
                color: "#fff"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    🪵 История обменов
                </h2>
                <button
                    onClick={onHide}
                    style={{
                        backgroundColor: "#c084fc",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.4rem 1rem",
                        fontWeight: "bold",
                        color: "#1a001f",
                        boxShadow: "0 0 10px rgba(199, 84, 255, 0.4)",
                        cursor: "pointer"
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
                            backgroundColor: activeTab === "offered" ? "#c084fc" : "#7c3aed",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Предложенные
                    </button>
                    <button
                        onClick={() => switchTab("request")}
                        style={{
                            backgroundColor: activeTab === "request" ? "#c084fc" : "#7c3aed",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                            color: "#fff",
                            cursor: "pointer"
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
                                    backgroundColor: "#34d399",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    padding: "0.4rem 0.75rem",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                Принять
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(ex.id, "Declined")}
                                style={{
                                    backgroundColor: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    padding: "0.4rem 0.75rem",
                                    fontWeight: "bold",
                                    cursor: "pointer"
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