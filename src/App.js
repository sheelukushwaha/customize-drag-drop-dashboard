import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import './App.css';

function AppContent() {
  const { token } = useContext(AuthContext);

  return token ? <Dashboard /> : <LoginForm />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;