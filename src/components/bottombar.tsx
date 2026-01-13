import { Home, Search, MessageCircle, PlusCircle } from "lucide-react";

import { NavLink } from "react-router";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Create", icon: PlusCircle, href: "/create" },
  { label: "Messages", icon: MessageCircle, href: "/messages" },
];

export function BottomBar() {
  return (
    <nav className="bg-background/40 border-border fixed bottom-0 z-50 mx-auto flex h-16 w-full items-center justify-around rounded-t-xl border-t backdrop-blur-xl md:hidden">
      {navItems.map(({ label, icon: Icon, href }) => (
        <NavLink
          key={label}
          to={href}
          className={({ isActive }) =>
            buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              size: "icon",
            })
          }
        >
          <Icon />
        </NavLink>
      ))}
    </nav>
  );
}
