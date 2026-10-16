import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface CheckoutSessionPayload {
  successUrl: string;
  cancelUrl: string;
  productId?: string;
}

export interface CheckoutSessionResponse {
  url?: string;
  sessionId?: string;
}

export const PaymentService = {
  createCheckoutSession: async (payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> => {
    return safeFetch<CheckoutSessionResponse>(`${API_BASE}/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  },
};
