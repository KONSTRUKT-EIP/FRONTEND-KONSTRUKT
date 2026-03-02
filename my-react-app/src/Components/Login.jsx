import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = 'fake-token';  // Simuler l'obtention d'un token d'authentification
    login(token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
}

export default Login;
