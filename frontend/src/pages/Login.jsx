import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login logic (replace with actual API request)
    if (username === 'user123' && password === 'password') {
      // Set user as authenticated (you can also store the user info in localStorage)
      setIsAuthenticated(true);
      localStorage.setItem('user', username); // Save user in localStorage (or another persistent store)
      history.push('/home');  // Redirect to home page after successful login
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
