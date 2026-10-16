"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Info, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserService } from "@/services/user/user.service";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

type Role = "USER" | "MODERATOR" | "ADMIN";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [editedRoles, setEditedRoles] = useState<Record<string, Role>>({});

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const json = await UserService.listUsers({ page: 1, limit: 50 });
        const j = json as unknown as { data?: { users?: UserRow[] }; users?: UserRow[] };
        const data = j?.data?.users || j?.users || [];
        const list = Array.isArray(data) ? data : [];
        setUsers(list);
        setEditedRoles((prev) => {
          const next = { ...prev };
          for (const u of list) {
            const r = u?.role as Role | undefined;
            if (u?.id && r && !next[u.id]) next[u.id] = r;
          }
          return next;
        });
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [refreshKey]);

  const handleSaveRole = async (userId: string) => {
    const role = editedRoles[userId];
    if (!role) return;

    setSavingUserId(userId);
    try {
      await UserService.updateUserRole(userId, role);
      toast.success("Role updated successfully");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to update role");
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-6 w-6 text-primary" />
            Manage Users
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review accounts and adjust platform governance permissions.</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-9 text-xs"
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Mobile card list — visible below md */}
        <div className="md:hidden divide-y divide-border">
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading users...
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" /> No users found.
              </div>
            </div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <select
                    aria-label={`Role for ${u.name}`}
                    value={(editedRoles[u.id] as Role | undefined) ?? (u.role as Role)}
                    onChange={(e) =>
                      setEditedRoles((prev) => ({
                        ...prev,
                        [u.id]: e.target.value as Role,
                      }))
                    }
                    className="h-8 flex-1 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="USER">USER</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <Button
                    size="xs"
                    onClick={() => handleSaveRole(u.id)}
                    disabled={savingUserId === u.id || editedRoles[u.id] === u.role}
                    className="rounded-lg h-8 px-4 text-xs font-medium shrink-0"
                  >
                    {savingUserId === u.id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <ShieldCheck className="h-3 w-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table — visible md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
                <th className="py-3 px-4 sm:px-6">Name</th>
                <th className="py-3 px-4 sm:px-6">Email</th>
                <th className="py-3 px-4 text-center">Assigned Role</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Info className="h-4 w-4" /> No users found.
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-foreground">{u.name}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-muted-foreground">{u.email}</td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        aria-label={`Role for ${u.name}`}
                        value={(editedRoles[u.id] as Role | undefined) ?? (u.role as Role)}
                        onChange={(e) =>
                          setEditedRoles((prev) => ({
                            ...prev,
                            [u.id]: e.target.value as Role,
                          }))
                        }
                        className="h-8 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Button
                        size="xs"
                        onClick={() => handleSaveRole(u.id)}
                        disabled={savingUserId === u.id || editedRoles[u.id] === u.role}
                        className="rounded-lg h-7 px-3 text-xs font-medium"
                      >
                        {savingUserId === u.id ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <ShieldCheck className="h-3 w-3 mr-1" />
                        )}
                        Save
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
