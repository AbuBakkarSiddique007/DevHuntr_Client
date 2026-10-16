"use client";

import { useEffect, useState } from "react";
import { CouponService, Coupon } from "@/services/coupon/coupon.service";
import {
  Plus,
  Loader2,
  Trash2,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CouponsManagementPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercentage: "",
    expiryDays: "30",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await CouponService.getCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { code, description, discountPercentage, expiryDays } = formData;

    if (!code || !description || !discountPercentage) {
      return toast.error("Please fill all fields");
    }

    setIsCreating(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Number(expiryDays));

      const payload = {
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountPercentage: Number(discountPercentage),
        expiryDate: expiryDate.toISOString()
      };

      const created = await CouponService.createCoupon(payload);
      toast.success(`Coupon ${created.code} activated successfully`);
      setCoupons(prev => [created, ...prev]);
      setFormData({ code: "", description: "", discountPercentage: "", expiryDays: "30" });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to create coupon");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    const { id, code } = couponToDelete;

    setDeletingId(id);
    try {
      await CouponService.deleteCoupon(id);
      toast.success(`Coupon ${code} deleted`);
      setCoupons(prev => prev.filter(c => c.id !== id));
      setCouponToDelete(null);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <Ticket className="h-7 w-7 text-primary" />
          Discount Coupons
        </h1>
        <p className="text-muted-foreground mt-1.5 text-base">Create and manage configurable discount codes for platform monetization.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="xl:col-span-1 border border-border bg-card rounded-2xl p-6 h-fit shadow-xs">
          <h3 className="font-semibold text-lg mb-5 flex items-center gap-2 text-foreground">
            <Plus className="h-5 w-5 text-primary" /> Generate New Coupon
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">Coupon Code</label>
              <Input
                placeholder="e.g. LAUNCH100"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                pattern="[A-Za-z0-9\-_]+"
                title="Letters, numbers, underscores and hyphens only"
                className="h-11 bg-muted/40 border-border rounded-xl px-4 font-mono uppercase text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">Description</label>
              <Input
                placeholder="e.g. 50% Off First Product"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-11 bg-muted/40 border-border rounded-xl px-4 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">Discount %</label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="25"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="h-11 bg-muted/40 border-border rounded-xl px-4 pl-8 text-sm"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">%</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">Valid For (Days)</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="30"
                  value={formData.expiryDays}
                  onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
                  className="h-11 bg-muted/40 border-border rounded-xl px-4 text-center text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-3 shadow-xs"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ticket className="h-4 w-4 mr-2" />}
              Activate Promotion
            </Button>
          </form>
        </div>

        {/* Live List */}
        <div className="xl:col-span-2 border border-border bg-card rounded-2xl p-0 overflow-hidden shadow-xs flex flex-col min-h-[500px]">
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
              Active Promotional List
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
              {coupons.length} {coupons.length === 1 ? 'campaign' : 'campaigns'}
            </span>
          </div>

          <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : coupons.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-center p-8">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-base text-foreground">No active campaigns</p>
                <p className="text-sm text-muted-foreground mt-1">Create a coupon code from the panel to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  return (
                    <div
                      key={coupon.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        isExpired 
                          ? 'bg-muted/40 border-border opacity-60' 
                          : 'bg-card border-border hover:border-primary/40 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono ${
                            isExpired ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                          }`}>
                            {coupon.code}
                          </span>
                          <span className="text-sm font-semibold ml-1 text-foreground">-{coupon.discountPercentage}% OFF</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{coupon.description}</p>
                        <p className="text-xs mt-1.5 font-mono text-muted-foreground">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <Button
                        onClick={() => setCouponToDelete(coupon)}
                        disabled={deletingId === coupon.id}
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete coupon ${coupon.code}`}
                        className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {couponToDelete && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Coupon?</h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Are you sure you want to delete <span className="text-destructive font-mono font-semibold">{couponToDelete.code}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-border"
                  onClick={() => setCouponToDelete(null)}
                  disabled={!!deletingId}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                >
                  {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                </Button>
              </div>
            </div>
            <button
              onClick={() => setCouponToDelete(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
