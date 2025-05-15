import { useState } from "react";
import "./AddCollectionModal.css"; // стили подключим ниже

export default function AddCollectionModal({ onClose, onCreate }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate(name.trim());
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Новая коллекция</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Название коллекции"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                    />
                    <div className="modal-buttons">
                        <button type="button" className="cancel" onClick={onClose}>Отмена</button>
                        <button type="submit" className="submit">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    );
}