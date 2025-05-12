import React from "react";
import "./SearchForm.css";

const SearchForm = ({ search, setSearch }) => {
    return (
        <input
            type="text"
            className="search-input"
            placeholder="Поиск по модели"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    );
};

export default SearchForm;