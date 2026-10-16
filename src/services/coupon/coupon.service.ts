import { safeFetch } from "@/lib/api.utils";

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
    return safeFetch<Coupon[]>(
      `${API_BASE}/coupons`,
      {
        method: "GET",
        credentials: "include",
      },
      []
    );
  },

  createCoupon: async (payload: CreateCouponInput): Promise<Coupon> => {
    return safeFetch<Coupon>(`${API_BASE}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await safeFetch(`${API_BASE}/coupons/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
