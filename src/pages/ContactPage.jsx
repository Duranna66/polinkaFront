import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const phone = e.target.phone.value;
        const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;

        if (!phoneRegex.test(phone)) {
            alert("Пожалуйста, введите корректный номер телефона");
            return;
        }

        // Здесь можно добавить отправку на сервер
        console.log("📨 Данные отправлены:", Object.fromEntries(new FormData(e.target)));

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        e.target.reset();
    };

    return (
        <main>
            {showSuccess && (
                <div className="toast-success">✅ Сообщение успешно отправлено!</div>
            )}

            <section className="contact-form">
                <h2>Напишите нам</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Имя:</label>
                        <input type="text" id="name" name="name" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон:</label>
                        <input type="tel" id="phone" name="phone" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Тема:</label>
                        <select id="subject" name="subject" required>
                            <option value="">Выберите тему</option>
                            <option value="question">Вопрос по автомобилям</option>
                            <option value="test-drive">Запись на тест-драйв</option>
                            <option value="service">Сервисное обслуживание</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Сообщение:</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>

                    <div className="form-group">
                        <input type="checkbox" id="subscribe" name="subscribe" />
                        <label htmlFor="subscribe">Подписаться на новости и акции</label>
                    </div>

                    <button type="submit">Отправить</button>
                </form>
            </section>

            <section className="contact-info">
                <h2>Адрес</h2>
                <div className="info-grid">
                    <div>
                        <h3>Контактный телефон:</h3>
                        <p>+7 (XXX) XXX-XX-XX</p>
                    </div>
                    <div>
                        <h3>Адрес автосалона:</h3>
                        <p>г. Москва, ул. Автомобильная, д. 1</p>
                    </div>
                    <div>
                        <h3>Email:</h3>
                        <p>info@renault-autosalon.ru</p>
                    </div>
                    <div>
                        <h3>Часы работы:</h3>
                        <p>Пн-Пт: 9:00 - 20:00<br />Сб-Вс: 10:00 - 18:00</p>
                    </div>
                </div>

                <div className="map-fullwidth">
                    <h3>Мы на карте:</h3>
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j&amp;source=constructor"
                        width="100%"
                        height="400"
                        frameBorder="0"
                        title="map"
                    ></iframe>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;