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

        const userMsg = { role: 'user', content: input };
        setInput('');
        setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '...' }]);

        try {
            const newMessages = [...messages, userMsg];
            const data = await callDeepSeekAPI(newMessages);
            const assistantReply = data?.choices?.[0]?.message?.content || 'Нет ответа';

            setMessages(prev => {
                const updated = [...prev];
                if (updated[updated.length - 1]?.content === '...') {
                    updated.pop();
                }
                updated.push({ role: 'assistant', content: assistantReply });
                return updated;
            });

        } catch (err) {
            console.error('Ошибка при обращении к API:', err);
            setMessages(prev => {
                const updated = [...prev];
                if (updated[updated.length - 1]?.content === '...') {
                    updated.pop();
                }
                updated.push({ role: 'assistant', content: 'Ошибка при получении ответа' });
                return updated;
            });
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                backgroundColor: "#e6f0ff",
                width: "240px",
                borderRadius: "0.75rem",
                padding: "1rem",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                zIndex: 9999
            }}
        >
            <h2 style={{ marginTop: 0, textAlign: "center", fontSize: "1.1rem" }}>Чат с DeepSeek</h2>

            {/* Окно чата */}
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    marginBottom: '0.75rem',
                    height: '130px',
                    overflowY: 'auto',
                    backgroundColor: "#f9fbff",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem"
                }}
            >
                {messages
                    .filter(m => m.role !== 'system')
                    .map((msg, index) => (
                        <p key={index} style={{ margin: "0.4rem 0" }}>
                            <strong>{msg.role === 'user' ? 'Вы' : 'DeepSeek'}:</strong> {msg.content}
                        </p>
                    ))}
            </div>

            {/* Ввод и кнопка */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    width: '100%',
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                    padding: "0.4rem",
                    fontSize: "0.8rem",
                    resize: "none",
                    outline: "none"
                }}
            />
                <button
                    onClick={handleSend}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        backgroundColor: "#3399ff",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        cursor: "pointer"
                    }}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default ChatWithDeepSeek;