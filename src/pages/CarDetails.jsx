import React, { useEffect, useState } from "react";
import "./CarDetails.css";
import { useParams } from "react-router-dom";
import {addToCart, getCarById} from "../api";

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCarById(id)
            .then(data => {
                setCar(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Авто не найдено");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;
    if (!car) return null;

    const { model, imageUrl, description, features, fullSpec, trims, fullText, price } = car;

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("❗ Войдите в аккаунт, чтобы добавить в корзину");
            return;
        }

        try {
            const message = await addToCart({ email: user.email, carId: car.id });
            alert("✅ " + message);
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <main className="details-container">
            <h2>{model}</h2>
            <section className="product-main">
                <img src={imageUrl} alt={model} className="product-image" />
                <div className="product-description">
                    <h3>Описание товара</h3>
                    <p><i>{description}</i></p>

                    {fullSpec && (
                        <>
                            <h3>Технические характеристики</h3>
                            <table className="specs-table">
                                <tbody>
                                <tr><td>Двигатель</td><td>{fullSpec.engine}</td></tr>
                                <tr><td>Коробка</td><td>{fullSpec.transmission}</td></tr>
                                <tr><td>Разгон</td><td>{fullSpec.acceleration}</td></tr>
                                <tr><td>Расход топлива</td><td>{fullSpec.fuel}</td></tr>
                                <tr><td>Кузов</td><td>{fullSpec.body}</td></tr>
                                <tr><td>Багажник</td><td>{fullSpec.trunk}</td></tr>
                                </tbody>
                            </table>
                        </>
                    )}

                    {trims?.length > 0 && (
                        <>
                            <h3>Комплектации</h3>
                            <table className="price-table">
                                <tbody>
                                {trims.map((trim, i) => (
                                    <tr key={i}>
                                        <td>{trim.name}</td>
                                        <td>{trim.engine}</td>
                                        <td className="price">₽ {trim.price.toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {features?.length > 0 && (
                        <>
                            <h3>Характеристики товара</h3>
                            <ul>{features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                        </>
                    )}

                    {fullText && (
                        <>
                            <h3>Подробное описание товара</h3>
                            <p>{fullText}</p>
                        </>
                    )}

                    <button onClick={handleAddToCart} style={{ marginTop: "20px" }}>
                        🛒 Добавить в корзину
                    </button>
                </div>
            </section>
        </main>
    );
};

export default CarDetails;