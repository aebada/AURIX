export function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
        tone === "dark"
          ? "bg-white/10 text-gold-light"
          : "bg-gold/12 text-gold-dark"
      }`}
    >
      {children}
    </span>
  );
}
