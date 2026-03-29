const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  expiryDate: string;
  discountPercentage: number;
}

export type CreateCouponInput = Omit<Coupon, 'id'>;

export const CouponService = {
  getCoupons: async (): Promise<Coupon[]> => {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    const result = await res.json();
    return result.data || result;
  },

  createCoupon: async (payload: CreateCouponInput): Promise<Coupon> => {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    const result = await res.json();
    return result.data || result;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
  },
};
