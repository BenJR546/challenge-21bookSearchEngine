// client/src/utils/auth.js
import decode from "jwt-decode";

class AuthService {
    // Get user data
    getProfile() {
        return decode(this.getToken());
    }

    // Check if user is logged in
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    // Check if token is expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            return decoded.exp < Date.now() / 1000;
        } catch (err) {
            console.error("Token expiration check failed:", err);
            return false;
        }
    }

    // Retrieve token from localStorage
    getToken() {
        return localStorage.getItem("id_token");
    }

    // Save token to localStorage and reload
    login(idToken) {
        localStorage.setItem("id_token", idToken);
        window.location.assign("/");
    }

    // Clear token and reload
    logout() {
        localStorage.removeItem("id_token");
        window.location.assign("/");
    }
}

export default new AuthService();
