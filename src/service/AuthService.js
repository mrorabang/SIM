// Authentication Service for login management
const AuthService = function() {
    const loginAttempts = new Map(); // Store login attempts by IP/username
    const maxAttempts = 5; // Max login attempts
    const lockoutDuration = 15 * 60 * 1000; // 15 minutes lockout

    // Check if user can attempt login (rate limiting)
    const canAttemptLogin = function(identifier = 'default') {
        const now = Date.now();
        const attempts = loginAttempts.get(identifier) || [];
        
        // Remove old attempts (older than lockout duration)
        const recentAttempts = attempts.filter(time => now - time < lockoutDuration);
        
        // Check if user is locked out
        if (recentAttempts.length >= maxAttempts) {
            const lastAttempt = recentAttempts[recentAttempts.length - 1];
            const timeLeft = Math.ceil((lockoutDuration - (now - lastAttempt)) / 1000 / 60);
            throw new Error(`Tài khoản bị tạm khóa. Vui lòng thử lại sau ${timeLeft} phút.`);
        }
        
        return true;
    };

    // Record login attempt (success or failure)
    const recordLoginAttempt = function(success, identifier = 'default') {
        const now = Date.now();
        const attempts = loginAttempts.get(identifier) || [];
        
        if (success) {
            // Clear attempts on successful login
            loginAttempts.delete(identifier);
        } else {
            // Add failed attempt
            attempts.push(now);
            loginAttempts.set(identifier, attempts);
        }
    };

    // Generate secure session token
    const generateSessionToken = function(user) {
        const token = {
            userId: user.id || user.username,
            username: user.username,
            role: user.role || 'user',
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Store in localStorage
        localStorage.setItem('sessionToken', JSON.stringify(token));
        localStorage.setItem('sessionExpiry', token.expiresAt.toString());
        
        return token;
    };

    // Validate session token
    const validateSession = function() {
        try {
            const token = localStorage.getItem('sessionToken');
            const expiry = localStorage.getItem('sessionExpiry');
            
            if (!token || !expiry) {
                return false;
            }
            
            const parsedToken = JSON.parse(token);
            const now = Date.now();
            
            if (now > parseInt(expiry)) {
                clearSession();
                return false;
            }
            
            return parsedToken;
        } catch (error) {
            console.error('Session validation error:', error);
            clearSession();
            return false;
        }
    };

    // Clear session
    const clearSession = function() {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('authenticated');
        localStorage.removeItem('user');
    };

    // Get current user from session
    const getCurrentUser = function() {
        const session = validateSession();
        if (session) {
            return session;
        }
        return null;
    };

    // Check if user is authenticated
    const isAuthenticated = function() {
        return validateSession() !== false;
    };

    // Check user role
    const hasRole = function(role) {
        const user = getCurrentUser();
        return user && user.role === role;
    };

    // Check if user is admin
    const isAdmin = function() {
        return hasRole('admin');
    };

    // Get remaining lockout time
    const getLockoutTimeRemaining = function(identifier = 'default') {
        const attempts = loginAttempts.get(identifier) || [];
        const now = Date.now();
        const recentAttempts = attempts.filter(time => now - time < lockoutDuration);
        
        if (recentAttempts.length >= maxAttempts) {
            const lastAttempt = recentAttempts[recentAttempts.length - 1];
            const timeLeft = lockoutDuration - (now - lastAttempt);
            return Math.max(0, timeLeft);
        }
        
        return 0;
    };

    // Get login attempts count
    const getLoginAttemptsCount = function(identifier = 'default') {
        const attempts = loginAttempts.get(identifier) || [];
        const now = Date.now();
        const recentAttempts = attempts.filter(time => now - time < lockoutDuration);
        return recentAttempts.length;
    };

    // Return public methods
    return {
        canAttemptLogin,
        recordLoginAttempt,
        generateSessionToken,
        validateSession,
        clearSession,
        getCurrentUser,
        isAuthenticated,
        hasRole,
        isAdmin,
        getLockoutTimeRemaining,
        getLoginAttemptsCount
    };
}();

// Export instance
export default AuthService;