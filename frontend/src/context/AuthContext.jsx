
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — AUTHENTICATION CONTEXT */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  logout as clearSession,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("luxride_user")
      ) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const sessionVersion = useRef(0);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = sessionStorage.getItem("luxride_token");

      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      const version = sessionVersion.current;

      try {
        const data = await getCurrentUser();

        if (
          !mounted ||
          version !== sessionVersion.current ||
          sessionStorage.getItem("luxride_token") !== token
        ) {
          return;
        }

        const currentUser = data?.user || data;

        if (!currentUser?._id && !currentUser?.id) {
          throw new Error("Invalid user response.");
        }

        setUser(currentUser);

        sessionStorage.setItem(
          "luxride_user",
          JSON.stringify(currentUser)
        );

      } catch (error) {
        console.error("SESSION RESTORE:", error.message);

        if (
          mounted &&
          version === sessionVersion.current &&
          sessionStorage.getItem("luxride_token") === token
        ) {
          // Only authentication failures should clear the session.
          if (
            error.message.includes("expired") ||
            error.message.includes("Invalid authentication") ||
            error.message.includes("Authentication required") ||
            error.message.includes("User account not found") ||
            error.message.includes("verify your email")
          ) {
            await clearSession();
            sessionStorage.removeItem("luxride_user");
            setUser(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (userData, token) => {
    if (!userData || !token) {
      throw new Error("User or token missing.");
    }

    sessionVersion.current += 1;

    sessionStorage.setItem("luxride_token", token);

    sessionStorage.setItem(
      "luxride_user",
      JSON.stringify(userData)
    );

    setUser(userData);
    setLoading(false);
  };

  const signOut = async () => {
    sessionVersion.current += 1;

    try {
      await clearSession();
    } finally {
      sessionStorage.removeItem("luxride_token");
      sessionStorage.removeItem("luxride_user");

      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
