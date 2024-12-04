import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { User } from "../../../types/types";

interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  login: (user: User) => any;
  signUp: (user: User) => any;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    password: "",
    avatar: "",
    admin: "",
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logout-event") {
        setUser({ isAuthenticated: false });
      }

      if (event.key === "signin-event") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    localStorage.setItem("signin-event", Date.now().toString());
  };

  const signUp = async (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    localStorage.setItem("signin-event", Date.now().toString());
  };

  const logout = () => {
    setUser({
      _id: "",
      name: "",
      email: "",
      password: "",
      avatar: "",
      admin: "",
      isAuthenticated: false,
    });

    localStorage.removeItem("user");
    localStorage.setItem("logout-event", Date.now().toString());
    localStorage.removeItem("signin-event");
    localStorage.removeItem("logout-event");
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
