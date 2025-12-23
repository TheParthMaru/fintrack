import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Expense } from "./fintrackApi";
import { searchExpenses } from "./fintrackApi";

const PAGE_SIZE = 10;

export function ExpenseList() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await searchExpenses({
                from: fromDate || undefined,
                to: toDate || undefined,
                page,
                size: PAGE_SIZE,
            });
            setExpenses(data.content);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalElements);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load expenses";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate, page]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }, []);

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

    const canGoNext = useMemo(() => {
        if (totalPages === 0) {
            return false;
        }
        return page < totalPages - 1;
    }, [page, totalPages]);

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage((prev) => (canGoNext ? prev + 1 : prev));
    };

    const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFromDate(event.target.value);
        setPage(0);
    };

    const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
        setToDate(event.target.value);
        setPage(0);
    };

    const handleClearFilters = () => {
        setFromDate("");
        setToDate("");
        setPage(0);
    };

    const startRecord = totalItems === 0 ? 0 : page * PAGE_SIZE + 1;
    const endRecord = totalItems === 0 ? 0 : page * PAGE_SIZE + expenses.length;

    return (
        <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-slate-500">From date</label>
                    <Input type="date" value={fromDate} onChange={handleFromChange} />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-slate-500">To date</label>
                    <Input type="date" value={toDate} onChange={handleToChange} />
                </div>

                <div className="flex items-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearFilters}
                        disabled={!fromDate && !toDate}
                        className="w-full"
                    >
                        Clear filters
                    </Button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <Table className="text-slate-600">
                <TableCaption>
                    {loading ? "Loading expenses..." : "List of all expenses"}
                </TableCaption>

                <TableHeader>
                    <TableRow className="text-slate-400">
                        <TableHead className="text-slate-500">Date</TableHead>
                        <TableHead className="text-slate-500">Item</TableHead>
                        <TableHead className="text-right text-slate-500">Amount</TableHead>
                        <TableHead className="text-slate-500">Category</TableHead>
                        <TableHead className="text-slate-500">Merchant</TableHead>
                        <TableHead className="text-slate-500">Bank</TableHead>
                        <TableHead className="text-slate-500">Method</TableHead>
                        <TableHead className="text-slate-500">Paid By</TableHead>
                        <TableHead className="text-slate-500">Type</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-6 text-sm text-slate-500">
                                Fetching expenses...
                            </TableCell>
                        </TableRow>
                    )}

                    {!loading && expenses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-6 text-sm text-slate-500">
                                No expenses found for the selected range.
                            </TableCell>
                        </TableRow>
                    )}

                    {!loading &&
                        expenses.map((expense: Expense) => (
                            <TableRow
                                key={expense.id}
                                className="hover:bg-indigo-50/60 transition-colors"
                            >
                                <TableCell>{formatDate(expense.txnDate)}</TableCell>
                                <TableCell>{expense.item}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(expense.amount)}
                                </TableCell>

                                <TableCell>{expense.category?.name || "-"}</TableCell>
                                <TableCell>{expense.merchant?.name || "-"}</TableCell>
                                <TableCell>{expense.bank || "-"}</TableCell>
                                <TableCell>{expense.paymentMethod}</TableCell>
                                <TableCell>{expense.paidBy}</TableCell>
                                <TableCell>{expense.entryType}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <div>
                    Showing {startRecord}-{endRecord} of {totalItems} records
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={page === 0 || loading}
                    >
                        Previous
                    </Button>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Page {totalPages === 0 ? 0 : page + 1} of {totalPages === 0 ? 0 : totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={!canGoNext || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
