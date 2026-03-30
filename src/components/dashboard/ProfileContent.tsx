"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { User, Camera, Shield, Mail, Calendar, Loader2, CheckCircle, Crown, Zap, Lock } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";

export function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    photoUrl: user?.photoUrl || "",
  });

  if (!user) return null;

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, photoUrl: uploadedUrl }));
      toast.success("Photo uploaded! Click 'Update Profile' to save.");
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your identity and account security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/1 rounded-3xl border border-white/5 p-8 text-center space-y-6 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-indigo-500"></div>

            <div className="relative inline-block mx-auto">
              <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white/5 bg-white/5 shadow-2xl relative">
                {uploading ? (
                  <div className="h-full w-full flex items-center justify-center bg-purple-500/10 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                ) : formData.photoUrl ? (
                  <Image
                    src={formData.photoUrl}
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
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-purple-600 border-4 border-white/10 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">
                  <Shield className="h-3 w-3" /> {user.role}
                </div>
                
                {/* Role specific logic: standard user check */}
                {user.role === "USER" && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    user.isSubscribed
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-white/5 text-muted-foreground border-white/10"
                    }`}>
                    {user.isSubscribed ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                    {user.isSubscribed ? "Premium" : "Free"}
                    </div>
                )}
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

          {/* Membership Card - Only for standard users */}
          {user.role === "USER" && (
            user.isSubscribed ? (
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 text-center shadow-lg shadow-amber-500/5">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-amber-500 to-yellow-400" />
                <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Membership</p>
                <p className="text-lg font-extrabold text-white">Lifetime Premium</p>
                <p className="text-xs text-muted-foreground mt-1">Unlimited access to all premium products.</p>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/2 p-6 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Membership</p>
                <p className="text-lg font-extrabold text-white">Free Plan</p>
                <p className="text-xs text-muted-foreground mt-1 text-balance">Visit a premium product to unlock full access.</p>
                </div>
            )
          )}
        </div>

        {/* Right Column: Form */}
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

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || uploading}
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
