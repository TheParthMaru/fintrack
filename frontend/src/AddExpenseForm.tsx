// src/AddExpenseForm.tsx
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
    createExpense,
    getExpenses,
    searchCategories,
    searchMerchants,
} from "./fintrackApi";

import type { Bank, PaymentMethod, EntryType } from "./fintrackApi";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export function AddExpenseForm() {
    const [txnDate, setTxnDate] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [item, setItem] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [merchantName, setMerchantName] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [paidBy, setPaidBy] = useState<string>("parth");
    const [entryType, setEntryType] = useState<EntryType>("DEBIT");
    const [bank, setBank] = useState<Bank>("Monzo");
    const [notes, setNotes] = useState<string>("");

    const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);
    const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
    const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);

    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadLookups() {
            try {
                const [categories, merchants] = await Promise.all([
                    searchCategories(),
                    searchMerchants(),
                ]);

                if (!ignore) {
                    setCategorySuggestions(uniqueSortedNames(categories.map((c) => c.name)));
                    setMerchantSuggestions(uniqueSortedNames(merchants.map((m) => m.name)));
                }
            } catch (err) {
                console.error("Failed to load lookup values", err);
            }
        }

        loadLookups();
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        async function loadItemSuggestions() {
            try {
                const expenses = await getExpenses();
                if (ignore) {
                    return;
                }

                const uniqueItems = uniqueSortedNames(
                    expenses
                        .map((exp) => exp.item?.trim())
                        .filter((value): value is string => Boolean(value))
                );
                setItemSuggestions(uniqueItems);
            } catch (err) {
                console.error("Failed to load item suggestions", err);
            }
        }

        loadItemSuggestions();
        return () => {
            ignore = true;
        };
    }, []);

    const filteredItemOptions = useMemo(
        () => filterStringOptions(item, itemSuggestions),
        [item, itemSuggestions]
    );
    const filteredCategoryOptions = useMemo(
        () => filterStringOptions(categoryName, categorySuggestions),
        [categoryName, categorySuggestions]
    );
    const filteredMerchantOptions = useMemo(
        () => filterStringOptions(merchantName, merchantSuggestions),
        [merchantName, merchantSuggestions]
    );

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus(null);

        if (!txnDate || !amount || !item) {
            setStatus("Please fill date, amount, and item.");
            return;
        }

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            setStatus("Amount must be a positive number.");
            return;
        }

        const payload = {
            txnDate,
            amount: numericAmount,
            item,
            categoryName: categoryName || undefined,
            merchantName: merchantName || undefined,
            paymentMethod,
            paidBy,
            entryType,
            bank,
            notes: notes || undefined,
        };

        try {
            setIsSubmitting(true);
            const saved = await createExpense(payload);
            console.log("Saved:", saved);
            setStatus(`Expense added successfully`);

            // Optional: clear some fields after save
            setAmount("");
            setItem("");
            setNotes("");
        } catch (err: any) {
            console.error(err);
            setStatus(err.message || "Failed to save expense");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="bg-white/80 border border-white/60 rounded-3xl shadow-2xl shadow-indigo-50">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg md:text-xl text-slate-800">
                        Add Expense
                    </CardTitle>

                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Date & Amount */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="txnDate">Date</Label>
                            <Input
                                id="txnDate"
                                type="date"
                                value={txnDate}
                                onChange={(e) => setTxnDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Item */}
                    <div className="space-y-1">
                        <Label htmlFor="item">Item</Label>
                        <Input
                            id="item"
                            type="text"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            autoComplete="off"
                            list="item-suggestions"
                            placeholder="Milk 2L, Bus ticket, etc."
                        />
                        <datalist id="item-suggestions">
                            {filteredItemOptions.map((suggestion) => (
                                <option key={suggestion} value={suggestion} />
                            ))}
                        </datalist>
                    </div>

                    {/* Category & Merchant */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                autoComplete="off"
                                list="category-suggestions"
                                placeholder="Grocery, Bills, Rent..."
                            />
                            <datalist id="category-suggestions">
                                {filteredCategoryOptions.map((suggestion) => (
                                    <option key={suggestion} value={suggestion} />
                                ))}
                            </datalist>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="merchant">Merchant</Label>
                            <Input
                                id="merchant"
                                type="text"
                                value={merchantName}
                                onChange={(e) => setMerchantName(e.target.value)}
                                autoComplete="off"
                                list="merchant-suggestions"
                                placeholder="Tesco Express, Online..."
                            />
                            <datalist id="merchant-suggestions">
                                {filteredMerchantOptions.map((suggestion) => (
                                    <option key={suggestion} value={suggestion} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Payment Method & Bank */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>Payment Method</Label>
                            <Select
                                value={paymentMethod}
                                onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="CARD">Card</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    <SelectItem value="PAYPAL">PayPal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label>Bank Used</Label>
                            <Select
                                value={bank}
                                onValueChange={(val) => setBank(val as Bank)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select bank" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monzo">Monzo</SelectItem>
                                    <SelectItem value="HSBC">HSBC</SelectItem>
                                    <SelectItem value="ICICI Forex">ICICI Forex</SelectItem>
                                    <SelectItem value="Lloyds">Lloyds</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Paid By & Entry Type */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>Paid By</Label>
                            <Select
                                value={paidBy}
                                onValueChange={(val) => setPaidBy(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="parth">Parth</SelectItem>
                                    <SelectItem value="jay">Jay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label>Entry Type</Label>
                            <Select
                                value={entryType}
                                onValueChange={(val) => setEntryType(val as EntryType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEBIT">Debit (expense)</SelectItem>
                                    <SelectItem value="CREDIT">Credit (income)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Optional notes..."
                        />
                    </div>

                    {status && (
                        <p className="text-sm text-indigo-600 pt-1">
                            {status}
                        </p>
                    )}

                    <CardFooter className="px-0 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-500 text-white border-none shadow-lg shadow-indigo-200"
                        >
                            {isSubmitting ? "Saving..." : "Add Expense"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}

const SUGGESTION_LIMIT = 8;

function uniqueSortedNames(values: (string | undefined | null)[]) {
    return Array.from(
        new Set(
            values
                .map((value) => value?.trim())
                .filter((value): value is string => Boolean(value))
        )
    ).sort((a, b) => a.localeCompare(b));
}

function filterStringOptions(query: string, options: string[], limit = SUGGESTION_LIMIT) {
    if (!options.length) {
        return [];
    }

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
        ? options.filter((option) =>
            option.toLowerCase().includes(normalizedQuery)
        )
        : options;

    return filtered.slice(0, limit);
}
