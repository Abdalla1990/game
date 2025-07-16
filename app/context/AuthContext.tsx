'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signout: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'trivia_users';
const SESSION_KEY = 'trivia_session';

function getUsers(): {
  [email: string]: { id: string; name: string; password: string };
} {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}

function saveUsers(users: object) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const session = localStorage.getItem(SESSION_KEY);
    if (session) { setUser(JSON.parse(session)) } else {
      setIsLoading(false);
    };
    setIsLoading(false);
  }, []);

  async function signup(name: string, email: string, password: string) {
    let users = getUsers();
    if (users[email]) return false; // user exists

    users[email] = {
      id: crypto.randomUUID(),
      name,
      password,
    };
    saveUsers(users);
    const newUser = { id: users[email].id, name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  }

  async function login(email: string, password: string) {
    const users = getUsers();
    if (!users[email] || users[email].password !== password) return false;
    const loggedUser = { id: users[email].id, name: users[email].name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function signout() {
    logout();
  }

  async function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const props = useMemo(
    () => ({
      isLoading,
      user,
      signup,
      login,
      logout,
      signout,
      signOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
