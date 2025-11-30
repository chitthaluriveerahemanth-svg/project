import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const USERS_KEY = "citizenPortalUsers";
const CURRENT_KEY = "citizenPortalCurrentUser";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {name,email,role}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const getStoredUsers = () => {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = (email, password) => {
    const users = getStoredUsers();
    const existing = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!existing) throw new Error("Invalid email or password");
    const { password: _pw, ...safeUser } = existing;
    setUser(safeUser);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(safeUser));
    return true;
  };

  const register = (name, email, password, role) => {
    const users = getStoredUsers();
    const already = users.find((u) => u.email === email);
    if (already) throw new Error("Email already registered");
    const newUser = { name, email, password, role };
    users.push(newUser);
    saveUsers(users);
    const { password: _pw, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(safeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_KEY);
  };

  const value = { user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
