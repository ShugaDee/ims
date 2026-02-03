import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const ItemForm = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); // If present, we are in Edit mode
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        lowStockThreshold: 10
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchItem = async () => {
                try {
                    const config = { headers: { 'x-auth-token': token } };
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory?id=${id}`, config); // Our API returns array, need to filter or update API to get single
                    // Actually, let's just fetch all and find (or update API, but for speed fetch all)
                    // Optimization: Better to have GET /api/inventory/:id
                    // I will assume I need to fetch all and filter client side because I didn't verify GET /:id exists in plan BUT I did create it in routes/inventory.js!
                    // WAIT, I implemented PUT /:id and DELETE /:id, but did I implement GET /:id? 
                    // Checking implementation_plan... "GET /api/inventory".
                    // Cleaning up: I'll use the list endpoint and filter for now to be safe, or just try GET /:id if I added it?
                    // I did NOT add GET /:id in routes/inventory.js. I only added GET / (list).
                    // So I will fetch all and find, OR just add GET /:id to backend quickly.
                    // Let's fetch all and filter for simplicity for now.

                    const listRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory`, config);
                    const item = listRes.data.find(i => i._id === id);
                    if (item) {
                        setFormData({
                            name: item.name,
                            description: item.description,
                            quantity: item.quantity,
                            price: item.price,
                            lowStockThreshold: item.lowStockThreshold
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchItem();
        }
    }, [id, token, isEditMode]);

    const { name, description, quantity, price, lowStockThreshold } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };

        try {
            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/inventory/${id}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/inventory`, formData, config);
            }
            navigate('/');
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card">
                <h2>{isEditMode ? 'Edit Item' : 'Add New Item'}</h2>
                <form onSubmit={onSubmit}>
                    <div>
                        <label>Item Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={quantity}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={price}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label>Low Stock Threshold</label>
                        <input
                            type="number"
                            name="lowStockThreshold"
                            value={lowStockThreshold}
                            onChange={onChange}
                        />
                        <small style={{ color: 'var(--text-muted)' }}>Alert when quantity is at or below this number.</small>
                    </div>

                    <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update Item' : 'Add Item')}
                    </button>
                    {isEditMode && <button type="button" className="btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => navigate('/')}>Cancel</button>}
                </form>
            </div>
        </div>
    );
};

export default ItemForm;
