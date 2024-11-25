import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Navigate } from "react-router-dom";
import { json } from "stream/consumers";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  admin?: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  login: (user: User) => any;
  signUp: (user: User) => any;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ isAuthenticated: false });

  if (user.isAuthenticated === false) {
    const storedUser1 = localStorage.getItem("user");

    if (storedUser1) {
      const storedUser: User = JSON.parse(storedUser1);
      setUser(storedUser);
      console.log(user);
    }
  }

  const login = async (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const signUp = async (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser({ isAuthenticated: false });
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, signUp, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
