// 📁 src/components/NotificationBanner.jsx
import "./NotificationBanner.css";

export default function NotificationBanner({ message, type = "success", onClose }) {
    if (!message) return null;

    return (
        <div className={`notification ${type}`}>
            {message}
            <button onClick={onClose}>✖</button>
        </div>
    );
}