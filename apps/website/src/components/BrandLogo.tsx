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
 */
export function BrandLogo({
  variant = "auto",
  className = "h-9 w-auto sm:h-10",
  width = 136,
  height = 40,
  priority = false,
}: BrandLogoProps) {
  if (variant === "onDark") {
    return (
      <Image
        src={LIGHT_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={className}
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
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <>
      <Image
        src={DARK_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={`${className} dark:hidden`}
        priority={priority}
      />
      <Image
        src={LIGHT_SRC}
        alt="AURIX"
        width={width}
        height={height}
        className={`${className} hidden dark:block`}
        priority={priority}
      />
    </>
  );
}
