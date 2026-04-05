import { LucideIcon } from "lucide-react";

export interface MenuItem {
    name: string;
    icon: LucideIcon;
    href?: string; // Optional if it's a dropdown parent
    subItems?: SubMenuItem[]; // Nested links
}

export interface SubMenuItem {
    name: string;
    icon: LucideIcon;
    href: string;
}
