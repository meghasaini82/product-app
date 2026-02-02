import React, { useState } from 'react';
import { productAPI } from '../services/api';
import './Modal.css';

const AddProductModal = ({ onClose, onSuccess }) => {
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
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const productTypes = ['Foods', 'Electronics', 'Clothing', 'Books', 'Toys', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        setImages(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append form fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            // Append images
            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            await productAPI.create(formDataToSend);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Product</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            placeholder="CakeZone Walnut Brownie"
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
                                placeholder="Total numbers of Stock available"
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
                                placeholder="Total numbers of Stock available"
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
                                placeholder="Total numbers of Stock available"
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
                                placeholder="Total numbers of Stock available"
                                value={formData.brandName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Upload Product Images</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="images" className="upload-btn">
                                Browse
                            </label>
                            <span className="upload-text">Enter Description</span>
                        </div>

                        {previews.length > 0 && (
                            <div className="image-previews">
                                {previews.map((preview, index) => (
                                    <div key={index} className="preview-item">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
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
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;