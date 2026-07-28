"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import { adminApi, ApiError, type AdminUser } from "@/lib/api";

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    adminApi
      .users(token)
      .then((res) => setUsers(res.users))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load users"));
  }, [token]);

  return (
    <>
      <Topbar title="Users" />
      <main className="flex-1 p-6 lg:p-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-[var(--color-line)] last:border-0">
                      <td className="py-3 font-medium text-navy">{u.fullName}</td>
                      <td className="py-3 text-muted">{u.email}</td>
                      <td className="py-3">
                        <StatusBadge status={u.kycStatus} />
                      </td>
                      <td className="py-3 text-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
