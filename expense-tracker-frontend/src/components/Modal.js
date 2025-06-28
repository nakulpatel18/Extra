import React from 'react';
import './Modal.css';

const Modal = ({ onClose, children }) => {
    return (
        <div className="glass-modal-overlay" onClick={onClose}>
            <div className="glass-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="glass-close-btn" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
