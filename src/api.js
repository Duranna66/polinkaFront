// src/api.js
const BASE_URL = "/api"; // меняй при необходимости

export async function getPopularCars() {
    const res = await fetch(`${BASE_URL}/cars`);
    return await res.json();
}

export async function searchCars(query) {
    const res = await fetch(`${BASE_URL}/cars/search?q=${encodeURIComponent(query)}`);
    return await res.json();
}

export async function getCarById(id) {
    const res = await fetch(`${BASE_URL}/cars/${id}`);
    return await res.json();
}

export async function loginUser(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        throw new Error("Ошибка входа");
    }

    return await res.json();
}

export async function registerUser(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Ошибка регистрации");
    }

    return await res.text(); // вернёт "Регистрация успешна"
}

// ✅ Получить корзину пользователя
export async function getCart(email) {
    const res = await fetch(`${BASE_URL}/cart/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Ошибка при получении корзины");
    return await res.json();
}

// ✅ Добавить товар в корзину
export async function addToCart({ email, carId }) {
    const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, carId }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Не удалось добавить в корзину");
    }

    return await res.text(); // например, "Добавлено"
}

export async function removeFromCart(email, carId) {
    const res = await fetch(`${BASE_URL}/cart/remove?email=${email}&carId=${carId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Не удалось удалить из корзины");
    }

    return await res.text();
}