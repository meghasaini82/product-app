import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete, onTogglePublish }) => {
    // ✅ Use image URL directly. Backend should return full https URL.
    const imgSrc = product?.images?.[0] || '/no-image.png';

    return (
        <div className="product-card">
            <div className="product-image">
                {product?.images && product.images.length > 0 ? (
                    <img
                        src={imgSrc}
                        alt={product?.productName || 'Product'}
                        onError={(e) => {
                            e.currentTarget.src = '/no-image.png';
                        }}
                    />
                ) : (
                    <div className="no-image">No Image</div>
                )}
            </div>

            <div className="product-details">
                <h3>{product?.productName}</h3>

                <div className="product-info">
                    <div className="info-row">
                        <span className="label">Product Type:</span>
                        <span className="value">{product?.productType}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Quantity Stock:</span>
                        <span className="value">{product?.quantityStock}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">MRP:</span>
                        <span className="value">₹ {product?.mrp}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Selling Price:</span>
                        <span className="value">₹ {product?.sellingPrice}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Brand Name:</span>
                        <span className="value">{product?.brandName}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Total numbers of Images:</span>
                        <span className="value">{product?.images?.length || 0}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Exchange or return eligibility:</span>
                        <span className="value">{product?.exchangeEligibility}</span>
                    </div>
                </div>

                <div className="product-actions">
                    <button
                        className={`btn-publish ${product?.isPublished ? 'published' : 'unpublished'}`}
                        onClick={() => onTogglePublish(product)}
                    >
                        {product?.isPublished ? 'Published' : 'Unpublished'}
                    </button>

                    <button
                        className="btn-edit"
                        onClick={() => onEdit(product)}
                    >
                        Edit
                    </button>

                    <button
                        className="btn-delete-icon"
                        onClick={() => onDelete(product)}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
