import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);

    const onLogout = () => {
        logout();
    };

    const authLinks = (
        <div className="nav-links">
            <span style={{ color: 'var(--text)', alignSelf: 'center' }}>Hello, {user && user.username}</span>
            <Link to="/">Dashboard</Link>
            <Link to="/add-item">Add Item</Link>
            <a href="#!" onClick={onLogout}>
                Logout
            </a>
        </div>
    );

    const guestLinks = (
        <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>
    );

    return (
        <div className="navbar">
            <div className="brand">JohnShugs IMS</div>
            {isAuthenticated ? authLinks : guestLinks}
        </div>
    );
};

export default Navbar;
