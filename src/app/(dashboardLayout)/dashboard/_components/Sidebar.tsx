"use client";

import React, { useState } from "react";
import {
  Home,
  ChevronDown,
  ChevronsRight,
  Settings,
  HelpCircle,
  PlusCircle,
  ListOrdered,
  CheckCircle,
  XCircle,
  Users,
  LineChart,
  Ghost
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/context/AuthContext";

interface SidebarProps {
  role: Role | undefined;
  userName: string;
}

export const Sidebar = ({ role, userName }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  // Role-based Navigation Items
  const getNavItems = () => {
    switch (role) {
      case "ADMIN":
        return [
          { Icon: Home, title: "Overview", href: "/dashboard" },
          { Icon: Users, title: "Manage Users", href: "/dashboard/users" },
          { Icon: LineChart, title: "Analytics", href: "/dashboard/analytics" },
          { Icon: Settings, title: "Global Settings", href: "/dashboard/settings" },
        ];
      case "MODERATOR":
        return [
          { Icon: Home, title: "Overview", href: "/dashboard" },
          { Icon: ListOrdered, title: "Review Queue", href: "/dashboard/queue", notifs: 5 },
          { Icon: CheckCircle, title: "Accepted", href: "/dashboard/accepted" },
          { Icon: XCircle, title: "Rejected", href: "/dashboard/rejected" },
        ];
      default: // USER
        return [
          { Icon: Home, title: "My Dashboard", href: "/dashboard" },
          { Icon: PlusCircle, title: "Add Product", href: "/products/launch" },
          { Icon: ListOrdered, title: "My Products", href: "/dashboard/my-products" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-20'
        } border-white/10 bg-black/40 backdrop-blur-3xl p-3 shadow-xl z-50 overflow-y-auto overflow-x-hidden flex flex-col`}
    >
      <TitleSection open={open} userName={userName} role={role} />

      <div className="space-y-2 flex-1 mt-4">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            Icon={item.Icon}
            title={item.title}
            href={item.href}
            selected={pathname === item.href}
            open={open}
            notifs={item.notifs}
          />
        ))}
      </div>

      <div className="border-t border-white/10 pt-4 pb-20 space-y-2">
        {open && (
          <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Support
          </div>
        )}
        <NavItem
          Icon={Settings}
          title="Profile Settings"
          href="/dashboard/profile"
          selected={pathname === "/dashboard/profile"}
          open={open}
        />
        <NavItem
          Icon={HelpCircle}
          title="Help Center"
          href="/help"
          selected={pathname === "/help"}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const NavItem = ({ Icon, title, href, selected, open, notifs }: any) => {
  return (
    <Link
      href={href}
      className={`relative flex h-12 w-full items-center rounded-xl transition-all duration-300 ${selected
        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        }`}
    >
      <div className="grid h-full w-14 place-content-center shrink-0">
        <Icon className={`h-5 w-5 transition-colors ${selected ? 'text-purple-400' : ''}`} />
      </div>

      <span
        className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden ${open ? 'w-32 opacity-100' : 'w-0 opacity-0'
          }`}
      >
        {title}
      </span>

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white font-bold ring-4 ring-black/20">
          {notifs}
        </span>
      )}

      {!open && selected && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-500 rounded-l-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
      )}
    </Link>
  );
};

const TitleSection = ({ open, userName, role }: any) => {
  return (
    <div className="mb-4 border-b border-white/10 pb-4 mt-2">
      <div className="flex items-center gap-3 px-2">
        <Logo />
        <div className={`transition-all duration-300 overflow-hidden ${open ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
          <span className="block text-sm font-bold text-foreground truncate">
            {userName}
          </span>
          <span className="block text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid h-10 w-10 shrink-0 place-content-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
      <Ghost className="h-6 w-6 text-white" />
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-xl hover:bg-white/5 transition-colors group h-14"
    >
      <div className="flex items-center h-full px-4">
        <div className="grid h-10 w-10 place-content-center">
          <ChevronsRight
            className={`h-5 w-5 transition-transform duration-500 text-muted-foreground group-hover:text-purple-400 ${open ? "rotate-180" : ""
              }`}
          />
        </div>
        <span
          className={`text-sm font-bold text-muted-foreground group-hover:text-purple-400 transition-all duration-300 overflow-hidden ${open ? 'w-20 opacity-100' : 'w-0 opacity-0'
            }`}
        >
          Collapse
        </span>
      </div>
    </button>
  );
};
