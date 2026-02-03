import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const authContext = useContext(AuthContext);
    const { register, error, clearErrors, isAuthenticated } = authContext;
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [error, isAuthenticated, navigate]);

    const [user, setUser] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const { username, password, confirmPassword } = user;

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (username === '' || password === '') {
            //
        } else if (password !== confirmPassword) {
            console.log('Passwords do not match');
            // dispatch set alert
        } else {
            register({
                username,
                password
            });
        }
    };

    return (
        <div className="auth-form">
            <div className="card">
                <h2>Register</h2>
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
                            minLength="6"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" style={{ width: '100%' }}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
