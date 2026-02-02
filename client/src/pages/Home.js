import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { productAPI } from "../services/api";
import "./Home.css";

const Home = () => {
    const [activeTab, setActiveTab] = useState("published");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const isPublished = activeTab === "published";
                const response = await productAPI.getAll(isPublished);

                const data = response?.data;

                // ✅ Handle multiple possible backend response shapes safely
                const list =
                    data?.products ??          // { products: [...] }
                    data?.data?.products ??    // { data: { products: [...] } }
                    data?.data ??              // { data: [...] }
                    [];                        // fallback

                setProducts(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeTab]);

    const renderProducts = () => {
        if (loading) return <div className="loading">Loading...</div>;

        if (!products || products.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>

                    <h3>
                        {activeTab === "published"
                            ? "No Published Products"
                            : "Feels a little empty over here..."}
                    </h3>

                    <p>
                        {activeTab === "published"
                            ? "Your Published Products will appear here."
                            : "No Unpublished Products are available."}
                    </p>

                    <button className="btn-primary" onClick={() => navigate("/products")}>
                        Add your Products
                    </button>
                </div>
            );
        }

        return (
            <div className="products-grid">
                {products.map((product) => {
                    // ✅ Field fallbacks (in case backend uses different names)
                    const name =
                        product?.productName ||
                        product?.name ||
                        product?.title ||
                        "Untitled Product";

                    const brand =
                        product?.brandName ||
                        product?.brand ||
                        product?.company ||
                        "—";

                    const price =
                        product?.sellingPrice ??
                        product?.price ??
                        product?.mrp ??
                        "—";

                    const key = product?._id || product?.id || `${name}-${brand}`;

                    return (
                        <div key={key} className="product-card">
                            <h4>{name}</h4>
                            <p>Brand: {brand}</p>
                            <p>Price: ₹{price}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="home-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />

                <div className="home-container">
                    <div className="tabs">
                        <button
                            className={activeTab === "published" ? "active" : ""}
                            onClick={() => setActiveTab("published")}
                            type="button"
                        >
                            Published
                        </button>

                        <button
                            className={activeTab === "unpublished" ? "active" : ""}
                            onClick={() => setActiveTab("unpublished")}
                            type="button"
                        >
                            Unpublished
                        </button>
                    </div>

                    <div className="products-display">{renderProducts()}</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
