const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const PaymentService = {
  createCheckoutSession: async (payload: {
    successUrl: string;
    cancelUrl: string;
    productId?: string;
  }) => {
    const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    return res.json();
  },
};
