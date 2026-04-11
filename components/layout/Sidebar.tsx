"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Globe,
    Bus,
    CalendarCheck,
    FileText,
    Bell,
    Settings2,
    Contact,
    Plus,
    Star,
    ShieldCheck,
    LayoutDashboard,
    LogOut,
    ChevronDown,
    ChevronRight,
    Settings,
    User,
    Lock,
    Compass,
    BusFront,
    Ticket,
    MessageSquare,
    HelpCircle,
    Scale,
    Send,
    Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { MenuItem, SubMenuItem } from "@/types/nav";

const mainMenuItems: MenuItem[] = [
    {
        name: "Home",
        icon: LayoutDashboard,
        subItems: [
            { name: "Contact Now", icon: Contact, href: "/home/contact" },
        ],
    },
    {
        name: "Tours",
        icon: Globe,
        subItems: [
            { name: "All Tours", icon: Compass, href: "/tours" },
            { name: "Add Tour", icon: Plus, href: "/tours/add" },
        ],
    },
    {
        name: "Transfers",
        icon: Bus,
        subItems: [
            { name: "All Transfers", icon: BusFront, href: "/transfers" },
            { name: "Add Transfer", icon: Plus, href: "/transfers/add" },
        ],
    },
    {
        name: "Bookings",
        icon: CalendarCheck,
        subItems: [
            { name: "All Bookings", icon: Ticket, href: "/bookings" },
        ],
    },
    {
        name: "Blogs",
        icon: FileText,
        subItems: [
            { name: "All Blogs", icon: MessageSquare, href: "/blogs" },
            { name: "Add Blog", icon: Plus, href: "/blogs/add" },
            { name: "Featured", icon: Star, href: "/blogs/featured" },
        ],
    },
    {
        name: "Notifications",
        icon: Bell,
        subItems: [
            { name: "All Notifications", icon: Inbox, href: "/notifications" },
            { name: "Send Notification", icon: Send, href: "/notifications/send" },
        ],
    },
    {
        name: "Site Contents",
        icon: Settings2,
        subItems: [
            { name: "FAQ", icon: HelpCircle, href: "/site-contents/faq" },
            { name: "Privacy Policy", icon: ShieldCheck, href: "/site-contents/privacy" },
            { name: "Terms & Conditions", icon: Scale, href: "/site-contents/terms" },
        ],
    },
];

const accountMenuItems: MenuItem = {
    name: "Account Settings",
    icon: Settings,
    subItems: [
        { name: "My Profile", icon: User, href: "/profile" },
        { name: "Change Password", icon: Lock, href: "/profile/password" },
    ],
};

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (name: string) => {
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleLogout = async () => {
        try {
            dispatch(logout());
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Failed to logout", error);
            toast.error("Failed to logout");
        }
    };

    const renderMenuItem = (item: MenuItem) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isOpen = openMenus[item.name];
        const isActive = pathname === item.href || item.subItems?.some((sub: SubMenuItem) => pathname === sub.href);

        return (
            <div key={item.name} className="space-y-1">
                {hasSubItems ? (
                    <button
                        onClick={() => toggleMenu(item.name)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            isActive ? "text-white" : "text-slate-400 hover:bg-sidebar-hover hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-white")} />
                            <span className="font-medium whitespace-nowrap text-sm">{item.name}</span>
                        </div>
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                ) : (
                    <Link
                        href={item.href || "#"}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-slate-400 hover:bg-sidebar-hover hover:text-white"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-slate-400 group-hover:text-white")} />
                        <span className="font-medium whitespace-nowrap text-sm">{item.name}</span>
                    </Link>
                )}

                {hasSubItems && isOpen && item.subItems && (
                    <div className="ml-4 pl-4 border-l border-sidebar-border space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                        {item.subItems.map((sub: SubMenuItem) => (
                            <Link
                                key={sub.name}
                                href={sub.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                                    pathname === sub.href ? "text-primary font-medium" : "text-slate-500 hover:text-white"
                                )}
                            >
                                <sub.icon className={cn("w-4 h-4", pathname === sub.href ? "text-primary" : "text-slate-500 group-hover:text-white")} />
                                <span className="whitespace-nowrap">{sub.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen w-72 bg-sidebar-bg text-white border-r border-sidebar-border shrink-0 shadow-2xl overflow-hidden hidden-scrollbar">
            <div className="p-6">
                <div className="flex flex-col items-center">
                    <img
                        src="/logo.png"
                        alt="PuntaGo Logo"
                        className="w-24 h-10 object-contain"
                    />
                    <p className="text-slate-500 mt-2 uppercase text-xs font-bold tracking-widest text-center">Admin Dashboard</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto hidden-scrollbar">
                {/* Main Navigation */}
                {mainMenuItems.map(renderMenuItem)}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-1">
                {/* Account Section - now at bottom */}
                {renderMenuItem(accountMenuItems)}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200 text-slate-400 disabled:opacity-50 mt-2"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}
