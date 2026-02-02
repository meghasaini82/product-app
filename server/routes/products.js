const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Always use absolute uploads path (server/uploads)
const uploadsDir = path.join(__dirname, '..', 'uploads');

// ✅ Ensure uploads folder exists (prevents ENOENT on Render)
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only image files are allowed!'));
    }
});

// All routes require authentication
router.use(auth);

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProductById);

// POST /api/products - Create product (with image upload)
router.post('/', upload.array('images', 5), productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', upload.array('images', 5), productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

// PATCH /api/products/:id/publish - Toggle publish status
router.patch('/:id/publish', productController.togglePublish);

module.exports = router;
