import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, type AuthUser } from "./api";

interface Session {
  token: string;
  user: AuthUser;
}

const STORAGE_KEY = "aurix.session";

interface AuthContextValue {
  // `hydrated` is false only during the initial AsyncStorage read (it's
  // async, unlike web's synchronous localStorage) — screens should wait
  // for it before deciding whether the user is signed in.
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  login: (email: string, password: string) => Promise<Session>;
  register: (email: string, password: string, fullName: string) => Promise<Session>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        try {
          setSession(JSON.parse(raw) as Session);
        } catch {
          AsyncStorage.removeItem(STORAGE_KEY);
        }
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const writeSession = useCallback(async (next: Session | null) => {
    setSession(next);
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      const next = { token: res.token, user: res.user };
      await writeSession(next);
      return next;
    },
    [writeSession],
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const res = await authApi.register(email, password, fullName);
      const next = { token: res.token, user: res.user };
      await writeSession(next);
      return next;
    },
    [writeSession],
  );

  const setUser = useCallback(
    (user: AuthUser) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, user };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const logout = useCallback(async () => {
    await writeSession(null);
  }, [writeSession]);

  return (
    <AuthContext.Provider
      value={{
        hydrated,
        token: session?.token ?? null,
        user: session?.user ?? null,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
