"use client";

import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import type { ReactNode } from "react";

export function AdminPage({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <>
      <Topbar title={title} />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        {note ? <p className="text-sm text-muted">{note}</p> : null}
        {children}
      </main>
    </>
  );
}

export function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
              {headers.map((h) => (
                <th key={h} className="py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="py-6 text-center text-muted">
                  No records.
                </td>
              </tr>
            ) : (
              rows.map((cols, i) => (
                <tr key={i} className="border-b border-[var(--color-line)] last:border-0">
                  {cols.map((c, j) => (
                    <td key={j} className="py-3 text-navy">
                      {c}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
