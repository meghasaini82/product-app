const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// ✅ Helper: get base URL (prefer env for production)
const getBaseUrl = (req) => {
    return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { isPublished } = req.query;

        let filter = { createdBy: req.user._id };

        if (isPublished !== undefined) {
            filter.isPublished = isPublished === 'true';
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name emailOrPhone');

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name emailOrPhone');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.createdBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this product'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const {
            productName,
            productType,
            quantityStock,
            mrp,
            sellingPrice,
            brandName,
            exchangeEligibility
        } = req.body;

        const baseUrl = getBaseUrl(req);

        // ✅ Full image URLs (fix mixed content)
        const images = req.files
            ? req.files.map(file => `${baseUrl}/uploads/${file.filename}`)
            : [];

        const product = await Product.create({
            productName,
            productType,
            quantityStock,
            mrp,
            sellingPrice,
            brandName,
            images,
            exchangeEligibility: exchangeEligibility || 'No',
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        // Update fields
        const {
            productName,
            productType,
            quantityStock,
            mrp,
            sellingPrice,
            brandName,
            exchangeEligibility
        } = req.body;

        if (productName) product.productName = productName;
        if (productType) product.productType = productType;
        if (quantityStock !== undefined) product.quantityStock = quantityStock;
        if (mrp !== undefined) product.mrp = mrp;
        if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
        if (brandName) product.brandName = brandName;
        if (exchangeEligibility) product.exchangeEligibility = exchangeEligibility;

        // ✅ Handle new images with full URL
        if (req.files && req.files.length > 0) {
            const baseUrl = getBaseUrl(req);
            const newImages = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
            product.images = [...product.images, ...newImages];
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        // ✅ Delete images from uploads folder (works for full URL and relative paths)
        product.images.forEach((imagePath) => {
            let relPath = imagePath; // default

            try {
                if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
                    relPath = new URL(imagePath).pathname; // e.g. /uploads/abc.png
                }
            } catch (e) { }

            const fullPath = path.join(__dirname, '..', relPath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        });

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Toggle publish status
exports.togglePublish = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this product'
            });
        }

        product.isPublished = !product.isPublished;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product ${product.isPublished ? 'published' : 'unpublished'} successfully`,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product status',
            error: error.message
        });
    }
};
