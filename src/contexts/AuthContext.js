import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth-token');
    const savedUser = localStorage.getItem('auth-user');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Persist token
  useEffect(() => {
    if (token) localStorage.setItem('auth-token', token);
    else localStorage.removeItem('auth-token');
  }, [token]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem('auth-user', JSON.stringify(user));
    else localStorage.removeItem('auth-user');
  }, [user]);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Memoize context value
  const contextValue = useMemo(() => ({
    token,
    setToken,
    user,
    setUser,
    logout,
  }), [token, user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};