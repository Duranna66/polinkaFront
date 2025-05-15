// 📁 pages/Map/HomePage.jsx
import { useEffect, useState } from "react";
import API from "../../api/authFetch";
import RouteMap from "./RouteMap";
import AddPlaceModal from "./AddPlaceModal";
import CreateRouteModal from "./CreateRouteModal";
import RouteActionModal from "./RouteActionModal";

export default function HomePage() {
    const [collections, setCollections] = useState([]);
    const [places, setPlaces] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [activeRoute, setActiveRoute] = useState(null);
    const [newMarker, setNewMarker] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collectionsRes, placesRes, routesRes] = await Promise.all([
                    API.get("/collections"),
                    API.get("/places"),
                    API.get("/routes"),
                ]);
                setCollections(collectionsRes.data);
                setPlaces(placesRes.data);
                setRoutes(routesRes.data);
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchRoutes = async () => {
        try {
            const res = await API.get("/routes");
            setRoutes(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке маршрутов", err);
        }
    };

    const togglePlaceSelection = (place) => {
        setSelectedPlaces((prev) => {
            const exists = prev.find((p) => p.id === place.id);
            return exists ? prev.filter((p) => p.id !== place.id) : [...prev, place];
        });
    };

    const handleRightClick = (latlng) => {
        setNewMarker(latlng);
        setShowModal(true);
    };

    return (
        <div className="map-wrapper">
            {!loading && (
                <RouteMap
                    places={places}
                    routes={routes}
                    collections={collections}
                    selectedPlaces={selectedPlaces}
                    togglePlaceSelection={togglePlaceSelection}
                    handleRightClick={handleRightClick}
                    setActiveRoute={setActiveRoute}
                />
            )}

            {showModal && (
                <AddPlaceModal
                    collections={collections}
                    newMarker={newMarker}
                    onClose={() => setShowModal(false)}
                    onPlaceAdded={(place) => setPlaces([...places, place])}
                />
            )}

            {showRouteModal && (
                <CreateRouteModal
                    selectedPlaces={selectedPlaces}
                    collections={collections}
                    onClose={() => setShowRouteModal(false)}
                    onRouteCreated={fetchRoutes}
                    resetSelection={() => setSelectedPlaces([])}
                />
            )}

            {selectedPlaces.length >= 2 && (

                <div
                    className="create-route-panel"
                    style={{
                        backgroundColor: "#f5f5fa",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={() => setShowRouteModal(true)}
                        style={{
                            backgroundColor: "#6a1b9a",
                            color: "white",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#5e1785")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#6a1b9a")}
                    >
                        ➕ Создать маршрут из {selectedPlaces.length} точек
                    </button>
                </div>
            )}

            {activeRoute && (
                <RouteActionModal
                    route={activeRoute}
                    collections={collections}
                    onClose={() => setActiveRoute(null)}
                    onDelete={(id) => setRoutes(routes.filter((r) => r.id !== id))}
                />
            )}
        </div>
    );
}
