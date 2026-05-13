import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tf_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tf_token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then((res) => {
        const fresh = res.data.user;
        localStorage.setItem('tf_user', JSON.stringify(fresh));
        setUser(fresh);
      })
      .catch(() => { localStorage.removeItem('tf_token'); localStorage.removeItem('tf_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await authApi.signup(data);
    const { token, user } = res.data;
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading,
      isAdmin:  user?.role === 'ADMIN',
      isMember: user?.role === 'MEMBER',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
