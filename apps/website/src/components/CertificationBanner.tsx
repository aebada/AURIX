"use client";

import {
  certificationCopy,
  type CertificationKind,
} from "@/lib/feature-flags";
import { useLanguage } from "@/lib/i18n/language-context";

export function CertificationBanner({
  kind,
  detail,
  className = "",
}: {
  kind: CertificationKind;
  detail?: string;
  className?: string;
}) {
  const { locale } = useLanguage();
  const copy = certificationCopy(kind, locale);
  return (
    <div
      role="status"
      className={`rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100 ${className}`}
    >
      <p className="font-semibold">{copy.title}</p>
      <p className="mt-1 leading-relaxed opacity-90">
        {copy.body}
        {detail ? ` ${detail}` : ""}
      </p>
    </div>
  );
}
