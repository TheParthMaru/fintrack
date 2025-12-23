import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseList } from "../ExpenseList";

export function AllExpensesPage() {
    return (
        <div className="space-y-8">
            <div className="px-4 md:px-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">All Expenses</h1>
                <p className="text-sm text-slate-500">
                    Browse your complete transaction history and filter by custom date ranges.
                </p>
            </div>

            <Card className="bg-white/90 border border-white/60 rounded-3xl shadow-xl shadow-slate-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg md:text-xl text-slate-800">
                        All expenses with filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ExpenseList />
                </CardContent>
            </Card>
        </div>
    );
}

