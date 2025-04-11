import { createContext, useState, useEffect } from "react";
import axiosInstance from "../Axios";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ authenticated: false, user: null });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // if(location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/") {
    //   setLoading(false);
    //   return;
    // }
    axiosInstance.get("/users/check-auth/", {
      headers: {
        Authorization: `JWT ${document.cookie
          .split("; ")
          .find(row => row.startsWith("access_token="))
          ?.split("=")[1] || ""}`
      }
    })
    .then(response => {
      setUser({
        authenticated: response.data.authenticated,
        user: response.data.user || null,
      });
    })
    .catch(() => setUser({ authenticated: false, user: null }))
    .finally(() => setLoading(false));
  }, [location.pathname]);
  

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};