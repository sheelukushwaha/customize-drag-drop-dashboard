import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const LoginForm = () => {
  const { setToken, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // new loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // start loading
    try {
      const res = await axios.post('https://dummyjson.com/auth/login', { username, password });
      setToken(res.data.accessToken);
      setUser(res.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400 || err.response.status === 401) {
          setError('Invalid username or password');
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError(`Login failed: ${err.message}`);
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
