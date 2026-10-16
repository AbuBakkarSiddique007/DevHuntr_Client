import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "OPEN"
  | "RESOLVED"
  | "DISMISSED";

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    classes: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    classes:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30",
  },
  OPEN: {
    label: "Open",
    icon: AlertCircle,
    classes:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    classes:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30",
  },
  RESOLVED: {
    label: "Resolved",
    icon: CheckCircle2,
    classes:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    classes:
      "bg-destructive/10 text-destructive border-destructive/20 dark:border-destructive/30",
  },
  DISMISSED: {
    label: "Dismissed",
    icon: XCircle,
    classes:
      "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();
  const config = statusConfig[normalized] || {
    label: status,
    icon: AlertCircle,
    classes: "bg-muted text-muted-foreground border-border",
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide uppercase leading-none transition-colors",
        size === "sm"
          ? "text-xs px-2 py-0.5"
          : "text-xs px-2.5 py-1",
        config.classes,
        className
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3 shrink-0" : "h-3.5 w-3.5 shrink-0"} />
      <span>{config.label}</span>
    </span>
  );
}
