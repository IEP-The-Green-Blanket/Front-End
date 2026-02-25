"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@types";
import { UserService } from "@services/userService";

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  updateUser: (userData: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (userData: User) => {
    sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
    setUser(userData);
    console.log("Global Auth State updated with new user info.");
  };

  const logout = async () => {
    try {
      await UserService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      sessionStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUser");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
