import { useEffect, useState } from "react";
import API from "../../api/authFetch";

export default function ShareModal({ collectionId, onClose }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");

    useEffect(() => {
        API.get("/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Ошибка загрузки пользователей", err));
    }, []);

    const handleShare = async () => {
        if (!selectedUserId) return;

        try {
            await API.post("/collections/share", {
                userId: selectedUserId,
                collectionId,
            });
            alert("Коллекция успешно передана!");
            onClose();
        } catch (err) {
            console.error("Ошибка при передаче", err);
            alert("Не удалось передать коллекцию");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Поделиться коллекцией</h3>
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
                >
                    <option value="">Выберите пользователя</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleShare} className="primary-btn">📤 Поделиться</button>
                <button className="cancel" onClick={onClose}>Отмена</button>
            </div>
        </div>
    );
}