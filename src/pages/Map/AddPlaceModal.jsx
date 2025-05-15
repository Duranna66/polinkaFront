import { useState } from "react";
import API from "../../api/authFetch";

export default function AddPlaceModal({ collections, newMarker, onClose, onPlaceAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        collectionId: collections[0]?.id || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/places", {
                ...formData,
                latitude: newMarker.lat,
                longitude: newMarker.lng,
            });
            onPlaceAdded(res.data);
            onClose();
        } catch (err) {
            console.error("Ошибка при добавлении точки:", err);
            alert("Не удалось добавить точку");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Новая точка</h2>
                <form onSubmit={handleSubmit}>
                    <label>Название:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <label>Описание:</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                    />
                    <div className="modal-buttons">
                        <button type="button" className="cancel" onClick={onClose}>Отмена</button>
                        <button type="submit" className="submit">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}