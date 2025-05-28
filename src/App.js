import React, { useEffect, useState } from "react";
import "./App.css";
import ChatWithGPT from "./components/Chat/ChatWithGPT";
import LoginForm from "./components/Auth/LoginForm";
import PlantFilters from "./components/Filters/PlantFilters";
import PlantList from "./components/Plants/PlantList";
import PlantForm from "./components/Plants/PlantForm";
import ExchangeHistory from "./components/History/ExchangeHistory";
import authFetch from "./api/authFetch";
import PlantAdminPanel from "./components/Plants/PlantAdminPanel";

const API_BASE = "/api";

function App() {
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [typeFilter, setTypeFilter] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [toastMessage, setToastMessage] = useState(null);
    const [history, setHistory] = useState([]);
    const [allHistory, setAllHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("offered");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [showHistory, setShowHistory] = useState(false);

    const [newPlant, setNewPlant] = useState({ name: "", type: "", description: "", userId: "",  region: "" });




    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        if (!isLoggedIn) return;

        authFetch(`${API_BASE}/plants`).then(res => res.json()).then(data => {
            setPlants(data);
            setFilteredPlants(data);
        });
        fetchPlants();
        authFetch(`${API_BASE}/users`).then(res => res.json()).then(setUsers);
    }, [isLoggedIn]);

    useEffect(() => {
        let result = [...plants];
        if (typeFilter) result = result.filter(p => p.type === typeFilter);
        if (regionFilter) result = result.filter(p => p.region === regionFilter);
        setFilteredPlants(result);
    }, [typeFilter, regionFilter, plants]);




    const handleExchangeRequest = async (plantId, ownerId) => {
        const role = localStorage.getItem("role");

        // Для админа обязательно выбранный пользователь
        if (role === "ADMIN" && !selectedUserId) {
            return showToast("❗ Выберите пользователя");
        }

        // ID того, кто предлагает обмен (либо выбранный, либо текущий пользователь)
        const offeredById = role === "ADMIN"
            ? parseInt(selectedUserId)
            : parseInt(localStorage.getItem("userId")); // предполагается, что ты сохраняешь userId в localStorage

        try {
            await authFetch(`${API_BASE}/exchanges`, {
                method: "POST",
                body: JSON.stringify({
                    plant: { id: plantId },
                    offeredBy: { id: offeredById },
                    requestedBy: { id: ownerId },
                    status: "pending"
                }),
            });

            showToast("✅ Запрос отправлен!");
        } catch {
            showToast("❌ Ошибка при отправке");
        }
    };


    const handleCreatePlant = async () => {
        try {
            await authFetch(`${API_BASE}/plants`, {
                method: "POST",
                body: JSON.stringify({
                    name: newPlant.name,
                    type: newPlant.type,
                    description: newPlant.description,
                    region: newPlant.region,
                    user: { id: parseInt(newPlant.userId) }
                })
            });

            // ⚠️ Сразу обновляем данные с сервера
            await fetchPlants();

            // Очищаем форму
            setNewPlant({ name: "", type: "", description: "", region: "", userId: "" });
            showToast("✅ Растение добавлено");
        } catch {
            showToast("❌ Ошибка при добавлении");
        }
    };

    const fetchPlants = async () => {
        const res = await authFetch(`${API_BASE}/plants`);
        const data = await res.json();
        setPlants(data);
        setFilteredPlants(data);
    };

    const switchTab = async (tab) => {
        setActiveTab(tab);
        if (!selectedUserId) return;

        const role = localStorage.getItem("role");
        const currentUserId = role === "ADMIN"
            ? parseInt(selectedUserId)
            : users.find(u => u.username === localStorage.getItem("username"))?.id;

        // 👇 вот теперь логика корректная
        const endpoint = tab === "offered" ? "request" : "offered";

        try {
            const res = await authFetch(`${API_BASE}/exchanges/${endpoint}/${currentUserId}`);
            const data = await res.json();
            setHistory(data);
            setAllHistory([]);
        } catch {
            showToast("❌ Ошибка при загрузке");
        }
    };

    const loadHistory = async () => {
        if (!selectedUserId) {
            const res = await authFetch(`${API_BASE}/exchanges`);
            const data = await res.json();
            setAllHistory(data);
            setHistory([]);
        } else {
            await switchTab(activeTab);
        }
    };

    if (!isLoggedIn) {
        return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
    }



    return (
        <div
            className="container"
            style={{
                backgroundColor: "#ffe5b4",
                minHeight: "100vh",
                padding: "2rem"
            }}
        >
            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                }}
                style={{
                    float: "right",
                    backgroundColor: "red",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "0.5rem"
                }}
            >
                Выйти
            </button>

            <h1
                style={{
                    color: "#22c55e",
                    textShadow: "0 0 10px #22c55e",
                    marginBottom: "2rem"
                }}
            >
                🌱 Платформа Обмена Растениями
            </h1>

            <div style={{marginBottom: "1.5rem"}}>
                <PlantFilters
                    uniqueTypes={[...new Set(plants.map(p => p.type))]}
                    uniqueRegions={[...new Set(plants.map(p => p.region))]}
                    setTypeFilter={setTypeFilter}
                    setRegionFilter={setRegionFilter}
                    users={users}
                    selectedUserId={selectedUserId}
                    setSelectedUserId={setSelectedUserId}
                    isAdmin={localStorage.getItem("role") === "ADMIN"}
                />
            </div>

            <div style={{marginBottom: "2rem", textAlign: "center"}}>
                { (
                    <button
                        className="button"
                        style={{backgroundColor: "#22c55e"}}
                        onClick={() => {
                            loadHistory();
                            setShowHistory(true);
                        }}
                    >
                        Показать историю
                    </button>
                )}
            </div>

            <div style={{marginBottom: "2rem"}}>
                <PlantList
                    plants={filteredPlants}
                    selectedUserId={selectedUserId}
                    onExchange={handleExchangeRequest}
                />
            </div>

            {showHistory && (
                <div style={{ marginBottom: "2rem" }}>
                    <ExchangeHistory
                        selectedUserId={selectedUserId}
                        history={history}
                        allHistory={allHistory}
                        activeTab={activeTab}
                        switchTab={switchTab}
                        refreshHistory={loadHistory}
                        onHide={() => setShowHistory(false)} // ⬅️ вот это важно!
                    />
                </div>
            )}

            <div style={{marginBottom: "3rem"}}>
                <PlantForm
                    newPlant={newPlant}
                    users={users}
                    onChange={(key, value) =>
                        setNewPlant({...newPlant, [key]: value})
                    }
                    onSubmit={handleCreatePlant}
                />
            </div>

            {localStorage.getItem("role") === "ADMIN" && (
                <PlantAdminPanel plants={plants} onRefresh={fetchPlants} />
            )}

            <ChatWithGPT/>

            {toastMessage && <div className="toast">{toastMessage}</div>}
        </div>
    );
}

export default App;