"use client";

import { useEffect, useMemo, useState } from "react";
import { AppPage } from "@/components/app/AppShell";
import {
  DataTable,
  Field,
  Notice,
  Panel,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/components/app/chrome";
import {
  formatEur,
  formatGrams,
  usePractice,
} from "@/lib/app/practice-store";
import type { BusinessRole } from "@/lib/app/types";

type Tab = "overview" | "payroll" | "payments" | "invoices" | "partners";

interface PracticeInvoice {
  id: string;
  client: string;
  amountEur: number;
  status: "draft" | "sent" | "paid";
  createdAt: string;
}

interface BulkRow {
  email: string;
  amount: string;
}

const VERTICAL_NOTES = [
  {
    title: "Banks",
    body: "Institutional linking & settlement — partner connections only when certified. Practice UI only.",
  },
  {
    title: "Payments",
    body: "Merchant QR / NFC acceptance concepts. No live card charges.",
  },
  {
    title: "Investments",
    body: "IR & product narrative for asset-linked money. Live reserves are not enabled yet.",
  },
  {
    title: "Partners",
    body: "Vault, KYC, and market-data candidates — see /partners for evaluation list.",
  },
];

export default function BusinessPage() {
  const {
    state,
    setActiveWallet,
    inviteTeamMember,
    transferBetweenWallets,
    createVoucher,
    setEmployeeSalary,
    payMetalSalary,
    runMetalPayrollBatch,
    practiceEnabled,
    walletTotal,
  } = usePractice();

  const biz = state.wallets.find((w) => w.kind === "business");
  const personal = state.wallets.find((w) => w.kind === "personal");
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    if (
      t === "overview" ||
      t === "payroll" ||
      t === "payments" ||
      t === "invoices" ||
      t === "partners"
    ) {
      setTab(t);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BusinessRole>("member");
  const [payroll, setPayroll] = useState("500");
  const [staffVoucher, setStaffVoucher] = useState("50");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("m2");
  const [salaryDraft, setSalaryDraft] = useState("3100");
  const [fiatPct, setFiatPct] = useState("80");
  const [goldPct, setGoldPct] = useState("15");
  const [silverPct, setSilverPct] = useState("5");
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([
    { email: "ops@company.com", amount: "120" },
    { email: "finance@company.com", amount: "250" },
  ]);
  const [invoices, setInvoices] = useState<PracticeInvoice[]>([
    {
      id: "inv_demo",
      client: "Munich Retail GmbH",
      amountEur: 420,
      status: "sent",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [invoiceClient, setInvoiceClient] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("100");
  const [merchantAmount, setMerchantAmount] = useState("25");
  const [lastQr, setLastQr] = useState<string | null>(null);

  const tabs = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview" },
        { id: "payroll" as const, label: "Payroll / metal salary" },
        { id: "payments" as const, label: "Merchant pay" },
        { id: "invoices" as const, label: "Invoices" },
        { id: "partners" as const, label: "Verticals" },
      ] as const,
    [],
  );

  function loadEmployee(id: string) {
    setSelectedEmployee(id);
    const m = biz?.business?.members.find((x) => x.id === id);
    if (!m) return;
    setSalaryDraft(String(m.salaryEur ?? 2500));
    setFiatPct(String(m.salarySplit?.fiatPct ?? 70));
    setGoldPct(String(m.salarySplit?.goldPct ?? 20));
    setSilverPct(String(m.salarySplit?.silverPct ?? 10));
  }

  function saveSalarySplit() {
    setMsg(null);
    setErr(null);
    const error = setEmployeeSalary(selectedEmployee, Number(salaryDraft) || 0, {
      fiatPct: Number(fiatPct) || 0,
      goldPct: Number(goldPct) || 0,
      silverPct: Number(silverPct) || 0,
    });
    if (error) setErr(error);
    else setMsg("Saved employee metal salary split (practice)");
  }

  function payOneMetalSalary() {
    setMsg(null);
    setErr(null);
    if (!biz) return;
    setActiveWallet(biz.id);
    const member = biz.business?.members.find((m) => m.id === selectedEmployee);
    const error = payMetalSalary(selectedEmployee, Number(salaryDraft) || undefined);
    if (error) setErr(error);
    else {
      const split = `${fiatPct}% fiat · ${goldPct}% gold · ${silverPct}% silver`;
      setMsg(
        `Paid metal salary to ${member?.name ?? "employee"} (${formatEur(Number(salaryDraft) || 0)} → ${split}). Credits land in Personal wallet (practice).`,
      );
    }
  }

  function payAllMetalSalaries() {
    setMsg(null);
    setErr(null);
    if (!biz) return;
    setActiveWallet(biz.id);
    const error = runMetalPayrollBatch();
    if (error) setErr(error);
    else
      setMsg(
        "Ran metal payroll for all employees with a salary — fiat + gold + silver credited to Personal (practice).",
      );
  }

  if (!biz?.business) {
    return (
      <AppPage title="Business">
        <Notice tone="err">Business wallet missing — reset practice in Profile.</Notice>
      </AppPage>
    );
  }

  function invite() {
    setMsg(null);
    setErr(null);
    const error = inviteTeamMember(email, role);
    if (error) setErr(error);
    else {
      setMsg(`Invited ${email} as ${role}`);
      setEmail("");
    }
  }

  function runPayroll() {
    setMsg(null);
    setErr(null);
    if (!biz || !personal) return;
    setActiveWallet(biz.id);
    const error = transferBetweenWallets(
      biz.id,
      personal.id,
      Number(payroll) || 0,
    );
    if (error) setErr(error);
    else setMsg(`Practice payroll transfer ${formatEur(Number(payroll) || 0)} → Personal`);
  }

  function runBulkPayout() {
    setMsg(null);
    setErr(null);
    if (!biz || !personal) return;
    let total = 0;
    for (const row of bulkRows) {
      const amt = Number(row.amount) || 0;
      if (amt <= 0 || !row.email.trim()) continue;
      total += amt;
    }
    if (total <= 0) {
      setErr("Add at least one payout row with amount > 0");
      return;
    }
    setActiveWallet(biz.id);
    const error = transferBetweenWallets(biz.id, personal.id, total);
    if (error) setErr(error);
    else
      setMsg(
        `Practice bulk payout ${formatEur(total)} across ${bulkRows.length} rows (simulated → Personal pocket)`,
      );
  }

  function issueStaffVoucher() {
    setMsg(null);
    setErr(null);
    if (!biz) return;
    setActiveWallet(biz.id);
    const error = createVoucher(
      Number(staffVoucher) || 0,
      "Staff / client voucher",
      biz.id,
    );
    if (error) setErr(error);
    else {
      setMsg(
        `Created staff/client voucher for ${formatEur(Number(staffVoucher) || 0)}`,
      );
    }
  }

  function createInvoice() {
    setMsg(null);
    setErr(null);
    const amount = Number(invoiceAmount) || 0;
    if (!invoiceClient.trim() || amount <= 0) {
      setErr("Client name and amount required");
      return;
    }
    const inv: PracticeInvoice = {
      id: `inv_${Date.now().toString(36)}`,
      client: invoiceClient.trim(),
      amountEur: amount,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [inv, ...prev]);
    setInvoiceClient("");
    setMsg(`Draft invoice ${inv.id} created (practice only)`);
  }

  function markInvoice(id: string, status: PracticeInvoice["status"]) {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setMsg(`Invoice ${id} → ${status}`);
  }

  function generateMerchantQr() {
    const amount = Number(merchantAmount) || 0;
    if (amount <= 0) {
      setErr("Enter a merchant charge amount");
      return;
    }
    const code = `AURIX-PRACTICE|EUR:${amount.toFixed(2)}|BIZ:${biz?.id ?? "biz"}|T:${Date.now()}`;
    setLastQr(code);
    setMsg(`Practice merchant request ${formatEur(amount)} — QR/NFC conceptual only`);
    setErr(null);
  }

  return (
    <AppPage
      title="Business"
      subtitle={`${biz.business.companyName} · role ${biz.business.role} · practice`}
      actions={
        <PrimaryButton onClick={() => setActiveWallet(biz.id)}>
          Switch to Business wallet
        </PrimaryButton>
      }
    >
      {!practiceEnabled && (
        <Notice tone="err">Practice mode is off — enable it in Profile to run flows.</Notice>
      )}
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}

      <Notice tone="ok">
        Live reserves are not enabled yet — balances and payouts are practice
        only. No live custody, deposits, or redemptions.
      </Notice>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "bg-navy text-white"
                : "border border-[var(--color-line)] text-muted hover:text-heading"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Treasury (practice)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-heading">
            {formatEur(walletTotal(biz))}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Fiat pocket
          </p>
          <p className="mt-2 text-2xl font-extrabold text-heading">
            {formatEur(biz.balances.fiatEur)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Gold (practice g)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-heading">
            {formatGrams(biz.balances.goldGrams)}
          </p>
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel
            title={`Team (${biz.business.members.length})`}
            description="Team seats & roles (practice)"
            className="lg:col-span-2"
          >
            <DataTable
              columns={["Name", "Email", "Role", "Salary split"]}
              empty="No members"
              rows={biz.business.members.map((m) => [
                <span key="n" className="font-semibold text-heading">
                  {m.name}
                </span>,
                m.email,
                <span key="r" className="capitalize">
                  {m.role}
                </span>,
                <span key="s" className="text-xs text-muted">
                  {m.salaryEur
                    ? `${formatEur(m.salaryEur)} · ${m.salarySplit?.fiatPct ?? 70}% fiat / ${m.salarySplit?.goldPct ?? 20}% Au / ${m.salarySplit?.silverPct ?? 10}% Ag`
                    : "Not set"}
                </span>,
              ])}
            />
            {biz.business.invites.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold text-heading">Pending invites</p>
                <DataTable
                  columns={["Email", "Role", "Status", "When"]}
                  empty=""
                  rows={biz.business.invites.map((i) => [
                    i.email,
                    i.role,
                    i.status,
                    new Date(i.createdAt).toLocaleDateString(),
                  ])}
                />
              </div>
            )}
          </Panel>

          <Panel title="Invite teammate" description="Owner / admin practice invite">
            <div className="space-y-3">
              <Field label="Work email">
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                />
              </Field>
              <Field label="Role">
                <select
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value as BusinessRole)}
                >
                  {(["admin", "finance", "member", "viewer"] as const).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <PrimaryButton onClick={invite} disabled={!practiceEnabled}>
                Send invite
              </PrimaryButton>
            </div>
          </Panel>
        </div>
      )}

      {tab === "payroll" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Metal salary (employees)"
            description="Employers pay part of salary as gold, silver, and fiat — practice conversion at demo prices"
            className="lg:col-span-2"
          >
            <Notice tone="ok">
              Practice only: Business fiat is debited for the full gross salary.
              The employee Personal wallet receives fiat + gold grams + silver
              grams per the split. Live payroll rails stay gated until
              certification.
            </Notice>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-3">
                <Field label="Employee">
                  <select
                    className={inputClass}
                    value={selectedEmployee}
                    onChange={(e) => loadEmployee(e.target.value)}
                  >
                    {biz.business.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} · {m.email}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Gross salary (EUR)">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    value={salaryDraft}
                    onChange={(e) => setSalaryDraft(e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Fiat %">
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      max={100}
                      value={fiatPct}
                      onChange={(e) => setFiatPct(e.target.value)}
                    />
                  </Field>
                  <Field label="Gold %">
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      max={100}
                      value={goldPct}
                      onChange={(e) => setGoldPct(e.target.value)}
                    />
                  </Field>
                  <Field label="Silver %">
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      max={100}
                      value={silverPct}
                      onChange={(e) => setSilverPct(e.target.value)}
                    />
                  </Field>
                </div>
                <p className="text-xs text-muted">
                  Split total:{" "}
                  {(Number(fiatPct) || 0) +
                    (Number(goldPct) || 0) +
                    (Number(silverPct) || 0)}
                  % (must be 100)
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Preview this pay run
                </p>
                {(() => {
                  const gross = Number(salaryDraft) || 0;
                  const f = (Number(fiatPct) || 0) / 100;
                  const g = (Number(goldPct) || 0) / 100;
                  const s = (Number(silverPct) || 0) / 100;
                  const goldG = (gross * g) / 80;
                  const silverG = (gross * s) / 0.95;
                  return (
                    <ul className="mt-3 space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted">Fiat to employee</span>
                        <span className="font-bold text-heading">
                          {formatEur(gross * f)}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted">Gold (practice)</span>
                        <span className="font-bold text-heading">
                          {formatGrams(goldG)}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted">Silver (practice)</span>
                        <span className="font-bold text-heading">
                          {formatGrams(silverG)}
                        </span>
                      </li>
                      <li className="flex justify-between border-t border-[var(--color-line)] pt-2">
                        <span className="text-muted">Debit Business</span>
                        <span className="font-extrabold text-heading">
                          {formatEur(gross)}
                        </span>
                      </li>
                    </ul>
                  );
                })()}
                <div className="mt-4 flex flex-wrap gap-2">
                  <SecondaryButton onClick={saveSalarySplit} disabled={!practiceEnabled}>
                    Save split
                  </SecondaryButton>
                  <PrimaryButton onClick={payOneMetalSalary} disabled={!practiceEnabled}>
                    Pay this employee
                  </PrimaryButton>
                  <PrimaryButton onClick={payAllMetalSalaries} disabled={!practiceEnabled}>
                    Run full metal payroll
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Single fiat payroll transfer"
            description="Move fiat Business → Personal (practice)"
          >
            <Field label="Amount (EUR)">
              <input
                className={inputClass}
                type="number"
                value={payroll}
                onChange={(e) => setPayroll(e.target.value)}
              />
            </Field>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={runPayroll} disabled={!practiceEnabled}>
                Run transfer
              </PrimaryButton>
              <SecondaryButton onClick={() => setActiveWallet(biz.id)}>
                Focus Business
              </SecondaryButton>
            </div>
          </Panel>

          <Panel
            title="Staff / client vouchers"
            description="Fund a voucher from the Business wallet"
          >
            <Field label="Voucher amount (EUR)">
              <input
                className={inputClass}
                type="number"
                value={staffVoucher}
                onChange={(e) => setStaffVoucher(e.target.value)}
              />
            </Field>
            <PrimaryButton
              className="mt-4"
              onClick={issueStaffVoucher}
              disabled={!practiceEnabled}
            >
              Issue voucher
            </PrimaryButton>
          </Panel>

          <Panel
            title="Bulk payout (practice)"
            description="CSV-style rows — totals debit Business in practice"
            className="lg:col-span-2"
          >
            <div className="space-y-3">
              {bulkRows.map((row, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                  <input
                    className={inputClass}
                    value={row.email}
                    placeholder="employee@company.com"
                    onChange={(e) => {
                      const next = [...bulkRows];
                      next[idx] = { ...row, email: e.target.value };
                      setBulkRows(next);
                    }}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    value={row.amount}
                    onChange={(e) => {
                      const next = [...bulkRows];
                      next[idx] = { ...row, amount: e.target.value };
                      setBulkRows(next);
                    }}
                  />
                  <SecondaryButton
                    onClick={() => setBulkRows(bulkRows.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </SecondaryButton>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <SecondaryButton
                onClick={() =>
                  setBulkRows([...bulkRows, { email: "", amount: "50" }])
                }
              >
                Add row
              </SecondaryButton>
              <PrimaryButton onClick={runBulkPayout} disabled={!practiceEnabled}>
                Run bulk payout
              </PrimaryButton>
            </div>
          </Panel>
        </div>
      )}

      {tab === "payments" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Merchant payment request"
            description="Conceptual QR / NFC — no live card processor"
          >
            <Field label="Amount (EUR)">
              <input
                className={inputClass}
                type="number"
                value={merchantAmount}
                onChange={(e) => setMerchantAmount(e.target.value)}
              />
            </Field>
            <PrimaryButton
              className="mt-4"
              onClick={generateMerchantQr}
              disabled={!practiceEnabled}
            >
              Generate practice QR payload
            </PrimaryButton>
            {lastQr && (
              <div className="mt-4 rounded-lg border border-dashed border-[var(--color-line)] bg-[var(--color-paper)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  QR / NFC payload (practice)
                </p>
                <p className="mt-2 break-all font-mono text-xs text-heading">{lastQr}</p>
                <div
                  className="mt-4 flex h-36 items-center justify-center rounded-xl bg-navy/5 text-sm font-semibold text-muted"
                  aria-hidden
                >
                  QR placeholder
                </div>
              </div>
            )}
          </Panel>
          <Panel title="Acceptance notes" description="Honest status">
            <ul className="space-y-3 text-sm leading-relaxed text-muted">
              <li>NFC / QR UI is conceptual for merchant demos.</li>
              <li>No Stripe/Adyen charges are fired from this shell.</li>
              <li>Live payment processors stay offline until certification.</li>
            </ul>
          </Panel>
        </div>
      )}

      {tab === "invoices" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Create invoice" description="Practice AR — not fiscal invoicing">
            <div className="space-y-3">
              <Field label="Client">
                <input
                  className={inputClass}
                  value={invoiceClient}
                  onChange={(e) => setInvoiceClient(e.target.value)}
                  placeholder="Client company"
                />
              </Field>
              <Field label="Amount (EUR)">
                <input
                  className={inputClass}
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                />
              </Field>
              <PrimaryButton onClick={createInvoice} disabled={!practiceEnabled}>
                Create draft
              </PrimaryButton>
            </div>
          </Panel>
          <Panel title="Invoices" description="Local practice list" className="lg:col-span-2">
            <DataTable
              columns={["Client", "Amount", "Status", "Actions"]}
              empty="No invoices"
              rows={invoices.map((inv) => [
                inv.client,
                formatEur(inv.amountEur),
                inv.status,
                <span key={inv.id} className="flex flex-wrap gap-2">
                  <SecondaryButton onClick={() => markInvoice(inv.id, "sent")}>
                    Send
                  </SecondaryButton>
                  <SecondaryButton onClick={() => markInvoice(inv.id, "paid")}>
                    Mark paid
                  </SecondaryButton>
                </span>,
              ])}
            />
          </Panel>
        </div>
      )}

      {tab === "partners" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {VERTICAL_NOTES.map((v) => (
            <Panel key={v.title} title={v.title} description="B2B vertical">
              <p className="text-sm leading-relaxed text-muted">{v.body}</p>
            </Panel>
          ))}
        </div>
      )}
    </AppPage>
  );
}
