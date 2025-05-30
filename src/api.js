const BASE_URL = "http://localhost:8080/api/v1";

// универсальный fetch с включённой сессией
async function fetchWithSession(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: "include", // 🔑 сохраняет и отправляет JSESSIONID
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// 🔐 Аутентификация
export async function loginUser(credentials) {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error("Неверные данные для входа");

    return res.text(); // опционально вернёт "вход выполнен"
}

export async function checkAuth() {
    const res = await fetch(`${BASE_URL}/auth/check`, {
        credentials: "include",
    });
    console.log(res);
    if (!res.ok) {
        throw new Error("Пользователь не авторизован");
    }

    return res.json(); // ожидается { studentId: ... }
}

// 👤 Студент
export async function getStudentProfile(id) {
    return fetchWithSession(`${BASE_URL}/student/${id}`);
}

export async function updateStudentProfile(id, data) {
    return fetchWithSession(`${BASE_URL}/student/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// 📅 Расписание
export async function getSchedule(group) {
    return fetchWithSession(`${BASE_URL}/schedule/${group}`);
}

export async function saveSchedule(rows) {
    return fetchWithSession(`${BASE_URL}/schedule`, {
        method: "POST",
        body: JSON.stringify(rows),
    });
}

// 📚 Оценки
export async function getGrades(studentId) {
    return fetchWithSession(`${BASE_URL}/grades/${studentId}`);
}

export async function saveGrades(studentId, grades) {
    return fetchWithSession(`${BASE_URL}/grades/${studentId}`, {
        method: "POST",
        body: JSON.stringify(grades),
    });
}

// 📄 Заявки на документы
export async function submitDocumentRequest(doc) {
    return fetchWithSession(`${BASE_URL}/documents`, {
        method: "POST",
        body: JSON.stringify(doc),
    });
}

export async function getDocuments(studentId) {
    return fetchWithSession(`${BASE_URL}/documents/${studentId}`);
}


export async function getAllStudents() {
    return fetchWithSession(`${BASE_URL}/student/all`);
}
export async function createStudentProfile(data) {
    return fetchWithSession(`${BASE_URL}/student`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}