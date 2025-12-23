export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "PAYPAL";
export type EntryType = "CREDIT" | "DEBIT";
export type Bank = "Monzo" | "HSBC" | "ICICI Forex" | "Lloyds";

export interface CreateExpensePayload {
    txnDate: string;
    amount: number;
    item: string;
    categoryName?: string;
    merchantName?: string;
    paymentMethod: PaymentMethod;
    bank?: Bank;
    paidBy: string;
    entryType: EntryType;
    notes?: string;
}

export interface Category {
    id: number;
    name: string;
    createdAt: string;
}

export interface Merchant {
  id: number;
  name: string;
  createdAt: string;
}

export interface Expense {
  id: number;
  txnDate: string;        // ISO date string from backend
  amount: number;
  item: string;
  category?: Category | null;
  merchant?: Merchant | null;
  paymentMethod: PaymentMethod;
  paidBy: string;
  entryType: EntryType;
  bank?: string | null;
  notes?: string | null;
  createdAt: string;
}

const API_BASE_URL = "http://localhost:8080/api/v1";

export async function createExpense(payload: CreateExpensePayload) {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if(!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create expense: ${text}`)
    }

    return res.json();
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await fetch(`${API_BASE_URL}/expenses`);
  if (!res.ok) {
    throw new Error("Failed to load expenses");
  }
  return res.json();
}

export interface ExpenseSearchParams {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export async function searchExpenses(
  params: ExpenseSearchParams = {}
): Promise<PagedResponse<Expense>> {
  const searchParams = new URLSearchParams();

  if (params.from) {
    searchParams.set("from", params.from);
  }
  if (params.to) {
    searchParams.set("to", params.to);
  }
  if (typeof params.page === "number") {
    searchParams.set("page", params.page.toString());
  }
  if (typeof params.size === "number") {
    searchParams.set("size", params.size.toString());
  }

  const queryString = searchParams.toString();
  const url =
    queryString.length > 0
      ? `${API_BASE_URL}/expenses/search?${queryString}`
      : `${API_BASE_URL}/expenses/search`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to search expenses");
  }
  return res.json();
}

function buildPrefixQuery(prefix?: string) {
  if (!prefix || !prefix.trim()) {
    return "";
  }
  const params = new URLSearchParams({ prefix: prefix.trim() });
  return `?${params.toString()}`;
}

export async function searchCategories(prefix?: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories${buildPrefixQuery(prefix)}`);
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return res.json();
}

export async function searchMerchants(prefix?: string): Promise<Merchant[]> {
  const res = await fetch(`${API_BASE_URL}/merchants${buildPrefixQuery(prefix)}`);
  if (!res.ok) {
    throw new Error("Failed to load merchants");
  }
  return res.json();
}

export interface MonthlyAnalytics {
  totalExpenditure: number;
  totalEarnings: number;
  totalBalance: number;
}

export async function getMonthlyAnalytics(): Promise<MonthlyAnalytics> {
  const res = await fetch(`${API_BASE_URL}/expenses/analytics/monthly`);
  if (!res.ok) {
    throw new Error("Failed to load monthly analytics");
  }
  return res.json();
}
