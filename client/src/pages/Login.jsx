import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const authContext = useContext(AuthContext);
    const { login, error, clearErrors, isAuthenticated } = authContext;
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error === 'Invalid Credentials' || error === 'User already exists' || error === 'No token, authorization denied' || error === 'Token is not valid') {
            // Handle specific errors if needed
        }
    }, [error, isAuthenticated, navigate]);

    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    const { username, password } = user;

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (username === '' || password === '') {
            console.log('Please fill in all fields');
        } else {
            login({
                username,
                password
            });
        }
    };

    return (
        <div className="auth-form">
            <div className="card">
                <h2>Login</h2>
                {error && <div className="alert btn-danger">{error}</div>}
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%' }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
