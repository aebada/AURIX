"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  PRACTICE_PRICES,
  type AppTxn,
  type BusinessRole,
  type Metal,
  type PendingSpend,
  type PocketBalances,
  type PracticeState,
  type TeamInvite,
  type TeamMember,
  type Voucher,
  type Wallet,
  type WalletKind,
} from "./types";

const STORAGE_KEY = "aurix.app.practice.v3";
const CHANGE_EVENT = "aurix-practice-change";

function fmtEur(v: number) {
  return `€${v.toLocaleString("en-EU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtGrams(v: number) {
  if (v >= 100) return `${v.toFixed(1)} g`;
  if (v >= 10) return `${v.toFixed(2)} g`;
  return `${v.toFixed(3)} g`;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function emptyPockets(seed?: Partial<PocketBalances>): PocketBalances {
  return {
    fiatEur: seed?.fiatEur ?? 0,
    goldGrams: seed?.goldGrams ?? 0,
    silverGrams: seed?.silverGrams ?? 0,
  };
}

function seedWallets(): Wallet[] {
  const personalId = "w_personal";
  const businessId = "w_business";
  const kidsId = "w_kids";
  const savingsId = "w_savings";

  return [
    {
      id: personalId,
      kind: "personal",
      name: "Personal",
      currency: "EUR",
      balances: emptyPockets({
        fiatEur: 10000,
        goldGrams: 25,
        silverGrams: 500,
      }),
    },
    {
      id: businessId,
      kind: "business",
      name: "AURIX Labs GmbH",
      currency: "EUR",
      balances: emptyPockets({
        fiatEur: 50000,
        goldGrams: 100,
        silverGrams: 0,
      }),
      business: {
        companyName: "AURIX Labs GmbH",
        role: "owner",
        members: [
          {
            id: "m1",
            name: "You (Owner)",
            email: "you@aurixapp.de",
            role: "owner",
            salaryEur: 4200,
            salarySplit: { fiatPct: 70, goldPct: 25, silverPct: 5 },
          },
          {
            id: "m2",
            name: "Alex Finance",
            email: "alex@aurixapp.de",
            role: "finance",
            salaryEur: 3100,
            salarySplit: { fiatPct: 80, goldPct: 15, silverPct: 5 },
          },
          {
            id: "m3",
            name: "Sam Ops",
            email: "sam@aurixapp.de",
            role: "member",
            salaryEur: 2600,
            salarySplit: { fiatPct: 60, goldPct: 30, silverPct: 10 },
          },
        ],
        invites: [],
      },
    },
    {
      id: kidsId,
      kind: "kids",
      name: "Kids · Mia",
      currency: "EUR",
      parentId: personalId,
      monthlyLimitEur: 150,
      spentThisMonthEur: 32.5,
      pendingApprovals: [],
      balances: emptyPockets({
        fiatEur: 80,
        goldGrams: 2,
        silverGrams: 20,
      }),
    },
    {
      id: savingsId,
      kind: "savings",
      name: "Gold Vault",
      currency: "EUR",
      parentId: personalId,
      balances: emptyPockets({
        fiatEur: 0,
        goldGrams: 10,
        silverGrams: 0,
      }),
    },
  ];
}

function seedState(): PracticeState {
  const wallets = seedWallets();
  return {
    practiceEnabled: true,
    activeWalletId: wallets[0]!.id,
    wallets,
    transactions: [
      {
        id: "seed",
        walletId: wallets[0]!.id,
        kind: "deposit",
        label: "Practice account seeded",
        amountLabel: `+${fmtEur(10000)}`,
        createdAt: new Date().toISOString(),
      },
    ],
    vouchers: [],
  };
}

let cachedRaw: string | null = null;
let cachedState: PracticeState | null = null;

function readState(): PracticeState {
  if (typeof window === "undefined") return seedState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw && cachedState) return cachedState;
  cachedRaw = raw;
  if (!raw) {
    cachedState = seedState();
    return cachedState;
  }
  try {
    cachedState = JSON.parse(raw) as PracticeState;
  } catch {
    cachedState = seedState();
  }
  return cachedState;
}

function writeState(next: PracticeState) {
  cachedState = next;
  cachedRaw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

function getServerSnapshot(): PracticeState {
  return seedState();
}

function walletTotalEur(w: Wallet) {
  const b = w.balances;
  return (
    b.fiatEur +
    b.goldGrams * PRACTICE_PRICES.goldEurPerGram +
    b.silverGrams * PRACTICE_PRICES.silverEurPerGram
  );
}

function pushTxn(
  state: PracticeState,
  walletId: string,
  kind: AppTxn["kind"],
  label: string,
  amountLabel: string,
): PracticeState {
  const txn: AppTxn = {
    id: uid("tx"),
    walletId,
    kind,
    label,
    amountLabel,
    createdAt: new Date().toISOString(),
  };
  const transactions = [txn, ...state.transactions].slice(0, 80);
  return { ...state, transactions };
}

function updateWallet(
  state: PracticeState,
  walletId: string,
  fn: (w: Wallet) => Wallet,
): PracticeState {
  return {
    ...state,
    wallets: state.wallets.map((w) => (w.id === walletId ? fn(w) : w)),
  };
}

export function formatEur(v: number) {
  return fmtEur(v);
}

export function formatGrams(v: number) {
  return fmtGrams(v);
}

export function kindLabel(kind: WalletKind) {
  switch (kind) {
    case "personal":
      return "Personal";
    case "business":
      return "Business";
    case "kids":
      return "Kids / Family";
    case "savings":
      return "Savings / Vault";
  }
}

interface PracticeApi {
  state: PracticeState;
  activeWallet: Wallet;
  practiceEnabled: boolean;
  setPracticeEnabled: (v: boolean) => void;
  setActiveWallet: (id: string) => void;
  reset: () => void;
  walletTotal: (w: Wallet) => number;
  buy: (metal: Metal, fiatAmount: number) => string | null;
  sell: (metal: Metal, grams: number) => string | null;
  sendExternal: (amountEur: number, toLabel: string) => string | null;
  receiveExternal: (amountEur: number, fromLabel: string) => string | null;
  transferBetweenWallets: (
    fromId: string,
    toId: string,
    amountEur: number,
  ) => string | null;
  contributeToVault: (grams: number) => string | null;
  createVoucher: (
    amountEur: number,
    note?: string,
    fromWalletId?: string,
  ) => string | null;
  giftVoucher: (voucherId: string, giftTo: string) => string | null;
  redeemVoucher: (code: string, intoWalletId: string) => string | null;
  inviteTeamMember: (email: string, role: BusinessRole) => string | null;
  /** Update an employee's default salary + metal/fiat split. */
  setEmployeeSalary: (
    memberId: string,
    salaryEur: number,
    split: { fiatPct: number; goldPct: number; silverPct: number },
  ) => string | null;
  /**
   * Pay one employee: debit Business fiat for gross salary, credit employee
   * Personal wallet with fiat + gold + silver per the split percentages.
   */
  payMetalSalary: (memberId: string, salaryEur?: number) => string | null;
  /** Run metal salary for every team member that has a salary configured. */
  runMetalPayrollBatch: () => string | null;
  requestKidsSpend: (amountEur: number, label: string) => string | null;
  resolveKidsSpend: (
    approvalId: string,
    approve: boolean,
  ) => string | null;
  addKidsWallet: (name: string) => string | null;
  txnsForActive: AppTxn[];
  vouchers: Voucher[];
}

const PracticeContext = createContext<PracticeApi | null>(null);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, readState, getServerSnapshot);

  const activeWallet =
    state.wallets.find((w) => w.id === state.activeWalletId) ??
    state.wallets[0]!;

  const setPracticeEnabled = useCallback((v: boolean) => {
    writeState({ ...readState(), practiceEnabled: v });
  }, []);

  const setActiveWallet = useCallback((id: string) => {
    const s = readState();
    if (!s.wallets.some((w) => w.id === id)) return;
    writeState({ ...s, activeWalletId: id });
  }, []);

  const reset = useCallback(() => {
    writeState(seedState());
  }, []);

  const buy = useCallback((metal: Metal, fiatAmount: number) => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    if (fiatAmount <= 0) return "Enter an amount greater than zero";
    const fee = fiatAmount * PRACTICE_PRICES.feeRate;
    const total = fiatAmount + fee;
    const w = s.wallets.find((x) => x.id === s.activeWalletId);
    if (!w) return "No active wallet";
    if (w.kind === "kids") {
      const limit = w.monthlyLimitEur ?? 0;
      const spent = w.spentThisMonthEur ?? 0;
      if (spent + total > limit + 1e-9) {
        return `Kids limit exceeded (limit ${fmtEur(limit)} / month)`;
      }
    }
    if (total > w.balances.fiatEur + 1e-9) {
      return `Insufficient fiat (need ${fmtEur(total)})`;
    }
    const price =
      metal === "gold"
        ? PRACTICE_PRICES.goldEurPerGram
        : PRACTICE_PRICES.silverEurPerGram;
    const grams = fiatAmount / price;
    let next = updateWallet(s, w.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        fiatEur: cur.balances.fiatEur - total,
        goldGrams:
          metal === "gold"
            ? cur.balances.goldGrams + grams
            : cur.balances.goldGrams,
        silverGrams:
          metal === "silver"
            ? cur.balances.silverGrams + grams
            : cur.balances.silverGrams,
      },
      spentThisMonthEur:
        cur.kind === "kids"
          ? (cur.spentThisMonthEur ?? 0) + total
          : cur.spentThisMonthEur,
    }));
    next = pushTxn(
      next,
      w.id,
      "buy",
      `Practice buy ${metal}`,
      `+${fmtGrams(grams)}`,
    );
    writeState(next);
    return null;
  }, []);

  const sell = useCallback((metal: Metal, grams: number) => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    if (grams <= 0) return "Enter an amount greater than zero";
    const w = s.wallets.find((x) => x.id === s.activeWalletId);
    if (!w) return "No active wallet";
    const held =
      metal === "gold" ? w.balances.goldGrams : w.balances.silverGrams;
    if (grams > held + 1e-9) return `Insufficient ${metal}`;
    const price =
      metal === "gold"
        ? PRACTICE_PRICES.goldEurPerGram
        : PRACTICE_PRICES.silverEurPerGram;
    const gross = grams * price;
    const fee = gross * PRACTICE_PRICES.feeRate;
    const net = gross - fee;
    let next = updateWallet(s, w.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        fiatEur: cur.balances.fiatEur + net,
        goldGrams:
          metal === "gold"
            ? cur.balances.goldGrams - grams
            : cur.balances.goldGrams,
        silverGrams:
          metal === "silver"
            ? cur.balances.silverGrams - grams
            : cur.balances.silverGrams,
      },
    }));
    next = pushTxn(
      next,
      w.id,
      "sell",
      `Practice sell ${metal}`,
      `-${fmtGrams(grams)}`,
    );
    writeState(next);
    return null;
  }, []);

  const sendExternal = useCallback((amountEur: number, toLabel: string) => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    if (amountEur <= 0) return "Enter an amount greater than zero";
    const w = s.wallets.find((x) => x.id === s.activeWalletId);
    if (!w) return "No active wallet";
    if (amountEur > w.balances.fiatEur + 1e-9) return "Insufficient fiat";
    if (w.kind === "kids") {
      const limit = w.monthlyLimitEur ?? 0;
      const spent = w.spentThisMonthEur ?? 0;
      if (spent + amountEur > limit + 1e-9) {
        return `Kids limit exceeded — request parent approval instead`;
      }
    }
    let next = updateWallet(s, w.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        fiatEur: cur.balances.fiatEur - amountEur,
      },
      spentThisMonthEur:
        cur.kind === "kids"
          ? (cur.spentThisMonthEur ?? 0) + amountEur
          : cur.spentThisMonthEur,
    }));
    next = pushTxn(
      next,
      w.id,
      "transfer",
      `Send to ${toLabel}`,
      `-${fmtEur(amountEur)}`,
    );
    writeState(next);
    return null;
  }, []);

  const receiveExternal = useCallback(
    (amountEur: number, fromLabel: string) => {
      const s = readState();
      if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
      if (amountEur <= 0) return "Enter an amount greater than zero";
      const w = s.wallets.find((x) => x.id === s.activeWalletId);
      if (!w) return "No active wallet";
      let next = updateWallet(s, w.id, (cur) => ({
        ...cur,
        balances: {
          ...cur.balances,
          fiatEur: cur.balances.fiatEur + amountEur,
        },
      }));
      next = pushTxn(
        next,
        w.id,
        "deposit",
        `Receive from ${fromLabel}`,
        `+${fmtEur(amountEur)}`,
      );
      writeState(next);
      return null;
    },
    [],
  );

  const transferBetweenWallets = useCallback(
    (fromId: string, toId: string, amountEur: number) => {
      const s = readState();
      if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
      if (fromId === toId) return "Choose two different wallets";
      if (amountEur <= 0) return "Enter an amount greater than zero";
      const from = s.wallets.find((x) => x.id === fromId);
      const to = s.wallets.find((x) => x.id === toId);
      if (!from || !to) return "Wallet not found";
      if (amountEur > from.balances.fiatEur + 1e-9) return "Insufficient fiat";
      let next = updateWallet(s, fromId, (cur) => ({
        ...cur,
        balances: {
          ...cur.balances,
          fiatEur: cur.balances.fiatEur - amountEur,
        },
      }));
      next = updateWallet(next, toId, (cur) => ({
        ...cur,
        balances: {
          ...cur.balances,
          fiatEur: cur.balances.fiatEur + amountEur,
        },
      }));
      next = pushTxn(
        next,
        fromId,
        "transfer",
        `Transfer to ${to.name}`,
        `-${fmtEur(amountEur)}`,
      );
      next = pushTxn(
        next,
        toId,
        "transfer",
        `Transfer from ${from.name}`,
        `+${fmtEur(amountEur)}`,
      );
      writeState(next);
      return null;
    },
    [],
  );

  const contributeToVault = useCallback((grams: number) => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    if (grams <= 0) return "Enter grams greater than zero";
    const personal = s.wallets.find((w) => w.kind === "personal");
    const vault = s.wallets.find((w) => w.kind === "savings");
    if (!personal || !vault) return "Vault not found";
    if (grams > personal.balances.goldGrams + 1e-9) {
      return "Insufficient free gold in Personal";
    }
    let next = updateWallet(s, personal.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        goldGrams: cur.balances.goldGrams - grams,
      },
    }));
    next = updateWallet(next, vault.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        goldGrams: cur.balances.goldGrams + grams,
      },
    }));
    next = pushTxn(
      next,
      vault.id,
      "transfer",
      "Vault contribution",
      `+${fmtGrams(grams)} gold`,
    );
    writeState(next);
    return null;
  }, []);

  const createVoucher = useCallback(
    (amountEur: number, note?: string, fromWalletId?: string) => {
      const s = readState();
      if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
      if (amountEur <= 0) return "Enter an amount greater than zero";
      const walletId = fromWalletId ?? s.activeWalletId;
      const w = s.wallets.find((x) => x.id === walletId);
      if (!w) return "No active wallet";
      if (amountEur > w.balances.fiatEur + 1e-9) return "Insufficient fiat";
      const code = `AURIX-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const voucher: Voucher = {
        id: uid("v"),
        code,
        amountEur,
        status: "active",
        fromWalletId: w.id,
        createdAt: new Date().toISOString(),
        note,
      };
      let next = updateWallet(s, w.id, (cur) => ({
        ...cur,
        balances: {
          ...cur.balances,
          fiatEur: cur.balances.fiatEur - amountEur,
        },
      }));
      next = {
        ...next,
        vouchers: [voucher, ...next.vouchers],
      };
      next = pushTxn(
        next,
        w.id,
        "voucher",
        `Created voucher ${code}`,
        `-${fmtEur(amountEur)}`,
      );
      writeState(next);
      return null;
    },
    [],
  );

  const giftVoucher = useCallback((voucherId: string, giftTo: string) => {
    const s = readState();
    if (!giftTo.trim()) return "Enter a recipient";
    const v = s.vouchers.find((x) => x.id === voucherId);
    if (!v || v.status !== "active") return "Voucher not available";
    writeState({
      ...s,
      vouchers: s.vouchers.map((x) =>
        x.id === voucherId
          ? { ...x, status: "gifted" as const, giftTo: giftTo.trim() }
          : x,
      ),
    });
    return null;
  }, []);

  const redeemVoucher = useCallback((code: string, intoWalletId: string) => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    const normalized = code.trim().toUpperCase();
    const v = s.vouchers.find(
      (x) => x.code === normalized && (x.status === "active" || x.status === "gifted"),
    );
    if (!v) return "Invalid or already redeemed code";
    if (!s.wallets.some((w) => w.id === intoWalletId)) return "Wallet not found";
    let next = updateWallet(s, intoWalletId, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        fiatEur: cur.balances.fiatEur + v.amountEur,
      },
    }));
    next = {
      ...next,
      vouchers: next.vouchers.map((x) =>
        x.id === v.id
          ? {
              ...x,
              status: "redeemed" as const,
              redeemedIntoWalletId: intoWalletId,
            }
          : x,
      ),
    };
    next = pushTxn(
      next,
      intoWalletId,
      "voucher",
      `Redeemed ${v.code}`,
      `+${fmtEur(v.amountEur)}`,
    );
    writeState(next);
    return null;
  }, []);

  const inviteTeamMember = useCallback(
    (email: string, role: BusinessRole) => {
      const s = readState();
      const biz = s.wallets.find((w) => w.kind === "business");
      if (!biz?.business) return "No business wallet";
      if (!email.trim()) return "Enter an email";
      const invite: TeamInvite = {
        id: uid("inv"),
        email: email.trim().toLowerCase(),
        role,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const member: TeamMember = {
        id: uid("m"),
        name: email.split("@")[0] ?? "Member",
        email: invite.email,
        role,
        salaryEur: 2500,
        salarySplit: { fiatPct: 70, goldPct: 20, silverPct: 10 },
      };
      let next = updateWallet(s, biz.id, (cur) => ({
        ...cur,
        business: cur.business
          ? {
              ...cur.business,
              invites: [invite, ...cur.business.invites],
              members: [...cur.business.members, member],
            }
          : cur.business,
      }));
      next = pushTxn(
        next,
        biz.id,
        "invite",
        `Invited ${invite.email} as ${role}`,
        "—",
      );
      writeState(next);
      return null;
    },
    [],
  );

  const setEmployeeSalary = useCallback(
    (
      memberId: string,
      salaryEur: number,
      split: { fiatPct: number; goldPct: number; silverPct: number },
    ) => {
      const s = readState();
      if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
      if (salaryEur < 0) return "Salary cannot be negative";
      const sum = split.fiatPct + split.goldPct + split.silverPct;
      if (Math.abs(sum - 100) > 0.01) {
        return "Fiat + gold + silver percentages must add up to 100%";
      }
      if (split.fiatPct < 0 || split.goldPct < 0 || split.silverPct < 0) {
        return "Percentages cannot be negative";
      }
      const biz = s.wallets.find((w) => w.kind === "business");
      if (!biz?.business) return "Business wallet missing";
      if (!biz.business.members.some((m) => m.id === memberId)) {
        return "Employee not found";
      }
      writeState(
        updateWallet(s, biz.id, (cur) => ({
          ...cur,
          business: cur.business
            ? {
                ...cur.business,
                members: cur.business.members.map((m) =>
                  m.id === memberId
                    ? {
                        ...m,
                        salaryEur,
                        salarySplit: {
                          fiatPct: split.fiatPct,
                          goldPct: split.goldPct,
                          silverPct: split.silverPct,
                        },
                      }
                    : m,
                ),
              }
            : cur.business,
        })),
      );
      return null;
    },
    [],
  );

  function applyMetalSalary(
    state: PracticeState,
    member: TeamMember,
    grossEur: number,
  ): { next: PracticeState; error: string | null } {
    const biz = state.wallets.find((w) => w.kind === "business");
    const personal = state.wallets.find((w) => w.kind === "personal");
    if (!biz?.business || !personal) {
      return { next: state, error: "Business or Personal wallet missing" };
    }
    if (grossEur <= 0) {
      return { next: state, error: `Set a salary for ${member.name} first` };
    }
    const split = member.salarySplit ?? {
      fiatPct: 70,
      goldPct: 20,
      silverPct: 10,
    };
    const sum = split.fiatPct + split.goldPct + split.silverPct;
    if (Math.abs(sum - 100) > 0.01) {
      return {
        next: state,
        error: `Invalid split for ${member.name} — must total 100%`,
      };
    }
    if (grossEur > biz.balances.fiatEur + 1e-9) {
      return {
        next: state,
        error: `Insufficient Business fiat for ${member.name} (need ${fmtEur(grossEur)})`,
      };
    }

    const fiatEur = (grossEur * split.fiatPct) / 100;
    const goldEur = (grossEur * split.goldPct) / 100;
    const silverEur = (grossEur * split.silverPct) / 100;
    const goldGrams = goldEur / PRACTICE_PRICES.goldEurPerGram;
    const silverGrams = silverEur / PRACTICE_PRICES.silverEurPerGram;

    let next = updateWallet(state, biz.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        fiatEur: cur.balances.fiatEur - grossEur,
      },
    }));
    next = updateWallet(next, personal.id, (cur) => ({
      ...cur,
      balances: {
        ...cur.balances,
        fiatEur: cur.balances.fiatEur + fiatEur,
        goldGrams: cur.balances.goldGrams + goldGrams,
        silverGrams: cur.balances.silverGrams + silverGrams,
      },
    }));
    const metalParts = [
      split.goldPct > 0 ? `${fmtGrams(goldGrams)} Au` : null,
      split.silverPct > 0 ? `${fmtGrams(silverGrams)} Ag` : null,
      split.fiatPct > 0 ? fmtEur(fiatEur) : null,
    ]
      .filter(Boolean)
      .join(" · ");
    next = pushTxn(
      next,
      biz.id,
      "payroll",
      `Metal salary → ${member.name}`,
      `-${fmtEur(grossEur)}`,
    );
    next = pushTxn(
      next,
      personal.id,
      "payroll",
      `Salary from ${biz.business.companyName} (${member.name})`,
      `+${metalParts}`,
    );
    return { next, error: null };
  }

  const payMetalSalary = useCallback((memberId: string, salaryEur?: number) => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    const biz = s.wallets.find((w) => w.kind === "business");
    if (!biz?.business) return "Business wallet missing";
    const member = biz.business.members.find((m) => m.id === memberId);
    if (!member) return "Employee not found";
    const gross = salaryEur ?? member.salaryEur ?? 0;
    const { next, error } = applyMetalSalary(s, member, gross);
    if (error) return error;
    writeState(next);
    return null;
  }, []);

  const runMetalPayrollBatch = useCallback(() => {
    const s = readState();
    if (!s.practiceEnabled) return "Enable Practice mode in Profile first";
    const biz = s.wallets.find((w) => w.kind === "business");
    if (!biz?.business) return "Business wallet missing";
    const paid = biz.business.members.filter((m) => (m.salaryEur ?? 0) > 0);
    if (paid.length === 0) return "No employees have a salary configured";

    let next = s;
    for (const member of paid) {
      const result = applyMetalSalary(next, member, member.salaryEur ?? 0);
      if (result.error) return result.error;
      next = result.next;
    }
    writeState(next);
    return null;
  }, []);

  const requestKidsSpend = useCallback(
    (amountEur: number, label: string) => {
      const s = readState();
      const kids = s.wallets.find((w) => w.id === s.activeWalletId);
      if (!kids || kids.kind !== "kids") {
        return "Switch to a Kids wallet first";
      }
      if (amountEur <= 0) return "Enter an amount greater than zero";
      const approval: PendingSpend = {
        id: uid("ap"),
        amountEur,
        label: label.trim() || "Spend request",
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      writeState(
        updateWallet(s, kids.id, (cur) => ({
          ...cur,
          pendingApprovals: [approval, ...(cur.pendingApprovals ?? [])],
        })),
      );
      return null;
    },
    [],
  );

  const resolveKidsSpend = useCallback(
    (approvalId: string, approve: boolean) => {
      const s = readState();
      const kids = s.wallets.find(
        (w) =>
          w.kind === "kids" &&
          (w.pendingApprovals ?? []).some((a) => a.id === approvalId),
      );
      if (!kids) return "Request not found";
      const approval = (kids.pendingApprovals ?? []).find(
        (a) => a.id === approvalId,
      );
      if (!approval || approval.status !== "pending") return "Already resolved";
      let next = updateWallet(s, kids.id, (cur) => ({
        ...cur,
        pendingApprovals: (cur.pendingApprovals ?? []).map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: approve ? ("approved" as const) : ("denied" as const),
              }
            : a,
        ),
      }));
      if (approve) {
        const parent =
          s.wallets.find((w) => w.id === kids.parentId) ??
          s.wallets.find((w) => w.kind === "personal");
        if (!parent) return "Parent wallet missing";
        if (approval.amountEur > parent.balances.fiatEur + 1e-9) {
          return "Parent wallet has insufficient fiat";
        }
        next = updateWallet(next, parent.id, (cur) => ({
          ...cur,
          balances: {
            ...cur.balances,
            fiatEur: cur.balances.fiatEur - approval.amountEur,
          },
        }));
        next = updateWallet(next, kids.id, (cur) => ({
          ...cur,
          balances: {
            ...cur.balances,
            fiatEur: cur.balances.fiatEur + approval.amountEur,
          },
          spentThisMonthEur:
            (cur.spentThisMonthEur ?? 0) + approval.amountEur,
        }));
        next = pushTxn(
          next,
          kids.id,
          "approve",
          `Approved: ${approval.label}`,
          `+${fmtEur(approval.amountEur)}`,
        );
      }
      writeState(next);
      return null;
    },
    [],
  );

  const addKidsWallet = useCallback((name: string) => {
    const s = readState();
    if (!name.trim()) return "Enter a name";
    const personal = s.wallets.find((w) => w.kind === "personal");
    if (!personal) return "Personal wallet missing";
    const wallet: Wallet = {
      id: uid("w_kids"),
      kind: "kids",
      name: `Kids · ${name.trim()}`,
      currency: "EUR",
      parentId: personal.id,
      monthlyLimitEur: 100,
      spentThisMonthEur: 0,
      pendingApprovals: [],
      balances: emptyPockets({ fiatEur: 25 }),
    };
    writeState({
      ...s,
      wallets: [...s.wallets, wallet],
      activeWalletId: wallet.id,
    });
    return null;
  }, []);

  const txnsForActive = useMemo(
    () => state.transactions.filter((t) => t.walletId === activeWallet.id),
    [state.transactions, activeWallet.id],
  );

  const value: PracticeApi = {
    state,
    activeWallet,
    practiceEnabled: state.practiceEnabled,
    setPracticeEnabled,
    setActiveWallet,
    reset,
    walletTotal: walletTotalEur,
    buy,
    sell,
    sendExternal,
    receiveExternal,
    transferBetweenWallets,
    contributeToVault,
    createVoucher,
    giftVoucher,
    redeemVoucher,
    inviteTeamMember,
    setEmployeeSalary,
    payMetalSalary,
    runMetalPayrollBatch,
    requestKidsSpend,
    resolveKidsSpend,
    addKidsWallet,
    txnsForActive,
    vouchers: state.vouchers,
  };

  return (
    <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>
  );
}

export function usePractice() {
  const ctx = useContext(PracticeContext);
  if (!ctx) throw new Error("usePractice must be used within PracticeProvider");
  return ctx;
}
