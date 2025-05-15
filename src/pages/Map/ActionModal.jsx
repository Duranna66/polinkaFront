// 📁 src/components/ActionModal.jsx
import "./ActionModal.css";

export default function ActionModal({ title, message, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="submit" onClick={onClose}>Ок</button>
                </div>
            </div>
        </div>
    );
}