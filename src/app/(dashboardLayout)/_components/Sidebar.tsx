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
  onCloseMobile?: () => void;
}

export const Sidebar = ({ role, userName, photoUrl, onCloseMobile }: SidebarProps) => {
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
          setPendingCount(queueRes.meta?.total || 0);
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
          { Icon: Home, title: "Overview", href: "/admin-dashboard" },
          { Icon: Users, title: "Manage Users", href: "/admin-dashboard/users" },
          { Icon: TagIcon, title: "Manage Tags", href: "/admin-dashboard/tags" },
        ];
      case "MODERATOR":
        return [
          { Icon: Home, title: "Overview", href: "/moderator-dashboard" },
          { Icon: ListOrdered, title: "Review Queue", href: "/moderator-dashboard/queue", notifs: pendingCount ?? 0 },
          { Icon: ShieldAlert, title: "Reports", href: "/moderator-dashboard/reports", notifs: reportCount ?? 0 },
          { Icon: CheckCircle, title: "Accepted", href: "/moderator-dashboard/accepted" },
          { Icon: XCircle, title: "Rejected", href: "/moderator-dashboard/rejected" },
        ];
      default:
        return [
          { Icon: Home, title: "My Dashboard", href: "/user-dashboard" },
          { Icon: PlusCircle, title: "Add Product", href: "/user-dashboard/launch" },
          { Icon: ListOrdered, title: "My Products", href: "/user-dashboard/my-products" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      aria-label="Dashboard sidebar"
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out w-64 ${
        open ? "lg:w-64" : "lg:w-20"
      } border-border bg-card p-3 shadow-lg overflow-hidden flex flex-col`}
    >
      <TitleSection open={open} userName={userName} role={role} photoUrl={photoUrl} onCloseMobile={onCloseMobile} />

      <div className="mt-2 mb-2">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex h-10 w-full items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
        >
          <div className="grid h-full w-14 place-content-center shrink-0">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span
            className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 overflow-hidden ${
              open ? "w-36 opacity-100" : "w-36 opacity-100 lg:w-0 lg:opacity-0"
            }`}
          >
            Back to Home
          </span>
        </Link>
      </div>

      <div className="h-px bg-border my-1" />

      <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar mt-2 pr-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            Icon={item.Icon}
            title={item.title}
            href={item.href}
            selected={pathname === item.href}
            open={open}
            notifs={item.notifs}
            onClick={onCloseMobile}
          />
        ))}
      </div>

      <div className="border-t border-border pt-2 pb-6 lg:pb-14 space-y-1">
        <NavItem
          Icon={Settings}
          title="Profile Settings"
          href={
            role === "ADMIN"
              ? "/admin-dashboard/profile"
              : role === "MODERATOR"
              ? "/moderator-dashboard/profile"
              : "/user-dashboard/profile"
          }
          selected={pathname.endsWith("/profile")}
          open={open}
          onClick={onCloseMobile}
        />
        <button
          onClick={() => {
            onCloseMobile?.();
            logout();
          }}
          aria-label="Logout"
          className="relative flex h-10 w-full items-center rounded-xl transition-all duration-200 text-destructive hover:bg-destructive/10 group"
        >
          <div className="grid h-full w-14 place-content-center shrink-0">
            <LogOut className="h-4 w-4 group-hover:scale-105 transition-transform" />
          </div>
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${
              open ? "w-32 opacity-100" : "w-32 opacity-100 lg:w-0 lg:opacity-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const NavItem = ({
  Icon,
  title,
  href,
  selected,
  open,
  notifs,
  onClick,
}: {
  Icon: LucideIcon;
  title: string;
  href: string;
  selected: boolean;
  open: boolean;
  notifs?: number;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex h-10 w-full items-center rounded-xl transition-all duration-200 ${
        selected
          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
      }`}
    >
      <div className="grid h-full w-14 place-content-center shrink-0 relative">
        <Icon className="h-4 w-4" />
        {/* Collapsed notification indicator on desktop */}
        {!open && notifs !== undefined && notifs > 0 && (
          <span className="hidden lg:block absolute top-1.5 right-3.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
        )}
      </div>

      <span
        className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${
          open ? "w-32 opacity-100" : "w-32 opacity-100 lg:w-0 lg:opacity-0"
        }`}
      >
        {title}
      </span>

      {/* Expanded notification count */}
      {notifs !== undefined && notifs > 0 && (
        <span
          className={`absolute right-3 px-1.5 min-w-5 h-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold ${
            open ? "flex" : "flex lg:hidden"
          }`}
        >
          {notifs}
        </span>
      )}

      {/* Collapsed active bar indicator on desktop */}
      {!open && selected && (
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-l-full" />
      )}
    </Link>
  );
};

const TitleSection = ({
  open,
  userName,
  role,
  photoUrl,
  onCloseMobile,
}: {
  open: boolean;
  userName: string;
  role: Role | undefined;
  photoUrl?: string;
  onCloseMobile?: () => void;
}) => {
  return (
    <div className="mb-1 border-b border-border pb-3 pt-1">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden shadow-sm border border-border bg-muted relative">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={userName || "User"}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/20 text-primary font-bold text-sm uppercase">
                {userName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              open ? "w-36 opacity-100" : "w-36 opacity-100 lg:w-0 lg:opacity-0"
            }`}
          >
            <p className="text-sm font-semibold text-foreground truncate leading-snug">
              {userName}
            </p>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider leading-none">
              {role}
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar menu"
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      className="hidden lg:flex absolute bottom-0 left-0 right-0 h-12 border-t border-border bg-card/60 backdrop-blur-md hover:bg-muted transition-colors group items-center"
    >
      <div className="flex items-center h-full px-4 w-full">
        <div className="grid h-8 w-8 place-content-center shrink-0">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-muted-foreground group-hover:text-primary ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        <span
          className={`text-xs font-medium text-muted-foreground group-hover:text-primary transition-all duration-300 overflow-hidden whitespace-nowrap ${
            open ? "w-24 opacity-100" : "w-0 opacity-0"
          }`}
        >
          Collapse
        </span>
      </div>
    </button>
  );
};
