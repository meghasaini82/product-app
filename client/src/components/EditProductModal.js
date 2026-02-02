import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import './Modal.css';

const EditProductModal = ({ product, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        productName: '',
        productType: 'Foods',
        quantityStock: '',
        mrp: '',
        sellingPrice: '',
        brandName: '',
        exchangeEligibility: 'No'
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const productTypes = ['Foods', 'Electronics', 'Clothing', 'Books', 'Toys', 'Other'];
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (product) {
            setFormData({
                productName: product.productName,
                productType: product.productType,
                quantityStock: product.quantityStock,
                mrp: product.mrp,
                sellingPrice: product.sellingPrice,
                brandName: product.brandName,
                exchangeEligibility: product.exchangeEligibility
            });
            setExistingImages(product.images || []);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (existingImages.length + images.length + files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        setImages(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            await productAPI.update(product._id, formDataToSend);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Product</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Type</label>
                        <select
                            name="productType"
                            value={formData.productType}
                            onChange={handleChange}
                            required
                        >
                            {productTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity Stock</label>
                            <input
                                type="number"
                                name="quantityStock"
                                value={formData.quantityStock}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>MRP</label>
                            <input
                                type="number"
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Selling Price</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Brand Name</label>
                            <input
                                type="text"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Existing Images</label>
                        {existingImages.length > 0 && (
                            <div className="image-previews">
                                {existingImages.map((img, index) => (
                                    <div key={index} className="preview-item">
                                        <img
                                            src={`${API_URL}${img}`}
                                            alt={`Existing ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100?text=Error';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Upload Additional Images</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                id="edit-images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="edit-images" className="upload-btn">
                                Add More Photos
                            </label>
                        </div>

                        {previews.length > 0 && (
                            <div className="image-previews">
                                {previews.map((preview, index) => (
                                    <div key={index} className="preview-item">
                                        <img src={preview} alt={`New ${index + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="remove-preview"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Exchange or return eligibility</label>
                        <select
                            name="exchangeEligibility"
                            value={formData.exchangeEligibility}
                            onChange={handleChange}
                            required
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;