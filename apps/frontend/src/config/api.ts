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
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
  // Payroll
  payroll: {
    prepareBatch: "/api/payroll/prepare-batch",
    run: "/api/payroll/run",
    list: "/api/payroll/list",
  },
  // Employees
  employees: {
    list: "/api/employee/list",
    add: "/api/employee/add",
  },
  // Stats
  stats: {
    overview: "/api/stats/overview",
    charts: "/api/stats/charts",
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
    path: API_ENDPOINTS.payroll.run,
    description: "Send a payroll batch to one or more employee wallets.",
    request: { employeeId: "emp_01", amount: 2500, signature: "5sZ...9Qa" },
    response: { id: "rec_123", status: "INITIATED" },
  },
  {
    method: "GET",
    path: API_ENDPOINTS.stats.overview,
    description: "Get organization payroll and yield stats.",
    response: { totalPayroll: 124500, totalEmployees: 44, totalTaxWithheld: 18000, activeYield: 900 },
  },
  {
    method: "GET",
    path: API_ENDPOINTS.employees.list,
    description: "List employees registered for the current organization.",
    response: { employees: [{ id: "emp_01", name: "Ada Lovelace", wallet: "9zP...7bQ", salary: 4200 }] },
  },
];
