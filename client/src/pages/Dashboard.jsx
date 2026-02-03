import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const apiBase = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '') + '?__ngrok_skip_browser_warning=true';
            const res = await axios.get(`${apiBase}/api/inventory`, config);
            setItems(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const apiBase = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '') + '?__ngrok_skip_browser_warning=true';
            await axios.delete(`${apiBase}/api/inventory/${id}`, config);
            setItems(items.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '2rem' }}>Inventory Dashboard</h1>
                <Link to="/add-item">
                    <button>+ Add New Item</button>
                </Link>
            </div>

            <div className="inventory-grid">
                {items.map(item => {
                    const isLowStock = item.quantity <= (item.lowStockThreshold || 10);
                    return (
                        <div key={item._id} className={`card ${isLowStock ? 'low-stock' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3>{item.name}</h3>
                                {isLowStock && <span className="badge badge-warning">Low Stock</span>}
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{item.description}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <small style={{ color: 'var(--text-muted)' }}>Quantity</small>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item.quantity}</div>
                                </div>
                                <div>
                                    <small style={{ color: 'var(--text-muted)' }}>Price</small>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${item.price}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/edit-item/${item._id}`} style={{ flex: 1 }}>
                                    <button className="btn-secondary" style={{ width: '100%' }}>Edit</button>
                                </Link>
                                <button className="btn-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {items.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>No inventory items found. Add one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
