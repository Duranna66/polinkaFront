import { useEffect, useState } from "react";
import API from "../../api/authFetch";
import StarRating from "./StarRating"; // если хочешь красиво отрисовать звёзды

export default function AllReviewsModal({ collectionId, onClose }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!collectionId) return;

        API.get(`/reviews/${collectionId}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Ошибка загрузки отзывов", err));
    }, [collectionId]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Отзывы</h3>

                {reviews.length === 0 ? (
                    <p style={{ color: "#888" }}>Отзывов пока нет</p>
                ) : (
                    <ul style={{ padding: 0 }}>
                        {reviews.map((r, i) => (
                            <li
                                key={i}
                                style={{
                                    listStyle: "none",
                                    marginBottom: "16px",
                                    padding: "8px",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "6px"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <strong>⭐ {r.rating}</strong>
                                </div>
                                <p style={{ margin: "6px 0 0" }}>{r.comment || "Без комментария"}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <button className="cancel" onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}