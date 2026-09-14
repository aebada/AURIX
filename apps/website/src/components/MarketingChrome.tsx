"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hide marketing Header / Footer / Chat on product routes under /app. */
export function MarketingChrome({
  header,
  footer,
  chat,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  chat: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isApp =
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/app");

  if (isApp) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {chat}
    </>
  );
}
