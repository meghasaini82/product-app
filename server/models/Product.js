const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    productType: {
        type: String,
        required: [true, 'Product type is required'],
        enum: ['Foods', 'Electronics', 'Clothing', 'Books', 'Toys', 'Other']
    },
    quantityStock: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 0
    },
    mrp: {
        type: Number,
        required: [true, 'MRP is required'],
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required'],
        min: 0
    },
    brandName: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true
    },
    images: [{
        type: String // Store image URLs/paths
    }],
    exchangeEligibility: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before save
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema);