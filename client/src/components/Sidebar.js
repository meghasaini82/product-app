import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/home', label: 'Home', icon: '🏠' },
        { path: '/products', label: 'Products', icon: '📦' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h2>Productr</h2>
            </div>

            <div className="sidebar-search">
                <input type="text" placeholder="Search" />
            </div>

            <nav className="sidebar-menu">
                {menuItems.map(item => (
                    <button
                        key={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;