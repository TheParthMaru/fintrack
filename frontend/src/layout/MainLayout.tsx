// src/layout/MainLayout.tsx
import type { ReactNode } from "react";
import { Sidebar, type SidebarPage } from "../components/Sidebar";
import { Header } from "../components/Header";

interface MainLayoutProps {
    children: ReactNode;
    activePage: SidebarPage;
    onNavigate: (page: SidebarPage) => void;
}

export function MainLayout({ children, activePage, onNavigate }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8faff] via-[#f2f7ff] to-[#e1f2ff] text-slate-700 flex font-['Inter',_sans-serif]">
            {/* Sidebar on desktop */}
            <div className="hidden md:flex w-45 bg-white/50 backdrop-blur border-r border-white/40 shadow-xl">
                <Sidebar activePage={activePage} onNavigate={onNavigate} />
            </div>

            {/* Mobile sidebar overlay will be handled inside Header via Sheet */}

            <div className="flex-1 flex flex-col">
                <Header activePage={activePage} onNavigate={onNavigate} />

                <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
