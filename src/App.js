import { useEffect, useState } from "react";
import Login from "./pages/LoginPage";
import CollectionsList from "./pages/Collections/CollectionsList";
import AddCollectionModal from "./pages/Map/AddCollectionModal";
import MapView from "./pages/Map/MapView";
import API from "./api/authFetch";
import "./App.css";
import ActionModal from "./pages/Map/ActionModal";
import ChatWithGPT from "./components/Chat/ChatWithGPT";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [actionModal, setActionModal] = useState({ show: false, title: "", message: "" });
    const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                await API.get("/auth/check");
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
                localStorage.removeItem("token");
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await API.get("/collections");
                setCollections(res.data);
            } catch (err) {
                console.error("Ошибка загрузки коллекций при старте", err);
            }
        };

        if (isAuthenticated) {
            fetchCollections();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    const createCollection = async (name) => {
        try {
            await API.post("/collections", { name });
            const res = await API.get("/collections"); // микро ребут
            setCollections(res.data);
            setActionModal({ show: true, title: "Добавлено", message: "Коллекция создана." });
        } catch (err) {
            console.error("Ошибка создания коллекции", err);
        }
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="app-container">
            <div className="logout-button-wrapper">
                <button className="logout-button" onClick={handleLogout}>🚪 Выйти</button>
            </div>

            <section className="card">
                <CollectionsList
                    collections={collections}
                    setCollections={setCollections}
                    onAddClick={() => setShowAddCollectionModal(true)}
                />
            </section>

            <section className="map-section">
                <h2 className="map-title">🌍 Карта маршрутов</h2>
                <MapView embedded />
            </section>

            {showAddCollectionModal && (
                <AddCollectionModal
                    onClose={() => setShowAddCollectionModal(false)}
                    onCreate={createCollection}
                />
            )}

            {actionModal.show && (
                <ActionModal
                    title={actionModal.title}
                    message={actionModal.message}
                    onClose={() => setActionModal({ ...actionModal, show: false })}
                />
            )}

            <ChatWithGPT></ChatWithGPT>
        </div>
    );
}

export default App;