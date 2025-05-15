import React from "react";

export default function StarRating({ value, onChange }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div style={{ display: "flex", gap: "5px", fontSize: "1.8rem", cursor: "pointer" }}>
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => onChange(star)}
                    style={{
                        color: star <= value ? "#ffc107" : "#e4e5e9",
                        transition: "color 0.2s ease"
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}