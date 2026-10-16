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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your identity and account security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 text-center space-y-5 shadow-xs overflow-hidden relative">
            <div className="relative inline-block mx-auto">
              <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-border bg-muted shadow-sm relative">
                {uploading ? (
                  <div className="h-full w-full flex items-center justify-center bg-muted/80 backdrop-blur-xs">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  </div>
                ) : formData.photoUrl ? (
                  <Image
                    src={formData.photoUrl}
                    alt={user.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center shadow-md hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
                aria-label="Upload photo"
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
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                  <Shield className="h-3 w-3" /> {user.role}
                </div>
                
                {/* Role specific logic: standard user check */}
                {user.role === "USER" && (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    user.isSubscribed
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}>
                    {user.isSubscribed ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                    {user.isSubscribed ? "Premium" : "Free"}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-left">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Status</p>
                <p className="text-sm font-semibold text-success flex items-center gap-1">
                  Verified
                </p>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Joined</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Membership Card - Only for standard users */}
          {user.role === "USER" && (
            user.isSubscribed ? (
              <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-center shadow-xs">
                <div className="mx-auto mb-2.5 h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Membership</p>
                <p className="text-base font-bold text-foreground">Lifetime Premium</p>
                <p className="text-xs text-muted-foreground mt-1">Unlimited access to all premium products.</p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 text-center shadow-xs">
                <div className="mx-auto mb-2.5 h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Membership</p>
                <p className="text-base font-bold text-foreground">Free Plan</p>
                <p className="text-xs text-muted-foreground mt-1 text-balance">Unlock premium products with a membership.</p>
              </div>
            )
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Information
              </h3>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="rounded-lg border-border bg-background h-10"
                    required
                  />
                </div>
                <div className="space-y-2 opacity-70 min-w-0">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-2.5 h-10 px-3 rounded-lg border border-border bg-muted/40 cursor-not-allowed min-w-0">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full sm:w-auto rounded-lg px-6 h-10 font-semibold"
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

          <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Note: Account Restrictions</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Email addresses and roles cannot be modified directly. Contact administrative support if you need assistance updating your account details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
