const BASE_URL = 'http://localhost:5000';

async function login(email, password) {
  try {
    const resp = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json();
    if (resp.ok) return { success: true, user: data.user, token: data.token };
    else return { success: false, message: data.error || 'Login failed' };
  } catch (err) {
    return { success: false, message: err.message || 'Network error' };
  }
}

async function getTickets() {
  try {
    const token = localStorage.getItem('token');
    const resp = await fetch(`${BASE_URL}/tickets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return data.tickets || [];
  } catch (err) {
    console.error('Error fetching tickets:', err);
    return [];
  }
}

export default {
  login,
  getTickets
};
