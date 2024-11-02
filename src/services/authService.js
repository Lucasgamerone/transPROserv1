class AuthService {
  static setSession(token, userData) {
    // Armazena o token
    localStorage.setItem('token', token);
    
    // Armazena dados básicos do usuário
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Define o token para requisições
    this.setAuthHeader(token);
  }

  static clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.setAuthHeader(null);
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  static setAuthHeader(token) {
    if (token) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete window.axios.defaults.headers.common['Authorization'];
    }
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthService; 