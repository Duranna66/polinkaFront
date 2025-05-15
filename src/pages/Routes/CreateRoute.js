import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/authFetch";

function CreateRoute() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("api/routes", {
                title,
                description,
            });
        } catch (err) {
            alert("Ошибка при создании маршрута");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h2>Создание нового маршрута</h2>
            <form onSubmit={handleSubmit}>
                <label>Название маршрута</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например, По историческому центру"
                    required
                />

                <label>Описание</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Краткое описание маршрута"
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Создание..." : "Создать маршрут"}
                </button>
            </form>
        </div>
    );
}

export default CreateRoute;