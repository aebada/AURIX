export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-line)] bg-white px-6 py-4 lg:px-10">
      <h1 className="text-lg font-extrabold tracking-tight text-navy">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-semibold text-muted">
          Mock session
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
