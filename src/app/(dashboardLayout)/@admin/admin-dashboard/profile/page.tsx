"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { User, Camera, Shield, Mail, Calendar, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    photoUrl: user?.photoUrl || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await updateUser(formData);
      toast.success("Profile updated successfully");

    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your identity and account security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/1 rounded-3xl border border-white/5 p-8 text-center space-y-6 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-indigo-500"></div>

            <div className="relative inline-block mx-auto">
              <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white/5 bg-white/5 shadow-2xl relative">
                {user.photoUrl ? (
                  <Image
                    src={user.photoUrl}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-purple-500/20 to-indigo-500/20">
                    <User className="h-12 w-12 text-purple-400" />
                  </div>
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-purple-600 border-4 border-black/20 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest mt-2 border border-purple-500/20">
                <Shield className="h-3 w-3" /> {user.role}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-green-400">Verified</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Joined</p>
                <p className="text-sm font-bold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-2">
          <div className="bg-white/1 rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/1">
              <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Personal Information
              </h3>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/50"
                    required
                  />
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                  <div className="flex items-center gap-3 h-12 px-4 rounded-xl border border-white/10 bg-white/2 cursor-not-allowed">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Avatar Image URL</label>
                <Input
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/50"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl px-10 h-12 bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 font-bold shadow-lg shadow-purple-500/20 group"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Saving Changes..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h4 className="font-bold text-orange-400 text-sm uppercase tracking-tight">Note: Account Restrictions</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Email addresses and account roles cannot be changed manually. If you need to update these sensitive details, please contact our administrative support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
