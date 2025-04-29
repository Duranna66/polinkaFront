import React, { useState, useRef } from 'react';

const ChatWithDeepSeek = () => {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'assistant', content: 'Привет, я бот и готов ответить на твои вопросы' }
    ]);
    const [input, setInput] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [size, setSize] = useState({ width: 300, height: 400 });

    const isResizing = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });

    const handleMouseDown = (e) => {
        if (!expanded) return;
        isResizing.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { ...size };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        setSize({
            width: Math.max(250, startSize.current.width - dx),
            height: Math.max(300, startSize.current.height - dy),
        });
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const callDeepSeekAPI = async (allMessages) => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: allMessages,
                stream: false
            })
        });
        return await response.json();
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setInput('');
        setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '...' }]);

        try {
            const newMessages = [...messages, userMsg];
            const data = await callDeepSeekAPI(newMessages);
            const reply = data?.choices?.[0]?.message?.content || 'Нет ответа';
            setMessages(prev => {
                const updated = [...prev];
                if (updated.at(-1)?.content === '...') updated.pop();
                return [...updated, { role: 'assistant', content: reply }];
            });
        } catch {
            setMessages(prev => {
                const updated = [...prev];
                if (updated.at(-1)?.content === '...') updated.pop();
                return [...updated, { role: 'assistant', content: 'Ошибка при получении ответа' }];
            });
        }
    };

    if (!expanded) {
        return (
            <div
                onClick={() => setExpanded(true)}
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#c084fc",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1a001f",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    zIndex: 9999,
                }}
            >
                💬
            </div>
        );
    }

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                backgroundColor: "#f3e8ff",
                color: "#1a001f",
                width: size.width,
                height: size.height,
                borderRadius: "0.75rem",
                padding: "1rem",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                cursor: "nwse-resize",
                userSelect: "none"
            }}
        >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem"
            }}>
                <h2 style={{ margin: 0, fontSize: "1rem", color: "#9333ea" }}>Чат с DeepSeek</h2>
                <button
                    onClick={() => setExpanded(false)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#9333ea",
                        fontSize: "1.2rem",
                        cursor: "pointer"
                    }}
                >
                    ⤫
                </button>
            </div>

            <div
                style={{
                    flex: 1,
                    border: '1px solid #e0b3ff',
                    padding: '0.5rem',
                    marginBottom: '0.75rem',
                    overflowY: 'auto',
                    backgroundColor: "#fff0ff",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem"
                }}
            >
                {messages
                    .filter(m => m.role !== 'system')
                    .map((msg, i) => (
                        <p key={i} style={{ margin: "0.4rem 0", color: "#3b0a4d" }}>
                            <strong>{msg.role === 'user' ? 'Вы' : 'DeepSeek'}:</strong> {msg.content}
                        </p>
                    ))}
            </div>

            <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    width: '100%',
                    borderRadius: "0.5rem",
                    border: "1px solid #d8b4fe",
                    padding: "0.4rem",
                    fontSize: "0.8rem",
                    resize: "none",
                    outline: "none",
                    marginBottom: "0.5rem",
                    backgroundColor: "#fff0ff",
                    color: "#1a001f",
                    boxSizing: "border-box"
                }}
            />

            <button
                onClick={handleSend}
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    backgroundColor: "#c084fc",
                    color: "#1a001f",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                }}
            >
                Отправить
            </button>
        </div>
    );
};

export default ChatWithDeepSeek;