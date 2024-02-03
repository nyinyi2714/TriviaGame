import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
  };

  const handleRegistration = () => {
    // Implement your registration navigation logic here
    // You can use a routing library like React Router
    // Example: history.push('/registration');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Login</h2>

      <input
        type="email"
        style={styles.input}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <input
        type="password"
        style={styles.input}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button
        style={styles.loginButton}
        onClick={handleLogin}
      >
        Login
      </button>

      <div style={styles.forgotPassword}>
        <a href="#">Forgot Password?</a>
      </div>

      <div style={styles.socialLogin}>
        <span style={styles.socialLoginText}>Or log in with</span>
        <button
          style={styles.socialButton}
          onClick={() => console.log('Facebook login')}
        >
          Facebook
        </button>
        <button
          style={styles.socialButton}
          onClick={() => console.log('Google login')}
        >
          Google
        </button>
      </div>

      <button
        style={styles.createAccountButton}
        onClick={handleRegistration}
      >
        Create an Account
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    margin: 'auto',
    maxWidth: '400px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  input: {
    height: '40px',
    width: '100%',
    border: '1px solid gray',
    marginBottom: '10px',
    paddingLeft: '10px',
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: '10px',
    borderRadius: '5px',
    width: '100%',
    color: 'white',
    cursor: 'pointer',
  },
  forgotPassword: {
    marginTop: '10px',
  },
  socialLogin: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  socialButton: {
    backgroundColor: 'transparent',
    border: '1px solid gray',
    padding: '5px 15px',
    borderRadius: '5px',
    margin: '5px',
    cursor: 'pointer',
  },
  socialLoginText: {
    marginBottom: '10px',
  },
  createAccountButton: {
    marginTop: '20px',
    backgroundColor: 'green',
    padding: '10px',
    borderRadius: '5px',
    width: '100%',
    color: 'white',
    cursor: 'pointer',
  },
};

export default LoginPage;
