import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

// AuthService handles authentication-related functionality
class AuthService {
  // Retrieve user profile data from the token
  getProfile() {
    const token = this.getToken();
    try {
      return token ? jwtDecode<UserToken>(token) : null;
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }

  // Check if the user is logged in by verifying the token
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Determine if the token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Invalid token', err);
      return true;
    }
  }

  // Retrieve the stored token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Save the token to localStorage and redirect the user
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Remove the token and reload the application
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();