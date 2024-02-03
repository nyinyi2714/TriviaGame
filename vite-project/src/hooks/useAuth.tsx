import { BACKEND_API } from '../config';
import { useNavigate } from 'react-router-dom';

interface AuthResponse {
  message: string;
}

function useAuth() {
  const navigate = useNavigate();

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_API}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Login Successful
        // TODO
        return true;
      } else {
        // Handle login failure
        console.error('Login failed');
        const loginData: AuthResponse = await response.json();
        alert(loginData.message);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_API}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Registration successful
        // TODO
        return true;
      } else {
        // Handle registration failure
        const registerData: AuthResponse = await response.json();
        alert(registerData.message);
        return false;
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  const getUser = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_API}/checkAuth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // TODO
        return true
      } else {
        console.error('Retrieval of current user failed');
        return false;
      }
    } catch (error) {
      console.error('Error during Retrieval of current user:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    // Delete the token cookie and data on the client-side
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');

    // Send logout request to the backend
    try {
      const response = await fetch(`${BACKEND_API}/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) console.error('Logout successful');
      return true
    } catch (error) {
      console.error('Error during logout:', error);
      return false
    }
  };

  return {
    login,
    register,
    getUser,
    logout,
  };
}

export default useAuth