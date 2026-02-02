import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { productAPI } from "../services/api";
import "./Products.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                let response;

                if (activeTab === "published") {
                    response = await productAPI.getAll(true);
                } else if (activeTab === "unpublished") {
                    response = await productAPI.getAll(false);
                } else {
                    response = await productAPI.getAll(); // all
                }

                const data = response?.data;

                // ✅ Handle multiple possible backend response shapes safely
                const list =
                    data?.products ??          // { products: [...] }
                    data?.data?.products ??    // { data: { products: [...] } }
                    data?.data ??              // { data: [...] }
                    [];                        // fallback

                if (isMounted) {
                    setProducts(Array.isArray(list) ? list : []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                if (isMounted) setProducts([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [activeTab]);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleTogglePublish = async (product) => {
        try {
            await productAPI.togglePublish(product._id);
            // refresh list after toggle
            // trigger re-fetch without changing tab:
            setLoading(true);
            const response =
                activeTab === "published"
                    ? await productAPI.getAll(true)
                    : activeTab === "unpublished"
                        ? await productAPI.getAll(false)
                        : await productAPI.getAll();

            const data = response?.data;
            const list = data?.products ?? data?.data?.products ?? data?.data ?? [];
            setProducts(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error("Error toggling publish status:", error);
            alert("Failed to update product status");
        } finally {
            setLoading(false);
        }
    };

    const handleProductAdded = async () => {
        setShowAddModal(false);
        // refresh
        setActiveTab((t) => t); // no-op but keeps intent clear
        setLoading(true);
        try {
            const response =
                activeTab === "published"
                    ? await productAPI.getAll(true)
                    : activeTab === "unpublished"
                        ? await productAPI.getAll(false)
                        : await productAPI.getAll();

            const data = response?.data;
            const list = data?.products ?? data?.data?.products ?? data?.data ?? [];
            setProducts(Array.isArray(list) ? list : []);
        } catch (e) {
            console.error(e);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductUpdated = async () => {
        setShowEditModal(false);
        setSelectedProduct(null);

        // refresh
        setLoading(true);
        try {
            const response =
                activeTab === "published"
                    ? await productAPI.getAll(true)
                    : activeTab === "unpublished"
                        ? await productAPI.getAll(false)
                        : await productAPI.getAll();

            const data = response?.data;
            const list = data?.products ?? data?.data?.products ?? data?.data ?? [];
            setProducts(Array.isArray(list) ? list : []);
        } catch (e) {
            console.error(e);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductDeleted = async () => {
        try {
            await productAPI.delete(selectedProduct._id);

            setShowDeleteModal(false);
            setSelectedProduct(null);

            // refresh
            setLoading(true);
            const response =
                activeTab === "published"
                    ? await productAPI.getAll(true)
                    : activeTab === "unpublished"
                        ? await productAPI.getAll(false)
                        : await productAPI.getAll();

            const data = response?.data;
            const list = data?.products ?? data?.data?.products ?? data?.data ?? [];
            setProducts(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="products-layout">
            <Sidebar />

            <div className="main-content">
                <Navbar />

                <div className="products-container">
                    <div className="products-header">
                        <h1>Products</h1>
                        <button
                            type="button"
                            className="btn-add-product"
                            onClick={() => setShowAddModal(true)}
                        >
                            + Add Products
                        </button>
                    </div>

                    <div className="tabs">
                        <button
                            type="button"
                            className={activeTab === "all" ? "active" : ""}
                            onClick={() => setActiveTab("all")}
                        >
                            All Products
                        </button>
                        <button
                            type="button"
                            className={activeTab === "published" ? "active" : ""}
                            onClick={() => setActiveTab("published")}
                        >
                            Published
                        </button>
                        <button
                            type="button"
                            className={activeTab === "unpublished" ? "active" : ""}
                            onClick={() => setActiveTab("unpublished")}
                        >
                            Unpublished
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No products found</h3>
                            <p>Start by adding your first product</p>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Product
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard
                                    key={product?._id || product?.id || `${product?.productName || "p"}-${product?.brandName || "b"}`}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onTogglePublish={handleTogglePublish}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleProductAdded}
                />
            )}

            {showEditModal && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    onSuccess={handleProductUpdated}
                />
            )}

            {showDeleteModal && selectedProduct && (
                <DeleteConfirmModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedProduct(null);
                    }}
                    onConfirm={handleProductDeleted}
                />
            )}
        </div>
    );
};

export default Products;
