import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        topic: "",
        message: "",
        subscribe: false
    });

    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("📨 Отправлено:", form);
        setSuccess(true);

        setTimeout(() => setSuccess(false), 3000);

        setForm({
            name: "",
            email: "",
            topic: "",
            message: "",
            subscribe: false
        });
    };

    return (
        <div className="contact-form-wrapper">
            {success && <div className="toast-success">✅ Сообщение успешно отправлено!</div>}

            <form className="contact-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Имя" value={form.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <select name="topic" value={form.topic} onChange={handleChange} required>
                    <option value="">Тема обращения</option>
                    <option value="question">Вопрос</option>
                    <option value="test-drive">Тест-драйв</option>
                    <option value="service">Сервис</option>
                    <option value="other">Другое</option>
                </select>
                <textarea name="message" placeholder="Сообщение" value={form.message} onChange={handleChange} rows="4" required />
                <label className="checkbox">
                    <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={handleChange} />
                    Подписаться на новости
                </label>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};

export default ContactForm;