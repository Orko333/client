import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import socketService from '../services/socketService';
import { baseURL } from '../api/client';

interface UserTokenPayload { user_id: number; username: string; exp: number; }
interface AuthContextValue {
  user: UserTokenPayload | null;
  token: string | null;
  loginWithTelegram: (telegramData: Record<string, any>) => Promise<void>;
  loginWithEmail?: (email: string, password: string) => Promise<void>;
  registerWithEmail?: (email: string, username: string, password: string) => Promise<void>;
  loginWithGoogle?: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('client_token'));
  const [user, setUser] = useState<UserTokenPayload | null>(null);

  useEffect(() => {
    if (token) {
      try { 
        setUser(jwtDecode<UserTokenPayload>(token)); 
        // Підключаємо Socket.IO при авторизації
        socketService.connect(token);
      } catch { 
        setUser(null); 
        socketService.disconnect();
      }
    } else {
      socketService.disconnect();
    }
  }, [token]);

  const loginWithTelegram = async (telegramData: Record<string, any>) => {
  const res = await fetch(`${baseURL}/api/client/auth-telegram`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(telegramData)
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('client_token', data.token);
      setToken(data.token);
    } else throw new Error('Auth failed');
  };

  const logout = () => {
    localStorage.removeItem('client_token');
    setToken(null); 
    setUser(null);
    socketService.disconnect();
  };

  // Placeholders for upcoming email auth implementation
  const loginWithEmail = async (email: string, password: string) => {
  const res = await fetch(`${baseURL}/api/client/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(data.message || 'Auth failed');
    localStorage.setItem('client_token', data.token);
    setToken(data.token);
  };
  const registerWithEmail = async (email: string, username: string, password: string) => {
  const res = await fetch(`${baseURL}/api/client/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, username, password }) });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('client_token', data.token);
    setToken(data.token);
  };
  const loginWithGoogle = async (idToken: string) => {
  const res = await fetch(`${baseURL}/api/client/auth-google`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id_token: idToken }) });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(data.message || 'Google auth failed');
    localStorage.setItem('client_token', data.token);
    setToken(data.token);
  };
  return <AuthContext.Provider value={{ user, token, loginWithTelegram, loginWithEmail, registerWithEmail, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
