import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCars } from "../api";
import "./SearchAutocomplete.css";

const SearchAutocomplete = ({ localCars }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    // Локальный фильтр по уже загруженным данным
    useEffect(() => {
        if (query.length > 1) {
            const matches = localCars.filter(car =>
                car.model.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    }, [query, localCars]);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/catalog?search=${encodeURIComponent(query)}`);
    };

    const handleSuggestionClick = (model) => {
        setQuery(model);
        navigate(`/catalog?search=${encodeURIComponent(model)}`);
    };

    return (
        <div className="autocomplete">
            <form onSubmit={handleSubmit} className="autocomplete-form">
                <input
                    type="search"
                    placeholder="Поиск по моделям..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                <button type="submit" className="search-btn">🔍</button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map(car => (
                        <li key={car.id} onClick={() => handleSuggestionClick(car.model)}>
                            {car.model}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchAutocomplete;