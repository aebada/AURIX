"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import { adminApi, ApiError, type AdminUser, type Role } from "@/lib/api";
import { ASSIGNABLE_ROLES, ROLE_LABELS, STAFF_ROLES, SUPER_ADMIN_EMAIL } from "@/lib/rbac";

export default function UsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const canManageRoles = currentUser?.role === "super_admin";

  useEffect(() => {
    if (!token) return;
    adminApi
      .users(token)
      .then((res) => setUsers(res.users))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load users"));
  }, [token]);

  async function changeRole(userId: string, role: Role) {
    if (!token) return;
    setBusyId(userId);
    setError(null);
    try {
      await adminApi.setRole(token, userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to update role");
    } finally {
      setBusyId(null);
    }
  }

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
          <p className="mb-4 text-sm text-muted">
            Roles follow MunichTech EXPO style: staff (SUPER_ADMIN, Operations,
            Sales & Partnerships, Finance, Marketing, Compliance) vs participants
            (User, Partner, Investor, Employer). Founder{" "}
            <span className="font-semibold text-navy">{SUPER_ADMIN_EMAIL}</span> is
            always SUPER_ADMIN.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Name</th>
                  <th className="py-2 font-semibold">Email</th>
                  <th className="py-2 font-semibold">KYC</th>
                  <th className="py-2 font-semibold">Role</th>
                  <th className="py-2 font-semibold">Kind</th>
                  <th className="py-2 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const founder = u.email.toLowerCase() === SUPER_ADMIN_EMAIL;
                    return (
                      <tr key={u.id} className="border-b border-[var(--color-line)] last:border-0">
                        <td className="py-3 font-medium text-navy">{u.fullName}</td>
                        <td className="py-3 text-muted">{u.email}</td>
                        <td className="py-3">
                          <StatusBadge status={u.kycStatus} />
                        </td>
                        <td className="py-3">
                          {canManageRoles && !founder ? (
                            <select
                              value={u.role}
                              disabled={busyId === u.id}
                              onChange={(e) => changeRole(u.id, e.target.value as Role)}
                              className="rounded-lg border border-[var(--color-line)] px-2 py-1 text-xs font-semibold text-navy disabled:opacity-50"
                            >
                              {ASSIGNABLE_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_LABELS[r]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs font-semibold text-navy">
                              {ROLE_LABELS[u.role] ?? u.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-xs text-muted">
                          {STAFF_ROLES.includes(u.role) ? "Staff" : "Participant"}
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
