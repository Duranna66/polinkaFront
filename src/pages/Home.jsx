import React from "react";
import "./Home.css";
import teamImage from "./team.png"
import ChatWithGPT from "../components/Chat/ChatWithGPT";

const Home = () => {
    return (
        <main>
            <section className="about">
                <h2>О нас</h2>
                <p>
                    Автосалон RENAULT — это официальный дилер французского автопроизводителя в вашем регионе.
                    Мы предлагаем полный спектр услуг: от продажи новых автомобилей до сервисного обслуживания и оригинальных запчастей.
                </p>
            </section>

            <section className="history">
                <h2>История фирмы</h2>
                <p>
                    Наш автосалон работает на рынке с 2005 года. За это время мы обслужили более 10 000 клиентов
                    и стали лидером по продажам Renault в регионе. Мы гордимся своей репутацией и стремимся к постоянному улучшению сервиса.
                </p>
            </section>

            <section className="team">
                <h2>Наши сотрудники</h2>
                <img
                    src={teamImage}
                    alt="Наша команда"
                    className="team-photo"
                />
                <p>
                    Наш дружный коллектив состоит из профессионалов с многолетним опытом работы.
                    Каждый сотрудник проходит регулярное обучение и сертификацию у производителя,
                    чтобы предоставлять клиентам самую актуальную информацию и качественный сервис.
                </p>
            </section>
            <ChatWithGPT></ChatWithGPT>
        </main>
    );
};

export default Home;