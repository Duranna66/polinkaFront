import React, { useEffect, useState } from "react";
import "./App.css";
import ChatWithGPT from "./components/ui/ChatWithGPT";

const API_BASE = "http://localhost:8080";

function App() {
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [typeFilter, setTypeFilter] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [toastMessage, setToastMessage] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("offered");
    const [allHistory, setAllHistory] = useState([]);

    // Создание нового растения
    const [newPlant, setNewPlant] = useState({
        name: "",
        type: "",
        description: "",
        userId: ""
    });

    // Вместо id — храним выбранное растение целиком
    const [selectedPlant, setSelectedPlant] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/plants`)
            .then((res) => res.json())
            .then((data) => {
                setPlants(data);
                setFilteredPlants(data);
            });

        fetch(`${API_BASE}/users`)
            .then((res) => res.json())
            .then(setUsers);
    }, []);

    // Применение фильтров к plants
    useEffect(() => {
        let result = [...plants];
        if (typeFilter) {
            result = result.filter((p) => p.type === typeFilter);
        }
        if (regionFilter) {
            result = result.filter((p) => p.region === regionFilter);
        }
        setFilteredPlants(result);
    }, [typeFilter, regionFilter, plants]);

    const uniqueTypes = [...new Set(plants.map((p) => p.type))];
    const uniqueRegions = [...new Set(plants.map((p) => p.region))];

    /**
     * Запрос на обмен:
     * plantId — айди растения
     * ownerId — айди владельца растения (получаем из plant.userId)
     */
    const handleExchangeRequest = async (plantId, ownerId) => {
        if (!selectedUserId) {
            showToast("❗ Выберите пользователя для обмена");
            return;
        }

        try {
            await fetch(`${API_BASE}/exchanges`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plant: {
                        id: plantId,
                        name: null,
                        description: null,
                        type: null,
                        user: null
                    },
                    offeredBy: {
                        // тот, кто запрашивает обмен
                        id: parseInt(selectedUserId),
                        username: "null",
                        region: null
                    },
                    requestedBy: {
                        // владелец растения
                        id: parseInt(ownerId),
                        username: "null",
                        region: null
                    },
                    status: "pending"
                })
            });
            showToast("✅ Запрос на обмен отправлен!");
        } catch (error) {
            showToast("❌ Ошибка при отправке запроса!");
        }
    };

    // Создание нового растения
    const handleCreatePlant = async () => {
        try {
            await fetch(`${API_BASE}/plants`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newPlant.name,
                    type: newPlant.type,
                    description: newPlant.description,
                    // Важно: вместо username/region нужно передавать user: { id: ... }
                    user: {
                        id: parseInt(newPlant.userId)
                    }
                })
            });
            showToast("✅ Растение добавлено");
        } catch (err) {
            showToast("❌ Ошибка при добавлении");
        }
    };

    // Утилита: по ID юзера находим username
    const getUsernameById = (id) => {
        const u = users.find((usr) => usr.id.toString() === id);
        return u ? u.username : "";
    };
    const getRegionById = (id) => {
        const u = users.find((usr) => usr.id.toString() === id);
        return u ? u.region : "";
    };

    // Удаление растения
    const handleDeletePlant = async () => {
        if (!selectedPlant) {
            showToast("❗ Сначала выберите растение");
            return;
        }
        try {
            await fetch(`${API_BASE}/plants/${selectedPlant.id}`, {
                method: "DELETE",
            });
            setPlants((prev) => prev.filter((p) => p.id !== selectedPlant.id));
            setSelectedPlant(null); // сбрасываем выбор
            showToast("✅ Растение удалено");
        } catch {
            showToast("❌ Ошибка при удалении растения");
        }
    };

    // Сохранение изменений при редактировании
    const handleUpdatePlant = async () => {
        if (!selectedPlant) {
            showToast("❗ Сначала выберите растение");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/plants/${selectedPlant.id}`, {
                method: "PUT", // или PATCH
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: selectedPlant.name,
                    type: selectedPlant.type,
                    description: selectedPlant.description,
                    username: selectedPlant.username,
                    region: selectedPlant.region,
                }),
            });
            const updated = await res.json();
            setPlants((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
            );
            showToast("✅ Растение обновлено");
        } catch {
            showToast("❌ Ошибка при обновлении растения");
        }
    };

    // История обменов
    const loadHistory = async () => {
        if (!selectedUserId) {
            const res = await fetch(`${API_BASE}/exchanges`);
            const data = await res.json();
            setAllHistory(data);
            setHistory([]);
            return;
        }
        await switchTab(activeTab);
    };

    const switchTab = async (tab) => {
        setActiveTab(tab);
        if (!selectedUserId) return;
        const endpoint = tab === "offered" ? "offered" : "request";
        try {
            const res = await fetch(`${API_BASE}/exchanges/${endpoint}/${selectedUserId}`);
            const data = await res.json();
            setHistory(data);
            setAllHistory([]);
        } catch {
            showToast("❌ Не удалось загрузить историю обменов");
        }
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };


    // Выбор растения для редактирования
    const handleSelectPlant = (plant) => {
        setSelectedPlant({ ...plant }); // создаём копию, чтобы можно было редактировать
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer фыв`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',  // или другой
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                // { role: 'user', content: userMessage }
            ]
        })
    })
        .then(res => res.json())
        .then(data => {
            const assistantMessage = data.choices[0].message.content;
            // ... добавить assistantMessage в историю диалога
        })
        .catch(console.error);

    return (
        <div
            className="container"
            style={{
                backgroundColor: "#ffe5b4",
                minHeight: "100vh",
                padding: "2rem",
                borderLeft: "12px solid #ffe5b4",
                borderRight: "12px solid #ffe5b4",
            }}
        >
            <h1 style={{color: "#22c55e", textShadow: "0 0 10px #22c55e"}}>
                🌱 Платформа Обмена Растениями
            </h1>


            {/* Фильтры */}
            <div className="filters">
                <select className="select" onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">Фильтр по типу</option>
                    {uniqueTypes.map((type, idx) => (
                        <option key={idx} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <select className="select" onChange={(e) => setRegionFilter(e.target.value)}>
                    <option value="">Фильтр по региону</option>
                    {uniqueRegions.map((region, idx) => (
                        <option key={idx} value={region}>
                            {region}
                        </option>
                    ))}
                </select>


                <div
                    style={{
                        position: "fixed",   // фиксированное позиционирование
                        bottom: "1rem",      // отступ от нижнего края
                        right: "1rem",       // отступ от правого края
                        width: "350px",      // желаемая ширина окна
                        maxHeight: "500px",  // ограничиваем высоту
                        zIndex: 9999,        // чтобы перекрывать другие элементы
                        border: "1px solid #ccc",
                        // backgroundColor: "#fff",
                        borderRadius: "0.5rem",
                        // boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                        padding: "1rem"
                    }}
                >
                    <ChatWithGPT/>
                </div>

                <select className="select" onChange={(e) => setSelectedUserId(e.target.value)}>
                    <option value="">Все пользователи</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username} ({user.region})
                        </option>
                    ))}
                </select>

                <button
                    className="button"
                    style={{backgroundColor: "#22c55e"}}
                    onClick={loadHistory}
                >
                    Показать историю
                </button>
            </div>

            {/* Сетка карточек растений */}
            <div className="grid">
                {filteredPlants.map((plant) => (
                    <div
                        key={plant.id}
                        className="card"
                        style={{
                            backgroundColor: "#bbf7d0",
                            borderRadius: "1rem",
                            padding: "1.5rem",
                            boxShadow: "0 0 15px rgba(34,197,94,0.4)",
                        }}
                    >
                        <h2
                            style={{
                                color: "#15803d",
                                textShadow: "0 0 5px #22c55e",
                            }}
                        >
                            {plant.name}
                        </h2>
                        <p>Тип: {plant.type}</p>
                        <p>{plant.description}</p>
                        <p>Регион: {plant.region}</p>
                        <p>Пользователь: <strong>{plant.username}</strong></p>

                        {/*
                           Проверяем, не совпадает ли выбранный UserId (parseInt)
                           с userId владельца растения. Если совпадает, значит это
                           "обмен с самим собой" — запрещаем, иначе даём кнопку.
                        */}
                        {parseInt(selectedUserId) !== plant.userId ? (
                            <button
                                className="button"
                                style={{backgroundColor: "#22c55e"}}
                                // ВАЖНО: передаём сюда plant.userId вторым аргументом
                                onClick={() => handleExchangeRequest(plant.id, plant.userId)}
                            >
                                Запросить обмен
                            </button>
                        ) : (
                            <p
                                style={{
                                    fontSize: "0.9rem",
                                    marginTop: "1rem",
                                    color: "#666",
                                }}
                            >
                                Нельзя обмениваться с собой
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* История обменов */}
            {(history.length > 0 || allHistory.length > 0) && (
                <div
                    className="card"
                    style={{
                        marginTop: "3rem",
                        backgroundColor: "#bbf7d0",
                        borderRadius: "1rem",
                        padding: "1.5rem",
                    }}
                >
                    <h2
                        style={{
                            color: "#15803d",
                            textShadow: "0 0 5px #22c55e",
                        }}
                    >
                        📜 История обменов
                    </h2>

                    {selectedUserId && (
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                marginBottom: "1rem",
                            }}
                        >
                            <button
                                className="button"
                                style={{backgroundColor: "#22c55e"}}
                                onClick={() => switchTab("offered")}
                            >
                                Offered
                            </button>
                            <button
                                className="button"
                                style={{backgroundColor: "#22c55e"}}
                                onClick={() => switchTab("request")}
                            >
                                Requested
                            </button>
                        </div>
                    )}

                    {/* Если пользователь не выбран, показываем всю history */}
                    {!selectedUserId &&
                        allHistory.map((ex, idx) => (
                            <p key={idx}>
                                Обмен #{ex.id}: статус — <strong>{ex.status}</strong> |{" "}
                                {ex.plant?.name}
                            </p>
                        ))}

                    {/* Если пользователь выбран, показываем только filtered */}
                    {selectedUserId &&
                        history.map((ex, i) => (
                            <p key={i}>
                                #{ex.id} | <b>{ex.status}</b> |{" "}
                                {activeTab === "offered"
                                    ? `→ ${ex.requestedBy?.username}`
                                    : `от ${ex.offeredBy?.username}`}{" "}
                                | {ex.plant?.name}
                            </p>
                        ))}
                </div>
            )}

            {toastMessage && <div className="toast">{toastMessage}</div>}

            {/* Блок добавления нового растения */}
            <div
                className="card"
                style={{
                    marginTop: "4rem",
                    backgroundColor: "#bbf7d0",
                    borderRadius: "1rem",
                    padding: "2rem",
                    maxWidth: "600px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxShadow: "0 0 20px rgba(34,197,94,0.4)",
                }}
            >
                <h2 style={{color: "#15803d", marginBottom: "1rem"}}>
                    ➕ Добавить новое растение
                </h2>
                <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <input
                        placeholder="Название"
                        value={newPlant.name}
                        onChange={(e) =>
                            setNewPlant({...newPlant, name: e.target.value})
                        }
                        style={{
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc",
                        }}
                    />
                    <input
                        placeholder="Тип"
                        value={newPlant.type}
                        onChange={(e) =>
                            setNewPlant({...newPlant, type: e.target.value})
                        }
                        style={{
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc",
                        }}
                    />
                    <textarea
                        placeholder="Описание"
                        value={newPlant.description}
                        onChange={(e) =>
                            setNewPlant({...newPlant, description: e.target.value})
                        }
                        rows={3}
                        style={{
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc",
                            resize: "none",
                        }}
                    />
                    <select
                        value={newPlant.userId}
                        onChange={(e) =>
                            setNewPlant({...newPlant, userId: e.target.value})
                        }
                        style={{padding: "0.5rem", borderRadius: "0.5rem"}}
                    >
                        <option value="">Выберите пользователя</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.username} ({u.region})
                            </option>
                        ))}
                    </select>
                    <button
                        style={{
                            backgroundColor: "#22c55e",
                            color: "white",
                            padding: "0.75rem",
                            borderRadius: "0.75rem",
                            border: "none",
                            fontWeight: "bold",
                            fontSize: "1rem",
                        }}
                        onClick={handleCreatePlant}
                        disabled={
                            !newPlant.name || !newPlant.type || !newPlant.userId
                        }
                    >
                        Добавить растение
                    </button>
                </div>
            </div>

            {/* Блок выбора растения карточками и редактирования */}
            <div
                className="card"
                style={{
                    marginTop: "2rem",
                    backgroundColor: "#bbf7d0",
                    borderRadius: "1rem",
                    padding: "2rem",
                    maxWidth: "900px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxShadow: "0 0 20px rgba(34,197,94,0.4)",
                }}
            >
                <h2 style={{color: "#15803d", marginBottom: "1rem"}}>
                    ✏️ Удалить / Редактировать растение
                </h2>

                {/* Сетка карточек (все растения). При клике выбираем растение в стейте. */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    {plants.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                border: "2px solid #22c55e",
                                borderRadius: "0.75rem",
                                padding: "1rem",
                                cursor: "pointer",
                                backgroundColor:
                                    selectedPlant && selectedPlant.id === p.id
                                        ? "#86efac" // подсветка выбранной карточки
                                        : "#fff",
                            }}
                            onClick={() => handleSelectPlant(p)}
                        >
                            <h3 style={{margin: 0}}>{p.name}</h3>
                            <p style={{margin: "0.25rem 0"}}>{p.type}</p>
                            <p style={{margin: "0.25rem 0"}}>{p.description}</p>
                            <p style={{fontSize: "0.9rem"}}>
                                {p.username} — {p.region}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Если растение выбрано, показываем форму редактирования */}
                {selectedPlant && (
                    <>
                        <h3>Редактировать «{selectedPlant.name}»</h3>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                            maxWidth: "400px",
                            marginBottom: "1rem"
                        }}>
                            <label style={{fontWeight: "bold"}}>Название</label>
                            <input
                                value={selectedPlant.name}
                                onChange={(e) =>
                                    setSelectedPlant({...selectedPlant, name: e.target.value})
                                }
                                style={{padding: "0.5rem", borderRadius: "0.5rem"}}
                            />

                            <label style={{fontWeight: "bold"}}>Тип</label>
                            <input
                                value={selectedPlant.type}
                                onChange={(e) =>
                                    setSelectedPlant({...selectedPlant, type: e.target.value})
                                }
                                style={{padding: "0.5rem", borderRadius: "0.5rem"}}
                            />

                            <label style={{fontWeight: "bold"}}>Описание</label>
                            <textarea
                                rows={3}
                                value={selectedPlant.description}
                                onChange={(e) =>
                                    setSelectedPlant({...selectedPlant, description: e.target.value})
                                }
                                style={{
                                    padding: "0.5rem",
                                    borderRadius: "0.5rem",
                                    resize: "none"
                                }}
                            />

                            <label style={{fontWeight: "bold"}}>Имя пользователя (username)</label>
                            <input
                                value={selectedPlant.username}
                                onChange={(e) =>
                                    setSelectedPlant({...selectedPlant, username: e.target.value})
                                }
                                style={{padding: "0.5rem", borderRadius: "0.5rem"}}
                            />

                            <label style={{fontWeight: "bold"}}>Регион</label>
                            <input
                                value={selectedPlant.region}
                                onChange={(e) =>
                                    setSelectedPlant({...selectedPlant, region: e.target.value})
                                }
                                style={{padding: "0.5rem", borderRadius: "0.5rem"}}
                            />
                        </div>

                        <div style={{display: "flex", gap: "1rem"}}>
                            <button
                                style={{
                                    backgroundColor: "#22c55e",
                                    color: "#fff",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontWeight: "bold"
                                }}
                                onClick={handleUpdatePlant}
                            >
                                Сохранить изменения
                            </button>
                            <button
                                style={{
                                    backgroundColor: "red",
                                    color: "#fff",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontWeight: "bold"
                                }}
                                onClick={handleDeletePlant}
                            >
                                Удалить растение
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;