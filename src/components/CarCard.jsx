import React from "react";
import { Link } from "react-router-dom";

const CarCard = ({ car }) => {
    return (
        <div className="product-item">
            <img src={car.imageUrl} alt={car.model} width="300" />
            <h3><Link to={`/catalog/${car.id}`}>{car.model}</Link></h3>
            <p>{car.description}</p>
            <p><strong>Цена:</strong> {car.price.toLocaleString()} ₽</p>

        </div>
    );
};

export default CarCard;