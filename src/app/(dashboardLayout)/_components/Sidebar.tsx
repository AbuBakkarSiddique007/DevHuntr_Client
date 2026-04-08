"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  ChevronsRight,
  Settings,
  PlusCircle,
  ListOrdered,
  CheckCircle,
  XCircle,
  Users,
  ArrowLeft,
  LogOut,
  Tag as TagIcon,
  ShieldAlert,
  LucideIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role, useAuth } from "@/context/AuthContext";
import { ProductService } from "@/services/product/product.service";
import { ReportService } from "@/services/report/report.service";

interface SidebarProps {
  role: Role | undefined;
  userName: string;
  photoUrl?: string;
}

export const Sidebar = ({ role, userName, photoUrl }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { logout } = useAuth();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [reportCount, setReportCount] = useState<number | null>(null);

  useEffect(() => {
    if (role === "MODERATOR") {
      const fetchCounts = async () => {
        try {
          const [queueRes, reportRes] = await Promise.all([
            ProductService.getQueueProducts({ page: 1, limit: 1 }),
            ReportService.getReports({ page: 1, limit: 1, status: "OPEN" })
          ]);
          setPendingCount(queueRes.data?.meta?.total || queueRes.meta?.total || 0);
          setReportCount(reportRes.data?.meta?.total || reportRes.meta?.total || 0);
        } catch (err) {
          console.error("Failed to fetch dashboard counts", err);
        }
      };
      fetchCounts();
      const interval = setInterval(fetchCounts, 60000);
      return () => clearInterval(interval);
    }
  }, [role]);

  const getNavItems = () => {
    switch (role) {
      case "ADMIN":
        return [
          { Icon: ArrowLeft, title: "Back to Home", href: "/" },
          { Icon: Home, title: "Overview", href: "/admin-dashboard" },
          { Icon: Users, title: "Manage Users", href: "/admin-dashboard/users" },
          { Icon: TagIcon, title: "Manage Tags", href: "/admin-dashboard/tags" },
        ];
      case "MODERATOR":
        return [
          { Icon: ArrowLeft, title: "Back to Home", href: "/" },
          { Icon: Home, title: "Overview", href: "/moderator-dashboard" },
          { Icon: ListOrdered, title: "Review Queue", href: "/moderator-dashboard/queue", notifs: pendingCount ?? 0 },
          { Icon: ShieldAlert, title: "Reports", href: "/moderator-dashboard/reports", notifs: reportCount ?? 0 },
          { Icon: CheckCircle, title: "Accepted", href: "/moderator-dashboard/accepted" },
          { Icon: XCircle, title: "Rejected", href: "/moderator-dashboard/rejected" },
        ];
      default:
        return [
          { Icon: ArrowLeft, title: "Back to Home", href: "/" },
          { Icon: Home, title: "My Dashboard", href: "/user-dashboard" },
          { Icon: PlusCircle, title: "Add Product", href: "/user-dashboard/launch" },
          { Icon: ListOrdered, title: "My Products", href: "/user-dashboard/my-products" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-20'} border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-3xl p-3 shadow-xl z-50 overflow-y-auto overflow-x-hidden flex flex-col`}
    >
      <TitleSection open={open} userName={userName} role={role} photoUrl={photoUrl} />

      <div className="space-y-1.5 flex-1 mt-6">
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

      <div className="border-t border-slate-100 dark:border-white/5 pt-4 pb-20 space-y-1.5">
        <NavItem
          Icon={Settings}
          title="Profile Settings"
          href={role === "ADMIN" ? "/admin-dashboard/profile" : role === "MODERATOR" ? "/moderator-dashboard/profile" : "/user-dashboard/profile"}
          selected={pathname.endsWith("/profile")}
          open={open}
        />
        <button
          onClick={() => logout()}
          className={`relative flex h-11 w-full items-center rounded-xl transition-all duration-300 text-rose-500 hover:bg-rose-50 dark:hover:bg-red-500/10 group`}
        >
          <div className="grid h-full w-14 place-content-center shrink-0">
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className={`text-sm font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${open ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
            Logout
          </span>
        </button>
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const NavItem = ({ Icon, title, href, selected, open, notifs }: { Icon: LucideIcon, title: string, href: string, selected: boolean, open: boolean, notifs?: number }) => {
  return (
    <Link
      href={href}
      className={`relative flex h-11 w-full items-center rounded-xl transition-all duration-300 ${selected
        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 font-bold"
        : "text-slate-500 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
        }`}
    >
      <div className="grid h-full w-14 place-content-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>

      <span className={`text-sm font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${open ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
        {title}
      </span>

      {notifs !== undefined && notifs > 0 && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 dark:bg-purple-600 text-[10px] text-white font-black shadow-sm ring-2 ring-white dark:ring-[#0d0d12]">
          {notifs}
        </span>
      )}

      {!open && selected && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-l-full" />
      )}
    </Link>
  );
};

const TitleSection = ({ open, userName, role, photoUrl }: { open: boolean, userName: string, role: Role | undefined, photoUrl?: string }) => {
  return (
    <div className="mb-2 border-b border-slate-100 dark:border-white/5 pb-4 pt-2">
      <div className="flex items-center gap-3 px-1.5">
        <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 relative">
          {photoUrl ? (
            <Image 
              src={photoUrl} 
              alt={userName} 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-purple-500 to-indigo-600 font-bold text-white uppercase">
              {userName?.charAt(0)}
            </div>
          )}
        </div>
        <div className={`transition-all duration-300 overflow-hidden ${open ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
          <p className="text-sm font-black text-slate-900 dark:text-white truncate leading-none mb-1">
            {userName}
          </p>
          <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest leading-none">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 h-14 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 backdrop-blur-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all group"
    >
      <div className="flex items-center h-full px-4">
        <div className="grid h-10 w-10 place-content-center">
          <ChevronsRight className={`h-5 w-5 transition-transform duration-500 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 ${open ? "rotate-180" : ""}`} />
        </div>
        <span className={`text-sm font-bold text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 overflow-hidden ${open ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
          Collapse
        </span>
      </div>
    </button>
  );
};
