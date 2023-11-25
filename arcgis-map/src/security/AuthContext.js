import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

//1: Create a Context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

//2: Share the created context with other components
export default function AuthProvider({ children }) {
  //3: Put some state in the context
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [res, setRes] = useState("");

  async function login(username, password) {
    try {
      // const response = await axios.post(
      //   "http://localhost:8080/api/auth/login",
      //   {
      //     username,
      //     password,
      //   }
      // );
      // setRes(response);
      // if (response.data === "success") {
      //   setAuthenticated(true);
      //   return true;
      // } else {
      //   logout();
      //   return false;
      // }
      setAuthenticated(true);
      return true;
    } catch (error) {
      console.log(error);
      logout();
      return false;
    }
  }

  function logout() {
    setAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        res,
        login,
        logout,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
