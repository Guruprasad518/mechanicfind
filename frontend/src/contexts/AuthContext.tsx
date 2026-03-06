import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import axios from "axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  type: "user" | "mechanic";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    type: "user" | "mechanic"
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isMechanic: boolean;
}

interface RegisterData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  type: "user" | "mechanic";
  location?: any;
  specialties?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://mechanicfind.onrender.com/api";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Auto login after refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("mechfind_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // ✅ LOGIN
  const login = async (
    email: string,
    password: string,
    type: "user" | "mechanic"
  ) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        type
      });

      // IMPORTANT FIX
      setUser(res.data.user);

      localStorage.setItem(
        "mechfind_user",
        JSON.stringify(res.data.user)
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.msg || "Login failed"
      };
    }
  };

  // ✅ REGISTER
  const register = async (data: RegisterData) => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/register`,
        data
      );

      // IMPORTANT FIX
      setUser(res.data.user);

      localStorage.setItem(
        "mechfind_user",
        JSON.stringify(res.data.user)
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.msg || "Registration failed"
      };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mechfind_user");
  };

  const isMechanic = user?.type === "mechanic";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isMechanic
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used inside AuthProvider");

  return context;
};
