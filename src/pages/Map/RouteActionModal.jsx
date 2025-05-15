import { useState } from "react";
import API from "../../api/authFetch";
import "./RouteActionModal.css";

export default function RouteActionModal({ route, collections, onClose, onDelete }) {
    const [selectedCollection, setSelectedCollection] = useState(collections[0]?.id || "");
    const [isLoading, setIsLoading] = useState(false);

    const addToCollection = async () => {
        setIsLoading(true);
        try {
            await API.post(`/collections/${selectedCollection}/routes`, {
                routeId: route.id,
            });
            onClose();
        } catch (err) {
            console.error("Ошибка добавления в коллекцию", err);
            alert("Ошибка при добавлении");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRoute = async () => {
        setIsLoading(true);
        try {
            await API.delete(`/routes/${route.id}`);
            onDelete(route.id); // обновим маршруты без перезагрузки
            onClose();
        } catch (err) {
            console.error("Ошибка удаления маршрута", err);
            alert("Ошибка при удалении");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{route.title}</h2>
                <p>{route.description}</p>

                <hr />
                <h4>Добавить в коллекцию</h4>
                <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    disabled={isLoading}
                >
                    {collections.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                </select>

                <button onClick={addToCollection} disabled={isLoading}>
                    {isLoading ? "Добавление..." : "Добавить"}
                </button>

                <hr />
                <button className="danger" onClick={deleteRoute} disabled={isLoading}>
                    Удалить маршрут
                </button>
                <button className="cancel" onClick={onClose} disabled={isLoading}>
                    Закрыть
                </button>
            </div>
        </div>
    );
}