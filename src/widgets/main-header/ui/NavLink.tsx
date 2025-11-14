import React from "react";
import {clsx} from "clsx";
import {Link} from "react-router-dom";
import {Button} from "@/shared/ui/base";

interface NavLinkProps {
    className?: string
}

interface NavItem {
    label: string;
    href: string;
    icon?: React.ElementType
}

const navItems: NavItem[] = [
    { label: "탐색", href: "/explore"},
    { label: "인기", href: "/trending"},
    { label: "주제", href: "/topics"},
]

export const NavLink = ({ className }: NavLinkProps) => {

    return (
        <nav className={clsx("flex items-center gap-6", className)}>
            {navItems.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className="text-sm"
                    >
                        {Icon && <Icon />}
                        <Button variant="ghost">
                            {item.label}
                        </Button>
                    </Link>
                )
            })}
        </nav>
    )
}