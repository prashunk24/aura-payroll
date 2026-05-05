/**
 * Centralized API endpoint config.
 * Modify these to point to your backend / Solana indexer.
 * UI components MUST import from here — never hardcode paths.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3001";

export const SOLANA_NETWORK =
  (import.meta.env.VITE_SOLANA_NETWORK as string | undefined) ?? "mainnet-beta";

export const SOLANA_RPC =
  (import.meta.env.VITE_SOLANA_RPC as string | undefined) ?? "https://api.mainnet-beta.solana.com";

export const API_ENDPOINTS = {
  // Auth / user
  user: {
    me: "/api/user/me",
    data: "/api/user/data",
    update: "/api/user/update",
  },
  // Payroll
  payroll: {
    send: "/api/payroll/send",
    list: "/api/payroll/list",
    schedule: "/api/payroll/schedule",
    cancel: "/api/payroll/cancel/:id",
  },
  // Employees
  employees: {
    list: "/api/employees",
    create: "/api/employees",
    update: "/api/employees/:id",
    remove: "/api/employees/:id",
  },
  // Tax
  tax: {
    settings: "/api/tax/settings",
    deduct: "/api/tax/deduct",
    vault: "/api/tax/vault",
    deposit: "/api/tax/vault/deposit",
    withdraw: "/api/tax/vault/withdraw",
    yield: "/api/tax/vault/yield",
  },
  // Transactions
  transactions: {
    list: "/api/transactions",
    detail: "/api/transactions/:id",
  },
  // Web3 / Solana
  web3: {
    walletStatus: "/api/web3/wallet/status",
    sign: "/api/web3/sign",
    broadcast: "/api/web3/broadcast",
  },
} as const;

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiEndpointMeta {
  method: ApiMethod;
  path: string;
  description: string;
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
}

/** Documentation-grade endpoint registry used by the Developer page. */
export const API_DOCS: ApiEndpointMeta[] = [
  {
    method: "POST",
    path: API_ENDPOINTS.payroll.send,
    description: "Send a payroll batch to one or more employee wallets.",
    request: { employees: [{ wallet: "8xK...3aP", amountUsdc: 2500 }], memo: "April salary" },
    response: { txId: "5sZ...9Qa", status: "submitted" },
  },
  {
    method: "GET",
    path: API_ENDPOINTS.user.data,
    description: "Get current user profile + on-chain balances.",
    response: { wallet: "8xK...3aP", role: "employer", balanceUsdc: 124500 },
  },
  {
    method: "GET",
    path: API_ENDPOINTS.employees.list,
    description: "List employees registered for the current organization.",
    response: { employees: [{ id: "emp_01", name: "Ada Lovelace", wallet: "9zP...7bQ", salary: 4200 }] },
  },
  {
    method: "POST",
    path: API_ENDPOINTS.tax.deposit,
    description: "Deposit funds into the yield-earning tax vault.",
    request: { amountUsdc: 10000 },
    response: { vaultBalance: 134500, apy: 5.4 },
  },
  {
    method: "POST",
    path: API_ENDPOINTS.tax.withdraw,
    description: "Withdraw from the tax vault to operating wallet.",
    request: { amountUsdc: 5000 },
    response: { vaultBalance: 129500, txId: "3hY...2cR" },
  },
  {
    method: "GET",
    path: API_ENDPOINTS.tax.yield,
    description: "Time-series yield analytics for the tax vault.",
    response: { points: [{ t: "2025-01", apy: 5.1, earned: 412 }] },
  },
  {
    method: "GET",
    path: API_ENDPOINTS.transactions.list,
    description: "Paginated transaction history (payroll + vault).",
    response: { items: [{ id: "tx_001", type: "payroll", amountUsdc: 2500, ts: 1714000000 }] },
  },
  {
    method: "POST",
    path: API_ENDPOINTS.web3.sign,
    description: "Request a Solana transaction signature from the connected wallet.",
    request: { tx: "base64..." },
    response: { signature: "5sZ...9Qa" },
  },
];
