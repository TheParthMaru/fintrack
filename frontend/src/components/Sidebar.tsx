// src/components/Sidebar.tsx
import { LayoutDashboard, Landmark, PieChart, Settings } from "lucide-react";
import { cn } from "../lib/utils";

export type SidebarPage = "dashboard" | "all-expenses" | "analytics" | "settings";

interface NavItem {
    label: string;
    page: SidebarPage;
    icon: typeof LayoutDashboard;
}

interface SidebarProps {
    activePage: SidebarPage;
    onNavigate: (page: SidebarPage) => void;
}

const navItems: NavItem[] = [
    { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
    { label: "All Expenses", page: "all-expenses", icon: Landmark },
    { label: "Analytics", page: "analytics", icon: PieChart },
    { label: "Settings", page: "settings", icon: Settings },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-b from-white/90 via-white to-[#e4edff]/60 text-slate-700">
            <div className="p-6 border-b border-white/60">
                <div className="text-2xl font-semibold tracking-tight">
                    FinTrack
                </div>
                <div className="text-xs text-slate-400">Personal Finance Suite</div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = activePage === item.page;
                    return (
                        <button
                            key={item.label}
                            onClick={() => onNavigate(item.page)}
                            className={cn(
                                "w-full flex items-center justify-start px-4 py-3 rounded-2xl text-sm font-medium transition-all gap-3",
                                isActive
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200"
                                    : "text-slate-500 hover:bg-white hover:text-indigo-600"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="px-6 pb-5 pt-3 border-t border-white/60 text-xs text-slate-400">
                © {new Date().getFullYear()} FinTrack
            </div>
        </div>
    );
}
