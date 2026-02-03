import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'REGISTER_FAIL':
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload // Optional
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        if (localStorage.token) {
            axios.defaults.headers.common['x-auth-token'] = localStorage.token;
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`);
            dispatch({
                type: 'USER_LOADED',
                payload: res.data
            });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    // Register User
    const register = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, config);

            localStorage.setItem('token', res.data.token); // Fix: Set token immediately

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            });
            loadUser();
        } catch (err) {
            dispatch({
                type: 'REGISTER_FAIL',
                payload: err.response.data.msg
            });
        }
    };

    // Login User
    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, config);

            localStorage.setItem('token', res.data.token); // Fix: Set token immediately

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });
            loadUser();
        } catch (err) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response.data.msg
            });
        }
    };

    // Logout
    const logout = () => dispatch({ type: 'LOGOUT' });

    // Clear Errors
    const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

    useEffect(() => {
        if (localStorage.token) {
            loadUser();
        } else {
            // If no token, we still want to stop loading
            dispatch({ type: 'AUTH_ERROR' }); // or just set loading false
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                login,
                logout,
                clearErrors,
                loadUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
