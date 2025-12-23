// src/App.tsx
import { useState, useEffect } from "react";
import { MainLayout } from "./layout/MainLayout";
import { AddExpenseForm } from "./AddExpenseForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getMonthlyAnalytics, type MonthlyAnalytics } from "./fintrackApi";
import { RecentExpensesTable } from "./RecentExpensesTable";
import { AllExpensesPage } from "./pages/AllExpensesPage";
import type { SidebarPage } from "@/components/Sidebar";

type AppPage = SidebarPage;

function App() {
  const [analytics, setAnalytics] = useState<MonthlyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<AppPage>("dashboard");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const data = await getMonthlyAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const summaryCards = analytics
    ? [
      {
        title: "Total Expenditure",
        value: formatCurrency(analytics.totalExpenditure),
        sub: "Current month",
        badge: "Debit",
        gradient: "from-rose-100 to-orange-100 text-rose-600",
      },
      {
        title: "Total Earnings",
        value: formatCurrency(analytics.totalEarnings),
        sub: "Current month",
        badge: "Credit",
        gradient: "from-emerald-100 to-teal-100 text-emerald-600",
      },
      {
        title: "Total Savings",
        value: formatCurrency(analytics.totalBalance),
        sub: "Current month",
        badge: analytics.totalBalance >= 0 ? "Positive" : "Negative",
        gradient:
          analytics.totalBalance >= 0
            ? "from-sky-400/10 to-indigo-200/60 text-indigo-700"
            : "from-rose-400/10 to-red-200/60 text-red-700",
      },
    ]
    : [
      {
        title: "Total Expenditure",
        value: loading ? "Loading..." : "₹0.00",
        sub: "Current month",
        badge: "Debit",
        gradient: "from-rose-100 to-orange-100 text-rose-600",
      },
      {
        title: "Total Earnings",
        value: loading ? "Loading..." : "₹0.00",
        sub: "Current month",
        badge: "Credit",
        gradient: "from-emerald-100 to-teal-100 text-emerald-600",
      },
      {
        title: "Total Savings",
        value: loading ? "Loading..." : "₹0.00",
        sub: "Current month",
        badge: "Balance",
        gradient: "from-sky-400/10 to-indigo-200/60 text-indigo-700",
      },
    ];

  const dashboardContent = (
    <div className="space-y-8">
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Monitor balances, expenses, investments, and upcoming goals at a glance.
        </p>
      </div>

      {error && (
        <div className="px-4 md:px-0">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error loading analytics: {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            className={`rounded-3xl border-none shadow-lg shadow-indigo-50 bg-gradient-to-br ${card.gradient}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>{card.title}</span>
                <span className="px-3 py-1 rounded-full bg-white/60 text-slate-600">{card.badge}</span>
              </div>
              <CardTitle className="text-2xl mt-2">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500">{card.sub}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
        <div>
          <AddExpenseForm />
        </div>

        <Card className="bg-white/90 border border-white/60 rounded-3xl shadow-xl shadow-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl text-slate-800">
              Recent Expenses
            </CardTitle>
            <p className="text-xs text-slate-500">Latest 20 transactions</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <RecentExpensesTable />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return dashboardContent;
      case "all-expenses":
        return <AllExpensesPage />;
      case "analytics":
      case "settings":
        return <PlaceholderPage page={activePage} />;
      default:
        return dashboardContent;
    }
  };

  return (
    <MainLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </MainLayout>
  );
}

function PlaceholderPage({ page }: { page: Exclude<AppPage, "dashboard" | "all-expenses"> }) {
  const title = page === "analytics" ? "Analytics" : "Settings";
  return (
    <div className="space-y-6">
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500">This section is coming soon.</p>
      </div>
    </div>
  );
}

export default App;
