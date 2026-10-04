"use client";

import { Card } from "@/components/Card";
import { AdminPage } from "@/components/AdminPage";
import { ASSIGNABLE_ROLES, ROLE_LABELS, STAFF_ROLES, SUPER_ADMIN_EMAIL } from "@/lib/rbac";

export default function TeamPage() {
  return (
    <AdminPage
      title="Team & roles"
      note="Same pattern as MunichTech EXPO: staff roles for the admin portal, participant personas for the product. Only SUPER_ADMIN can assign SUPER_ADMIN."
    >
      <Card>
        <p className="text-sm font-bold text-navy">Founder SUPER_ADMIN</p>
        <p className="mt-1 text-sm text-muted">{SUPER_ADMIN_EMAIL}</p>
      </Card>
      <Card>
        <p className="text-sm font-bold text-navy">Staff (admin panel)</p>
        <ul className="mt-3 space-y-2 text-sm">
          {STAFF_ROLES.filter((r) => r !== "admin").map((r) => (
            <li key={r}>
              <span className="font-semibold text-navy">{ROLE_LABELS[r]}</span>
              <span className="text-muted"> · {r}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <p className="text-sm font-bold text-navy">Participants</p>
        <ul className="mt-3 space-y-2 text-sm">
          {ASSIGNABLE_ROLES.filter((r) => !STAFF_ROLES.includes(r)).map((r) => (
            <li key={r}>
              <span className="font-semibold text-navy">{ROLE_LABELS[r]}</span>
              <span className="text-muted"> · {r}</span>
            </li>
          ))}
        </ul>
      </Card>
    </AdminPage>
  );
}
