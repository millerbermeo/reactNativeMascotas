import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    nombre: null,
    id: null,
    rol: null,
  });

  const login = (data) => {
    setAuthState({
      token: data.token,
      nombre: data.nombre,
      id: data.id,
      rol: data.rol,
    });
  };

  const logout = () => {
    setAuthState({
      token: null,
      nombre: null,
      id: null,
      rol: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
);
};
