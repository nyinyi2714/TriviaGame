import { useState } from 'react';
import { useAuth } from '../../hooks'
import './LoginPage.css';

const LoginPage = () => {
  const { login, register } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    login(username, password)
  };

  const handleRegistration = () => {
    register(username, password)
  }

  const toggleLogin = () => {
    setIsLogin(prev => !prev);
  }

  return (
    <div className="login">
      <h2>Login</h2>
      <div className="login-input-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='username'
        />
      </div>
      <div className="login-input-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='password'
        />
      </div>
      {
        !isLogin &&
        <div className="login-input-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='confirm password'
          />
        </div>
      }
      <button onClick={isLogin? handleLogin : handleRegistration}>{isLogin ? "Login" : "Register"}</button>
      <button onClick={toggleLogin}>
        {isLogin ?
          "Don't have an account? Click Here to Register" :
          "Already have an account? Login Here"
        }
      </button>
    </div>
  );
};

export default LoginPage;
