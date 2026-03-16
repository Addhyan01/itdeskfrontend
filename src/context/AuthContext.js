import { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const getUser = async () => {

      const userDetails = await fetchUserProfile();


      if (userDetails) {
        setUser(userDetails);
      }

    };

    getUser();

  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};