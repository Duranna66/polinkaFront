import React, { useEffect, useState } from "react";
import "./RequestDocumentForm.css";
import { checkAuth, submitDocumentRequest, getAllStudents } from "../api";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const RequestDocumentForm = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [docType, setDocType] = useState("Справка об обучении");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            try {
                await checkAuth();
                const all = await getAllStudents();
                setStudents(all);
            } catch (err) {
                navigate("/auth");
            }
        };
        init();
    }, [navigate]);

    const handleSubmit = async () => {
        if (!selectedStudent || !reason.trim()) {
            setError("Выберите студента и укажите причину");
            return;
        }

        try {
            const request = {
                userId: selectedStudent.value,
                fullName: selectedStudent.label,
                docType: docType,
                reason,
            };

            await submitDocumentRequest(request);
            alert("Заявка успешно отправлена");
            setError("");
        } catch (err) {
            setError("Заявка успешно отправлена");
        }
    };

    const studentOptions = students.map((s) => ({
        value: s.id,
        label: s.fullName,
    }));

    return (
        <div className="request-container">
            <h1>Подача заявки на документ</h1>

            {error && <p className="error">{error}</p>}

            <label>Студент</label>
            <Select
                options={studentOptions}
                value={selectedStudent}
                onChange={setSelectedStudent}
                placeholder="Выберите студента"
                isSearchable
            />

            <label>Тип документа</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option>Справка об обучении</option>
                <option>Копия диплома</option>
                <option>Академическая справка</option>
            </select>

            <label>Причина запроса</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)}/>

            <button onClick={handleSubmit}>Отправить заявку</button>
            <button onClick={() => navigate("/main")}>Вернуться в меню</button>
        </div>
    );
};

export default RequestDocumentForm;