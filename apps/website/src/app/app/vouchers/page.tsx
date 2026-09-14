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

export default function VouchersPage() {
  const {
    state,
    activeWallet,
    vouchers,
    createVoucher,
    giftVoucher,
    redeemVoucher,
    practiceEnabled,
  } = usePractice();

  const [amount, setAmount] = useState("50");
  const [note, setNote] = useState("");
  const [code, setCode] = useState("");
  const [intoWallet, setIntoWallet] = useState(activeWallet.id);
  const [giftId, setGiftId] = useState("");
  const [giftTo, setGiftTo] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function create() {
    setMsg(null);
    setErr(null);
    const error = createVoucher(Number(amount) || 0, note || undefined);
    if (error) setErr(error);
    else {
      setMsg(`Voucher created from ${activeWallet.name}`);
      setAmount("");
      setNote("");
    }
  }

  function redeem() {
    setMsg(null);
    setErr(null);
    const error = redeemVoucher(code, intoWallet);
    if (error) setErr(error);
    else {
      setMsg("Voucher redeemed into selected wallet");
      setCode("");
    }
  }

  function gift() {
    setMsg(null);
    setErr(null);
    const error = giftVoucher(giftId, giftTo);
    if (error) setErr(error);
    else {
      setMsg(`Marked as gifted to ${giftTo}`);
      setGiftTo("");
    }
  }

  return (
    <AppPage
      title="Vouchers"
      subtitle={`Create from ${activeWallet.name} · redeem into any wallet`}
    >
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Create voucher" description="Debits the active wallet">
          <div className="space-y-3">
            <Field label="Amount (EUR)">
              <input
                className={inputClass}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field label="Note (optional)">
              <input
                className={inputClass}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Client gift / staff bonus"
              />
            </Field>
            <PrimaryButton onClick={create} disabled={!practiceEnabled}>
              Create
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title="Redeem" description="Choose destination wallet">
          <div className="space-y-3">
            <Field label="Code">
              <input
                className={inputClass}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="AURIX-XXXX-XXXX"
              />
            </Field>
            <Field label="Redeem into">
              <select
                className={inputClass}
                value={intoWallet}
                onChange={(e) => setIntoWallet(e.target.value)}
              >
                {state.wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </Field>
            <PrimaryButton onClick={redeem} disabled={!practiceEnabled}>
              Redeem
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title="Gift voucher" description="Mark active voucher as gifted">
          <div className="space-y-3">
            <Field label="Voucher">
              <select
                className={inputClass}
                value={giftId}
                onChange={(e) => setGiftId(e.target.value)}
              >
                <option value="">Select…</option>
                {vouchers
                  .filter((v) => v.status === "active")
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.code} · {formatEur(v.amountEur)}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Gift to">
              <input
                className={inputClass}
                value={giftTo}
                onChange={(e) => setGiftTo(e.target.value)}
                placeholder="Name or email"
              />
            </Field>
            <SecondaryButton onClick={gift}>Mark as gifted</SecondaryButton>
          </div>
        </Panel>
      </div>

      <Panel title="Voucher ledger" description="All practice vouchers">
        <DataTable
          columns={["Code", "Amount", "Status", "From wallet", "Note"]}
          empty="No vouchers yet — create one from Business or Personal."
          rows={vouchers.map((v) => {
            const from =
              state.wallets.find((w) => w.id === v.fromWalletId)?.name ?? "—";
            return [
              <span key="c" className="font-mono text-xs font-semibold">
                {v.code}
              </span>,
              formatEur(v.amountEur),
              <span key="s" className="capitalize">
                {v.status}
                {v.giftTo ? ` → ${v.giftTo}` : ""}
              </span>,
              from,
              v.note ?? "—",
            ];
          })}
        />
      </Panel>
    </AppPage>
  );
}
