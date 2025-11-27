import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AuthService from '../service/AuthService';

// Auth context để quản lý toàn bộ authentication state
const AuthContext = createContext();

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    UPDATE_USER: 'UPDATE_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    loginAttempts: 0,
    isLocked: false,
    lockoutEndTime: null
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                isLoading: false,
                error: null,
                loginAttempts: 0,
                isLocked: false,
                lockoutEndTime: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: action.payload.error,
                loginAttempts: state.loginAttempts + 1,
                isLocked: action.payload.isLocked || false,
                lockoutEndTime: action.payload.lockoutEndTime || null
            };

        case AUTH_ACTIONS.LOGOUT:
        case AUTH_ACTIONS.SESSION_EXPIRED:
            return {
                ...initialState,
                error: action.type === AUTH_ACTIONS.SESSION_EXPIRED 
                    ? 'Phiên đăng nhập đã hết hạn' 
                    : null
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check session on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                // Simple localStorage check instead of AuthService
                const isAuthenticated = localStorage.getItem("authenticated") === "true";
                const userData = localStorage.getItem("user");
                let user = null;
                
                if (userData) {
                    user = JSON.parse(userData);
                }
                
                if (user && isAuthenticated) {
                    dispatch({
                        type: AUTH_ACTIONS.LOGIN_SUCCESS,
                        payload: { user }
                    });
                } else {
                    // Simple logout
                    localStorage.removeItem("authenticated");
                    localStorage.removeItem("user");
                    dispatch({ type: AUTH_ACTIONS.SESSION_EXPIRED });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                // Simple logout
                localStorage.removeItem("authenticated");
                localStorage.removeItem("user");
                dispatch({ type: AUTH_ACTIONS.SESSION_EXPIRED });
            }
        };

        checkAuth();

        // Setup periodic session check
        const interval = setInterval(checkAuth, 60000); // Check every minute

        // Setup auto-logout for inactive sessions (simplified)
        // Removed AuthService.setupAutoLogout() to avoid errors

        return () => clearInterval(interval);
    }, []);

    // Login function
    const login = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            // Simplified login logic - just call mock API
            const user = await mockLoginApi(credentials);

            // Store in localStorage
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("user", JSON.stringify(user));

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user }
            });

            return { success: true };
        } catch (error) {
            // Simplified error handling
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: { error: error.message || 'Login failed' }
            });

            return { success: false, error: error.message || 'Login failed' };
        }
    };

    // Logout function
    const logout = () => {
        // Simple logout
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Update user function
    const updateUser = (userData) => {
        dispatch({
            type: AUTH_ACTIONS.UPDATE_USER,
            payload: userData
        });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Check if user is admin
    const isAdmin = () => {
        return state.user?.role === 'ADMIN';
    };

    // Get remaining lockout time
    const getLockoutTimeRemaining = () => {
        if (!state.lockoutEndTime) return 0;
        return Math.max(0, state.lockoutEndTime - Date.now());
    };

    const value = {
        ...state,
        login,
        logout,
        updateUser,
        clearError,
        isAdmin,
        getLockoutTimeRemaining,
        // Expose AuthService methods for direct use
        authService: AuthService
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Mock API function (replace with real API)
const mockLoginApi = async (credentials) => {
    // This would be replaced with your actual login API call
    // For now, return a mock user
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate API validation
            if (credentials.username === 'admin' && credentials.password === 'password') {
                resolve({
                    id: '1',
                    username: 'admin',
                    role: 'ADMIN',
                    status: true,
                    isApprove: true
                });
            } else {
                reject(new Error('Sai tài khoản hoặc mật khẩu'));
            }
        }, 1000);
    });
};

export default AuthContext;
