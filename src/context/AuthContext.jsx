import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function login(email, senha) {
    try {
      const { data } = await axios.get(
        "https://6910d54c7686c0e9c20bd4c8.mockapi.io/users"
      );
      const foundUser = data.find(
        (user) => email === user.email && senha === user.password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser))
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user")
  }

  async function newUser(email, senha) {
    try {
      const { data } = await axios.get(
        "https://6910d54c7686c0e9c20bd4c8.mockapi.io/users"
      );
      const foundUser = data.find(
        (user) => email === user.email && senha === user.password
      );
      console.log("found user",!foundUser)
      if (!foundUser) {
        axios.post("https://6910d54c7686c0e9c20bd4c8.mockapi.io/users", {
          name:" ",
          password: senha,
          birthDate: null,
          phone: " ",
          email: email
        })
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  },[])

  return (
    <AuthContext.Provider value={{ user, login, logout, newUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
