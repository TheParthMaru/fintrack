import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Expense } from "./fintrackApi";
import { searchExpenses } from "./fintrackApi";

const RECENT_LIMIT = 20;

export function RecentExpensesTable() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchRecent() {
            setLoading(true);
            try {
                const data = await searchExpenses({ page: 0, size: RECENT_LIMIT });
                if (!isMounted) {
                    return;
                }
                setExpenses(data.content);
                setError(null);
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                const message = err instanceof Error ? err.message : "Failed to load recent expenses";
                setError(message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchRecent();
        return () => {
            isMounted = false;
        };
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="w-full">
            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-2 text-sm text-red-700 mb-4">
                    {error}
                </div>
            )}

            <Table className="text-slate-600">
                <TableCaption>
                    Showing up to {RECENT_LIMIT} most recent expenses
                </TableCaption>

                <TableHeader>
                    <TableRow className="text-slate-400">
                        <TableHead className="text-slate-500">Date</TableHead>
                        <TableHead className="text-slate-500">Item</TableHead>
                        <TableHead className="text-right text-slate-500">Amount</TableHead>
                        <TableHead className="text-slate-500">Category</TableHead>
                        <TableHead className="text-slate-500">Merchant</TableHead>
                        <TableHead className="text-slate-500">Bank</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-sm text-slate-500">
                                Loading recent expenses...
                            </TableCell>
                        </TableRow>
                    )}

                    {!loading && expenses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-sm text-slate-500">
                                No expenses recorded yet.
                            </TableCell>
                        </TableRow>
                    )}

                    {!loading &&
                        expenses.map((expense) => (
                            <TableRow key={expense.id} className="hover:bg-indigo-50/60 transition-colors">
                                <TableCell>{formatDate(expense.txnDate)}</TableCell>
                                <TableCell>{expense.item}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell>{expense.category?.name ?? "-"}</TableCell>
                                <TableCell>{expense.merchant?.name ?? "-"}</TableCell>
                                <TableCell>{expense.bank ?? "-"}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

