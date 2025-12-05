
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };
  const handleRegister = (userData) => {
    setUser(userData);
  };

  if (user) {
    return (
      <div className="auth-container">
        <h2>Welcome, {user.name || user.email}!</h2>
        <button onClick={() => { setUser(null); setView('login'); }}>Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      {view === 'login' ? (
        <Login onLogin={handleLogin} switchToRegister={() => setView('register')} />
      ) : (
        <Register onRegister={handleRegister} switchToLogin={() => setView('login')} />
      )}
    </div>
  );
}

export default App;
