import { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← loading state

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; } // no token → skip
      try {
        const userDetails = await fetchUserProfile();
        if (userDetails && !userDetails.message) {
          setUser(userDetails);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
