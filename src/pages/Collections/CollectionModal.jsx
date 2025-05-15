import { useState } from "react";
import API from "../../api/authFetch";
import ShareModal from "./ShareModal";
import ReviewModal from "./ReviewModal";
import AllReviewsModal from "./AllReviewsModal";

export default function CollectionModal({ collection, onClose, onUpdate }) {
    const [showShare, setShowShare] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const handleRemoveRoute = async (routeId) => {
        try {
            await API.delete(`/routes/${routeId}`);
            const updated = await API.get("/collections");
            onUpdate(updated.data);
        } catch (err) {
            console.error("Ошибка удаления маршрута", err);
        }
    };

    const handleDeleteCollection = async () => {
        try {
            await API.delete(`/collections/${collection.id}`);
            const updated = await API.get("/collections");
            onUpdate(updated.data);
            onClose();
        } catch (err) {
            console.error("Ошибка удаления коллекции", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{collection.name}</h2>

                <ul style={{ marginTop: "1rem", padding: 0 }}>
                    {collection.routeDto.map((route) => (
                        <li key={route.id} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                            listStyle: "none"
                        }}>
                            <span><strong>{route.title}</strong></span>
                            <button
                                onClick={() => handleRemoveRoute(route.id)}
                                style={{
                                    backgroundColor: "#e53935",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>

                <hr />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
                    <button
                        onClick={() => setShowShare(true)}
                        style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        📤 Поделиться
                    </button>

                    <button
                        onClick={() => setShowReview(true)}
                        style={{
                            backgroundColor: "#6a1b9a",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        💬 Оставить отзыв
                    </button>

                    <button
                        onClick={() => setShowAllReviews(true)}
                        style={{
                            backgroundColor: "#4a148c",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        🗨️ Посмотреть отзывы
                    </button>
                </div>

                <hr />
                <button className="danger" onClick={handleDeleteCollection}>Удалить коллекцию</button>
                <button className="cancel" onClick={onClose}>Закрыть</button>
            </div>

            {showShare && (
                <ShareModal
                    collectionId={collection.id}
                    onClose={() => setShowShare(false)}
                />
            )}

            {showReview && (
                <ReviewModal
                    collectionId={collection.id}
                    onClose={() => setShowReview(false)}
                />
            )}

            {showAllReviews && (
                <AllReviewsModal
                    collectionId={collection.id}
                    onClose={() => setShowAllReviews(false)}
                />
            )}
        </div>
    );
}