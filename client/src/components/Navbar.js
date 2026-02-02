import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="Search Services, Products"
                />
                <button className="search-btn">🔍</button>
            </div>

            <div className="navbar-right">
                <div className="user-info">
                    <span>{user.emailOrPhone || 'User'}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;