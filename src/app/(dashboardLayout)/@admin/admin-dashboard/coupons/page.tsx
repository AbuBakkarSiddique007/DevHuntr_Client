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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Ticket className="h-8 w-8 text-blue-400" />
          Discount Coupons
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Create entirely configurable discount codes for platform monetization.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="xl:col-span-1 border border-white/5 bg-white/2 rounded-[2rem] p-6 h-fit backdrop-blur-xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" /> Generate New Coupon
          </h3>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Coupon Code</label>
              <Input
                placeholder="e.g. LAUNCH100"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                pattern="[A-Za-z0-9\-_]+"
                title="Letters, numbers, underscores and hyphens only"
                className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-mono uppercase text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Description</label>
              <Input
                placeholder="e.g. 50% Off First Product"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Discount %</label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="25"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 rounded-xl px-4 pl-8"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Valid For (Days)</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="30"
                  value={formData.expiryDays}
                  onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-center"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold mt-4 shadow-lg shadow-blue-500/20"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ticket className="h-4 w-4 mr-2" />}
              Activate Promotion
            </Button>
          </form>
        </div>

        {/* Live List */}
        <div className="xl:col-span-2 border border-white/5 bg-white/2 rounded-[2rem] p-0 overflow-hidden backdrop-blur-xl flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold text-lg flex items-center gap-2">
              Active Promotional List <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{coupons.length}</span>
            </h3>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : coupons.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-center opacity-60">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-bold text-lg">No active campaigns</p>
                <p className="text-sm">Create a coupon code from the panel to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  return (
                    <div
                      key={coupon.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isExpired ? 'bg-white/5 border-white/5 opacity-50' : 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10'}`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded textxs font-black uppercase tracking-widest ${isExpired ? 'bg-white/10 text-white/50' : 'bg-blue-500 text-white'}`}>
                            {coupon.code}
                          </span>
                          <span className="text-sm font-bold ml-2">-{coupon.discountPercentage}% OFF</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{coupon.description}</p>
                        <p className="text-[10px] mt-2 font-mono text-muted-foreground">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <Button
                        onClick={() => setCouponToDelete(coupon)}
                        disabled={deletingId === coupon.id}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Delete Coupon?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete <span className="text-red-400 font-mono font-bold">{couponToDelete.code}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-white/10"
                  onClick={() => setCouponToDelete(null)}
                  disabled={!!deletingId}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                >
                  {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Now"}
                </Button>
              </div>
            </div>
            <button
              onClick={() => setCouponToDelete(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
