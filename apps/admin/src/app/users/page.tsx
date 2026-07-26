import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { users } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <>
      <Topbar title="Users" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Name</th>
                  <th className="py-2 font-semibold">Email</th>
                  <th className="py-2 font-semibold">KYC status</th>
                  <th className="py-2 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="py-3 font-medium text-navy">{u.fullName}</td>
                    <td className="py-3 text-muted">{u.email}</td>
                    <td className="py-3">
                      <StatusBadge status={u.kycStatus} />
                    </td>
                    <td className="py-3 text-muted">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
