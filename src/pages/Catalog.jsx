import React, { useEffect, useState } from "react";
import "./Home.css";
import "./Catalog.css";
import { Link, useLocation } from "react-router-dom";
import CarCard from "../components/CarCard";
import SearchForm from "../components/SearchForm";
import { getPopularCars, searchCars } from "../api";

const useQuery = () => new URLSearchParams(useLocation().search);

const Catalog = ({ setLocalCars }) => {
    const query = useQuery();
    const search = query.get("search") || "";
    const [sliderIndex, setSliderIndex] = useState(0);
    const [popularCars, setPopularCars] = useState([]);
    const [allCars, setAllCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);


    useEffect(() => {
        if (search === "") {
            getPopularCars().then(data => {
                setPopularCars(data.filter(car => car.popular === true));
                setAllCars(data);
                setLocalCars(data);
            });
        } else {
            searchCars(search).then(setFilteredCars);
        }
    }, [search]);

    const prevSlide = () =>
        setSliderIndex((prev) => (prev === 0 ? popularCars.length - 1 : prev - 1));
    const nextSlide = () =>
        setSliderIndex((prev) => (prev === popularCars.length - 1 ? 0 : prev + 1));

    return (
        <main>
            {search === "" && popularCars.length > 0 && (
                <>
                    <h2>Популярные модели</h2>
                    <div className="slider-container">
                        <button className="nav-btn" onClick={prevSlide}>←</button>
                        <div className="slide">
                            <img
                                src={popularCars[sliderIndex].imageUrl}
                                alt={popularCars[sliderIndex].model}
                            />
                            <h3>
                                <Link to={`/catalog/${popularCars[sliderIndex].id}`}>
                                    {popularCars[sliderIndex].model}
                                </Link>
                            </h3>
                            <p>{popularCars[sliderIndex].description}</p>
                            <p><strong>{popularCars[sliderIndex].price.toLocaleString()} ₽</strong></p>
                        </div>
                        <button className="nav-btn" onClick={nextSlide}>→</button>
                    </div>
                </>
            )}

            <h2 style={{ marginTop: "40px" }}>
                {search ? `Результаты поиска: "${search}"` : "Все автомобили"}
            </h2>

            <div className="products">
                {(search ? filteredCars : allCars).map((car) => (
                    <CarCard key={car.id} car={car} />
                ))}
                {search && filteredCars.length === 0 && <p>Ничего не найдено</p>}
            </div>
        </main>
    );
};

export default Catalog;