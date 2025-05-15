import { useState, useEffect } from "react";
import API from "../../api/authFetch";

function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.id || decoded.sub || null;
    } catch (e) {
        console.error("Ошибка при декодировании токена:", e);
        return null;
    }
}

export default function CreateRouteModal({
                                             selectedPlaces,
                                             collections,
                                             onClose,
                                             onRouteCreated,
                                             resetSelection,
                                         }) {
    const [form, setForm] = useState({ title: "", description: "" });
    const [selectedCollection, setSelectedCollection] = useState(collections[0]?.id || "");

    useEffect(() => {
        if (collections.length > 0) {
            setSelectedCollection(collections[0].id);
        }
    }, [collections]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/routes", {
                title: form.title,
                description: form.description,
                createdBy: { id: getUserIdFromToken() },
                places: selectedPlaces.map((p) => ({ id: p.id })),
            });

            if (selectedCollection) {
                await API.post(`/collections/${selectedCollection}/routes`, {
                    routeId: res.data.id,
                });
            }

            onRouteCreated(res.data);
            resetSelection();
            onClose();
        } catch (err) {
            console.error("Ошибка создания маршрута", err);
            alert("Не удалось создать маршрут");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Создать маршрут</h2>
                <form onSubmit={handleSubmit}>
                    <label>Название:</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    <label>Описание:</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <label>Добавить в коллекцию:</label>
                    <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                    >
                        {collections.map((col) => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                    </select>
                    <div className="modal-buttons">
                        <button type="button" className="cancel" onClick={onClose}>Отмена</button>
                        <button type="submit" className="submit">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    );
}