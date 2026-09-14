"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AppSidebar, AppTopbar } from "./chrome";
import { PracticeBanner } from "./PracticeBanner";
import { PracticeTour } from "./PracticeTour";

const MenuCtx = createContext<{ openMenu: () => void }>({
  openMenu: () => {},
});

export function useAppMenu() {
  return useContext(MenuCtx);
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMenu = useCallback(() => setMobileOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MenuCtx.Provider value={{ openMenu }}>
      <div className="flex min-h-screen bg-[var(--color-paper)]">
        <AppSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {children}
        </div>
        <Suspense fallback={null}>
          <PracticeTour />
        </Suspense>
      </div>
    </MenuCtx.Provider>
  );
}

export function AppPage({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { openMenu } = useAppMenu();
  return (
    <>
      <div className="sticky top-0 z-30">
        <PracticeBanner />
        <AppTopbar
          title={title}
          subtitle={subtitle}
          actions={actions}
          onMenu={openMenu}
        />
      </div>
      <main className="space-y-6 p-4 lg:p-8">{children}</main>
    </>
  );
}
