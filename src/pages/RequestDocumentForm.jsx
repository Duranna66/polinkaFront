import React, { useState } from "react";
import "./RequestDocumentForm.css";

const RequestDocumentForm = () => {
    const [fullName, setFullName] = useState("Иванов Иван");
    const [docType, setDocType] = useState("Справка об обучении");
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        alert("Заявка отправлена (замокано)");
    };

    return (
        <div className="request-container">
            <h1>Подача заявки на документ</h1>

            <label>ФИО</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <label>Тип документа</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option>Справка об обучении</option>
                <option>Копия диплома</option>
                <option>Академическая справка</option>
            </select>

            <label>Причина запроса</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} />

            <button onClick={handleSubmit}>Отправить заявку</button>
        </div>
    );
};

export default RequestDocumentForm;
