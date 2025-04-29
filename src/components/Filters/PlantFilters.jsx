import React from "react";

const PlantFilters = ({
                          uniqueTypes,
                          uniqueRegions,
                          setTypeFilter,
                          setRegionFilter,
                          users,
                          selectedUserId,
                          setSelectedUserId,
                          isAdmin
                      }) => (
    <div
        className="filters"
        style={{
            display: "flex",

            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem"
        }}
    >
        <select
            className="select"
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
                padding: "0.6rem 1rem",
                borderRadius: "12px",
                backgroundColor: "#f3e8ff",
                color: "#1a001f",
                border: "none",
                fontSize: "1rem",
                minWidth: "180px"
            }}
        >
            <option value="">Фильтр по типу</option>
            {uniqueTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
            ))}
        </select>

        <select
            className="select"
            onChange={(e) => setRegionFilter(e.target.value)}
            style={{
                padding: "0.6rem 1rem",
                borderRadius: "12px",
                backgroundColor: "#f3e8ff",
                color: "#1a001f",
                border: "none",
                fontSize: "1rem",
                minWidth: "180px"
            }}
        >
            <option value="">Фильтр по региону</option>
            {uniqueRegions.map((region, idx) => (
                <option key={idx} value={region}>{region}</option>
            ))}
        </select>

        {isAdmin && (
            <select
                className="select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "12px",
                    backgroundColor: "#f3e8ff",
                    color: "#1a001f",
                    border: "none",
                    fontSize: "1rem",
                    minWidth: "180px"
                }}
            >
                <option value="">Все пользователи</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.username} ({user.region})
                    </option>
                ))}
            </select>
        )}
    </div>
);

export default PlantFilters;