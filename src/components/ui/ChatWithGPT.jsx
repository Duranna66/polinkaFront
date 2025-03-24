import React, { useState } from 'react';

const ChatWithDeepSeek = () => {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'assistant', content: 'Привет, я бот и готов ответить на твои вопросы' }
    ]);
    const [input, setInput] = useState('');

    async function callDeepSeekAPI(allMessages) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-thinking-exp-1219:free',
                messages: allMessages,
                stream: false
            })
        });
        const data = await response.json();
        return data;
    }

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1) Сообщение пользователя
        const userMsg = { role: 'user', content: input };
        setInput('');

        // 2) Добавляем сообщение пользователя + сообщение "..."
        //    (вместо того, чтобы ждать ответа).
        setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '...' }]);

        try {
            // Отправляем запрос: передаём весь массив (включая новое userMsg)
            // Но можно также передать [...prevMessages, userMsg] — главное, чтобы
            // система знала о всех предыдущих сообщениях.
            const newMessages = [...messages, userMsg];
            const data = await callDeepSeekAPI(newMessages);

            // 3) Когда получаем ответ, убираем "..." из конца массива и вставляем реальный ответ
            const assistantReply = data?.choices?.[0]?.message?.content || 'Нет ответа';

            setMessages(prev => {
                // Скопируем массив, уберём последний элемент, если это "..."
                const updated = [...prev];
                // Проверяем, есть ли в конце сообщение "..." от ассистента
                if (updated.length > 0 && updated[updated.length - 1].content === '...') {
                    updated.pop(); // убираем "..."
                }
                // Добавляем окончательный ответ
                updated.push({ role: 'assistant', content: assistantReply });
                return updated;
            });

        } catch (err) {
            console.error('Ошибка при обращении к API:', err);

            // Если запрос не удался, тоже убираем "..."
            setMessages(prev => {
                const updated = [...prev];
                if (updated.length > 0 && updated[updated.length - 1].content === '...') {
                    updated.pop();
                }
                // Добавляем сообщение об ошибке
                updated.push({ role: 'assistant', content: 'Ошибка при получении ответа' });
                return updated;
            });
        }
    };

    return (
        <div style={{ backgroundColor: "#ffe3aa", minHeight: "100vh" }}>
            {/* Фиксированный блок чата справа снизу */}
            <div
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    backgroundColor: "#fff4d1",
                    width: "400px",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                }}
            >
                <h2 style={{ marginTop: 0, textAlign: "center" }}>Чат с DeepSeek</h2>

                {/* Окно чата */}
                <div
                    style={{
                        border: '1px solid #ccc',
                        padding: '1rem',
                        marginBottom: '1rem',
                        height: '300px',
                        overflowY: 'auto',
                        backgroundColor: "#fffdea",
                        borderRadius: "0.5rem"
                    }}
                >
                    {messages
                        .filter(m => m.role !== 'system') // скрыть системное
                        .map((msg, index) => (
                            <p key={index} style={{ margin: "0.5rem 0" }}>
                                <strong>{msg.role === 'user' ? 'Вы' : 'DeepSeek'}:</strong> {msg.content}
                            </p>
                        ))}
                </div>

                {/* Поле ввода и кнопка */}
                <div>
          <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                  width: '100%',
                  marginBottom: '0.5rem',
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem"
              }}
          />
                    <button
                        onClick={handleSend}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            backgroundColor: "#ffbb33",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWithDeepSeek;