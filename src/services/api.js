const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  async fetch(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return response;
  }
}; 