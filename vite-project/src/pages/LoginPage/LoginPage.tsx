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
};

export default LoginPage;
