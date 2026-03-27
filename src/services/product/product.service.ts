const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Tag {
  id: string;
  name: string;
}

export interface ProductTag {
  id: string;
  tagId: string;
  productId: string;
  tag: Tag;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  externalLink?: string;
  upvoteCount: number;
  downvoteCount: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  isFeatured: boolean;
  tags?: ProductTag[];
}

export const ProductService = {

  getProducts: async ({ page = 1, limit = 10, search = "", tag = "" } = {}) => {
    let url = `${API_BASE}/products?page=${page}&limit=${limit}`;

    if (search) url += `&search=${encodeURIComponent(search)}`;

    if (tag) url += `&tag=${encodeURIComponent(tag)}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();
  },


  getProductById: async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  getFeaturedProducts: async () => {
    const res = await fetch(`${API_BASE}/products/featured`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  getTrendingProducts: async () => {
    const res = await fetch(`${API_BASE}/products/trending`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();

  },

  createProduct: async (payload: {
    name: string;
    image: string;
    description: string;
    externalLink: string;
    tagIds?: string[];
  }) => {
    const res = await fetch(`${API_BASE}/products`, {
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

    return res.json();
  },

  getMyProducts: async ({ page = 1, limit = 10 } = {}) => {
    const res = await fetch(`${API_BASE}/products/my-products?page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    return res.json();
  },

  getQueueProducts: async ({ page = 1, limit = 10 } = {}) => {
    const res = await fetch(`${API_BASE}/products/queue?page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    return res.json();
  },

  getModerationProducts: async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status: "ACCEPTED" | "REJECTED" }) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status,
    });

    const res = await fetch(`${API_BASE}/products/moderation?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    return res.json();
  },

  updateProduct: async (id: string, payload: Partial<{
    name: string;
    image: string;
    description: string;
    externalLink: string;
    tagIds: string[];
  }>) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PATCH",
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

    return res.json();
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  updateProductStatus: async (id: string, status: "ACCEPTED" | "REJECTED", rejectionReason?: string) => {
    const res = await fetch(`${API_BASE}/products/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status, rejectionReason }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  toggleFeatured: async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}/feature`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
};
