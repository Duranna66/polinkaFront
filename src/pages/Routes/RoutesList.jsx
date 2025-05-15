import { useEffect, useState } from "react";
import API from "../../api/authFetch";

function RoutesList() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await API.get("api/routes");
                setRoutes(res.data);
            } catch (err) {
                console.error("Ошибка при загрузке маршрутов", err);
                alert("Ошибка при загрузке маршрутов");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    if (loading) return <p>Загрузка маршрутов...</p>;

    return (
        <div>
            <h2>Маршруты</h2>
            {routes.length === 0 ? (
                <p>Маршрутов пока нет</p>
            ) : (
                <ul>
                    {routes.map((route) => (
                        <li key={route.id}>
                            <strong>{route.title}</strong><br />
                            {route.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RoutesList;