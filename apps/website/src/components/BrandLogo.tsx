import Image from "next/image";

type BrandLogoProps = {
  /** `auto` follows light/dark theme; `onDark`/`onLight` force a variant. */
  variant?: "auto" | "onDark" | "onLight";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

const DARK_SRC = "/brand/aurix-logo.png";
const LIGHT_SRC = "/brand/aurix-logo-light.png";

/**
 * Full AURIX wordmark. Navy text for light surfaces; white text + gold mark
 * for dark themes (Night / Prestige / Ocean) via the `.dark` class on <html>.
 * Intrinsic asset ≈ 611×180 — keep aspect ratio so "IX" never clips.
 */
export function BrandLogo({
  variant = "auto",
  className = "h-8 w-auto",
  width = 122,
  height = 36,
  priority = false,
}: BrandLogoProps) {
  const imgClass = `${className} max-w-none object-contain object-left`;

  if (variant === "onDark") {
    return (
      <Image
        src={LIGHT_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={imgClass}
        priority={priority}
      />
    );
  }

  if (variant === "onLight") {
    return (
      <Image
        src={DARK_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={imgClass}
        priority={priority}
      />
    );
  }

  return (
    <span className="inline-flex h-8 shrink-0 items-center" style={{ width: width }}>
      <Image
        src={DARK_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={`${imgClass} dark:hidden`}
        priority={priority}
      />
      <Image
        src={LIGHT_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={`${imgClass} hidden dark:block`}
        priority={priority}
      />
    </span>
  );
}
