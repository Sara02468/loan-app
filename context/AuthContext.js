import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const savedRole = await AsyncStorage.getItem('role');
        if (token) {
          setAuthToken(token);
          setRole(savedRole);
        }
      } catch (e) {
        console.log('Failed to load token:', e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (token, userRole) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('role', userRole);
    setAuthToken(token);
    setRole(userRole);
  };

  const signOut = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('role');
  setAuthToken(null);
  setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        role,
        loading,
        isLoggedIn: !!authToken,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
