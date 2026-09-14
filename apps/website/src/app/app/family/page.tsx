"use client";

import { useState } from "react";
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
import { formatEur, usePractice } from "@/lib/app/practice-store";

export default function FamilyPage() {
  const {
    state,
    setActiveWallet,
    addKidsWallet,
    requestKidsSpend,
    resolveKidsSpend,
    practiceEnabled,
    activeWallet,
    walletTotal,
  } = usePractice();

  const kidsWallets = state.wallets.filter((w) => w.kind === "kids");
  const [childName, setChildName] = useState("");
  const [spendAmount, setSpendAmount] = useState("20");
  const [spendLabel, setSpendLabel] = useState("School lunch");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const allPending = kidsWallets.flatMap((w) =>
    (w.pendingApprovals ?? [])
      .filter((a) => a.status === "pending")
      .map((a) => ({ wallet: w, approval: a })),
  );

  function addChild() {
    setMsg(null);
    setErr(null);
    const error = addKidsWallet(childName);
    if (error) setErr(error);
    else {
      setMsg(`Created kids wallet for ${childName}`);
      setChildName("");
    }
  }

  function requestSpend() {
    setMsg(null);
    setErr(null);
    if (activeWallet.kind !== "kids") {
      setErr("Switch to a Kids wallet in the sidebar first");
      return;
    }
    const error = requestKidsSpend(Number(spendAmount) || 0, spendLabel);
    if (error) setErr(error);
    else setMsg("Spend request sent to parent for approval");
  }

  return (
    <AppPage
      title="Kids / Family"
      subtitle="Parent-controlled sub-wallets with limits and approvals"
    >
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kidsWallets.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setActiveWallet(w.id)}
            className={`rounded-lg border p-4 text-left transition ${
              activeWallet.id === w.id
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-emerald-400/50"
            }`}
          >
            <p className="font-bold text-heading">{w.name}</p>
            <p className="mt-2 text-2xl font-extrabold text-heading">
              {formatEur(walletTotal(w))}
            </p>
            <p className="mt-2 text-xs text-muted">
              Limit {formatEur(w.monthlyLimitEur ?? 0)} · Spent{" "}
              {formatEur(w.spentThisMonthEur ?? 0)} this month
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Add child wallet" description="Nested under Personal">
          <Field label="Child name">
            <input
              className={inputClass}
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Mia"
            />
          </Field>
          <PrimaryButton
            className="mt-4"
            onClick={addChild}
            disabled={!practiceEnabled}
          >
            Create kids wallet
          </PrimaryButton>
        </Panel>

        <Panel
          title="Request spend"
          description="Child asks parent to top up / approve"
        >
          <div className="space-y-3">
            <Field label="Amount (EUR)">
              <input
                className={inputClass}
                type="number"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
              />
            </Field>
            <Field label="What for?">
              <input
                className={inputClass}
                value={spendLabel}
                onChange={(e) => setSpendLabel(e.target.value)}
              />
            </Field>
            <PrimaryButton onClick={requestSpend} disabled={!practiceEnabled}>
              Request parent approval
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title="Parent inbox" description="Approve or deny pending spends">
          {allPending.length === 0 ? (
            <p className="text-sm text-muted">No pending requests.</p>
          ) : (
            <ul className="space-y-3">
              {allPending.map(({ wallet, approval }) => (
                <li
                  key={approval.id}
                  className="rounded-lg border border-[var(--color-line)] p-3"
                >
                  <p className="text-sm font-semibold text-heading">
                    {wallet.name} · {formatEur(approval.amountEur)}
                  </p>
                  <p className="text-xs text-muted">{approval.label}</p>
                  <div className="mt-2 flex gap-2">
                    <PrimaryButton
                      onClick={() => {
                        const e = resolveKidsSpend(approval.id, true);
                        if (e) setErr(e);
                        else setMsg("Approved — funded from Personal");
                      }}
                    >
                      Approve
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() => {
                        resolveKidsSpend(approval.id, false);
                        setMsg("Denied");
                      }}
                    >
                      Deny
                    </SecondaryButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Kids wallets" description="Activity & limits">
        <DataTable
          columns={["Wallet", "Fiat", "Monthly limit", "Spent", "Pending"]}
          empty="No kids wallets"
          rows={kidsWallets.map((w) => [
            w.name,
            formatEur(w.balances.fiatEur),
            formatEur(w.monthlyLimitEur ?? 0),
            formatEur(w.spentThisMonthEur ?? 0),
            String(
              (w.pendingApprovals ?? []).filter((a) => a.status === "pending")
                .length,
            ),
          ])}
        />
      </Panel>
    </AppPage>
  );
}
