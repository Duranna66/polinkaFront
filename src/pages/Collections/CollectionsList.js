import { useEffect, useState } from "react";
import ActionModal from "../Map/ActionModal";
import API from "../../api/authFetch";
import CollectionModal from "./CollectionModal"; // ✅ твой новый компонент модалки

export default function CollectionsList({ collections, setCollections, onAddClick }) {
    const [actionModal, setActionModal] = useState({ show: false, title: "", message: "" });
    const [activeCollection, setActiveCollection] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get("/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Ошибка при загрузке пользователей", err));
    }, []);

    const openCollectionModal = (collection) => {
        setActiveCollection(collection);
    };

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem"
            }}>
                <h2 style={{ margin: 0 }}>📅 Мои коллекции</h2>
                <button onClick={onAddClick} style={{
                    backgroundColor: "#9333ea",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}>
                    ➕ Добавить коллекцию
                </button>
            </div>

            {collections.length === 0 ? (
                <div className="empty-collections">Коллекции не найдены</div>
            ) : (
                <ul>
                    {collections.map((c) => (
                        <li
                            key={c.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => openCollectionModal(c)}
                        >
                            <strong>{c.name}</strong>
                        </li>
                    ))}
                </ul>
            )}

            {/* ✅ Подключаем новую модалку */}
            {activeCollection && (
                <CollectionModal
                    collection={activeCollection}
                    onClose={() => setActiveCollection(null)}
                    onUpdate={setCollections}
                    users={users}
                />
            )}

            {actionModal.show && (
                <ActionModal
                    title={actionModal.title}
                    message={actionModal.message}
                    onClose={() => setActionModal({ ...actionModal, show: false })}
                />
            )}
        </div>
    );
}