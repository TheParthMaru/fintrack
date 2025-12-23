// src/components/Header.tsx
import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "./ui/sheet";
import { Sidebar, type SidebarPage } from "./Sidebar";

interface HeaderProps {
    activePage: SidebarPage;
    onNavigate: (page: SidebarPage) => void;
}

export function Header({ activePage, onNavigate }: HeaderProps) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 md:px-8 py-4">
            {/* Left: mobile menu + title */}
            <div className="flex items-center gap-4">
                {/* Mobile menu */}
                <div className="md:hidden">
                    <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                        <SheetTrigger asChild>
                            <button className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/80 p-2 text-slate-600 shadow-sm">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-white text-slate-700">
                            <Sidebar
                                activePage={activePage}
                                onNavigate={(page) => {
                                    onNavigate(page);
                                    setIsMobileNavOpen(false);
                                }}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Right: search + user */}
            <div className="flex flex-1 md:flex-none flex-col gap-3 md:flex-row md:items-center md:justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="rounded-full border border-white/70 bg-white p-0.5 shadow">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Alerts
                        </DropdownMenuItem>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
