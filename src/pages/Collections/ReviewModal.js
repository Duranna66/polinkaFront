import { useEffect, useState } from "react";
import API from "../../api/authFetch";
import StarRating from "./StarRating";

export default function ReviewModal({ collectionId, onClose }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(null);

    // Получаем ID текущего пользователя
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/users/auth/me");
                setUserId(res.data.id);
            } catch (err) {
                console.error("Ошибка получения пользователя", err);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async () => {
        if (!userId || !collectionId) {
            alert("Не удалось получить информацию о пользователе или коллекции.");
            return;
        }

        try {
            await API.post("/reviews", {
                rating,
                comment,
                userId,
                collectionId
            });
            alert("Спасибо за отзыв!");
            onClose();
        } catch (err) {
            console.error("Ошибка при добавлении отзыва", err);
            alert("Ошибка отправки отзыва");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Оставить отзыв</h3>
                <StarRating value={rating} onChange={setRating} />
                <textarea
                    placeholder="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "6px",
                        borderRadius: "6px"
                    }}
                />
                <button onClick={handleSubmit} className="primary-btn">💬 Оставить отзыв</button>
                <button className="cancel" onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}