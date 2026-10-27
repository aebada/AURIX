"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { USE_PHP_AUTH } from "@/lib/auth-urls";

export type MetalWallet = {
  email: string;
  goldGrams: number;
  silverGrams: number;
  goldBpc: number;
  silverBpc: number;
  orders: string[];
  updatedAt: string | null;
  liveVault?: boolean;
  note?: string;
};

export type MetalOrder = {
  id: string;
  status: string;
  metal: string;
  grams: number;
  fiatEur: number;
  feeEur?: number;
  bpc?: number;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
  note?: string;
  minted?: boolean;
  liveVault?: boolean;
};

export function useMetalAccount() {
  const { user, token } = useAuth();
  const [wallet, setWallet] = useState<MetalWallet | null>(null);
  const [orders, setOrders] = useState<MetalOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_PHP_AUTH || !token || !user?.email) {
      setWallet(null);
      setOrders([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch("/auth/metal-orders.php", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { wallet?: MetalWallet; orders?: MetalOrder[] } | null) => {
        if (cancelled || !data) return;
        setWallet(data.wallet ?? null);
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load account");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, user?.email]);

  return { wallet, orders, loading, error, signedIn: Boolean(token && user) };
}
