"use client";

import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

// php-auth endpoints (.php) must be full document navigations — Next's
// client router has no matching route and would 404 on soft navigation.
export function AuthNavLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  if (href.includes(".php")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
