import { createContext, useContext } from "react";

// 1️⃣ Create context
export const AuthContext = createContext(null);

// 2️⃣ Custom Hook to consume AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
