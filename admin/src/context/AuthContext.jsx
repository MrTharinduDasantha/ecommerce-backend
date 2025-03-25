import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Dummy login function
    return new Promise((resolve, reject) => {
      if (email === "admin@gmail.com" && password === "admin123") {
        setUser({ email });
        resolve();
      } else {
        reject("Invalid credentials");
      }
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
