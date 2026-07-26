import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "./nav-links";
import { AppStoreBadges } from "./AppStoreBadges";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/brand/aurix-mark.png"
                alt=""
                width={28}
                height={26}
                className="h-7 w-auto"
              />
              <span className="font-extrabold tracking-tight text-lg text-white">
                AURIX
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Measured trust. Real digital money. A regulated orchestration
              layer connecting real gold and silver reserves to instant
              global payments.
            </p>
            <p className="mt-6 text-xs uppercase tracking-wider text-white/40">
              AURIX does not custody funds, metals, crypto, or securities.
            </p>
            <div className="mt-6">
              <AppStoreBadges variant="dark" />
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-white">{section}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-gold-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} AURIX. All rights reserved.</p>
          <p>Real value, made digital.</p>
        </div>
      </div>
    </footer>
  );
}
