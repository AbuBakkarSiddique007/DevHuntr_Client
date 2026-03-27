"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
                const res = await fetch(`${API_BASE}/users?page=1&limit=50`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || err.message || `HTTP ${res.status}`);
                }

                const json = await res.json();
                const data = json?.data?.users || json?.users || [];
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
            const res = await fetch(`${API_BASE}/users/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ role }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || err.message || `HTTP ${res.status}`);
            }

            toast.success("Role updated");
            setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
            setRefreshKey((k) => k + 1);
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || "Failed to update role");
        } finally {
            setSavingUserId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Users className="h-7 w-7 text-blue-400" />
                        Manage Users
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">Role overview for platform accounts.</p>
                </div>

                <Button
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/5"
                    onClick={() => setRefreshKey((k) => k + 1)}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                </Button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                                <th className="py-5 px-6">Name</th>
                                <th className="py-5 px-6">Email</th>
                                <th className="py-5 px-4 text-center">Role</th>
                                <th className="py-5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center">
                                        <div className="inline-flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-5 w-5 animate-spin" /> Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center">
                                        <div className="inline-flex items-center gap-2 text-muted-foreground">
                                            <Info className="h-4 w-4" /> No users returned from API.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/2 transition-all">
                                        <td className="py-5 px-6 font-semibold text-foreground">{u.name}</td>
                                        <td className="py-5 px-6 text-sm text-muted-foreground">{u.email}</td>
                                        <td className="py-5 px-4 text-center">
                                            <select
                                                value={(editedRoles[u.id] as Role | undefined) ?? (u.role as Role)}
                                                onChange={(e) =>
                                                    setEditedRoles((prev) => ({
                                                        ...prev,
                                                        [u.id]: e.target.value as Role,
                                                    }))
                                                }
                                                className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground"
                                            >
                                                <option value="USER" className="bg-background text-foreground">
                                                    USER
                                                </option>
                                                <option value="MODERATOR" className="bg-background text-foreground">
                                                    MODERATOR
                                                </option>
                                                <option value="ADMIN" className="bg-background text-foreground">
                                                    ADMIN
                                                </option>
                                            </select>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Button
                                                onClick={() => handleSaveRole(u.id)}
                                                disabled={savingUserId === u.id}
                                                className="rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 gap-2 font-bold shadow-lg shadow-blue-500/10"
                                            >
                                                {savingUserId === u.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ShieldCheck className="h-4 w-4" />
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
