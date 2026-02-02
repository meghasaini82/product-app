import React from 'react';
import './Modal.css';

const DeleteConfirmModal = ({ product, onClose, onConfirm }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Delete Product</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <p className="delete-warning">
                        Are you sure you really want to delete this Product "<strong>{product.productName}</strong>"?
                    </p>
                    <p className="delete-subtext">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="modal-actions">
                    <button
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-delete"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;