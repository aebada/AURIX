"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { authApi, type AuthUser } from "./api";

interface Session {
  token: string;
  user: AuthUser;
}

const STORAGE_KEY = "aurix.session";
const CHANGE_EVENT = "aurix-session-change";

// useSyncExternalStore requires getSnapshot to return a referentially
// stable value when the underlying data hasn't changed — JSON.parse-ing
// localStorage fresh on every call would return a new object each time
// and trigger an infinite re-render loop. Cache by the raw string so
// unchanged reads return the same parsed object.
let cachedRaw: string | null = null;
let cachedSession: Session | null = null;

function readSession(): Session | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return cachedSession;
  }
  try {
    cachedSession = JSON.parse(raw) as Session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedSession = null;
  }
  return cachedSession;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function writeSession(session: Session | null) {
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getServerSnapshot(): Session | null {
  return null;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribe, readSession, getServerSnapshot);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    writeSession({ token: res.token, user: res.user });
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const res = await authApi.register(email, password, fullName);
    writeSession({ token: res.token, user: res.user });
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token: session?.token ?? null, user: session?.user ?? null, login, register, logout }}
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
