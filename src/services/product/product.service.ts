import { safeFetch } from "@/lib/api.utils";

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
  pricingType: "FREE" | "PREMIUM";
  isFeatured: boolean;
  isLocked?: boolean;
  tags?: ProductTag[];
  rejectionReason?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
  };
}

export interface ProductListResponse {
  products: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const ProductService = {
  getProducts: async ({ page = 1, limit = 10, search = "", tag = "", pricingType = "" } = {}) => {
    let url = `${API_BASE}/products?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    if (pricingType) url += `&pricingType=${encodeURIComponent(pricingType)}`;

    return safeFetch(url, { method: "GET", credentials: "include" }, {
      products: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
    });
  },

  getProductById: async (id: string): Promise<Product> => {
    return safeFetch(`${API_BASE}/products/${id}`, { method: "GET", credentials: "include" });
  },

  getFeaturedProducts: async ({ page = 1, limit = 10 } = {}): Promise<ProductListResponse> => {
    return safeFetch(`${API_BASE}/products/featured?page=${page}&limit=${limit}`,
      { method: "GET", credentials: "include" },
      { products: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
  },

  getTrendingProducts: async () => {
    return safeFetch(`${API_BASE}/products/trending`,
      { method: "GET", credentials: "include" },
      []
    );
  },

  createProduct: async (payload: {
    name: string;
    image: string;
    description: string;
    externalLink: string;
    tagIds?: string[];
    pricingType?: "FREE" | "PREMIUM";
  }) => {
    return safeFetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
  },

  getMyProducts: async ({ page = 1, limit = 10 } = {}): Promise<ProductListResponse> => {
    return safeFetch(`${API_BASE}/products/my-products?page=${page}&limit=${limit}`,
      { method: "GET", credentials: "include" },
      { products: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
  },

  getQueueProducts: async ({ page = 1, limit = 10 } = {}): Promise<ProductListResponse> => {
    return safeFetch(`${API_BASE}/products/queue?page=${page}&limit=${limit}`,
      { method: "GET", credentials: "include" },
      { products: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
  },

  getModerationProducts: async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status: "ACCEPTED" | "REJECTED" | "PENDING" }): Promise<ProductListResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), status });
    return safeFetch(`${API_BASE}/products/moderation?${params.toString()}`,
      { method: "GET", credentials: "include" },
      { products: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
  },

  updateProduct: async (id: string, payload: Partial<{
    name: string;
    image: string;
    description: string;
    externalLink: string;
    tagIds: string[];
    pricingType: "FREE" | "PREMIUM";
  }>) => {
    return safeFetch(`${API_BASE}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
  },

  deleteProduct: async (id: string) => {
    return safeFetch(`${API_BASE}/products/${id}`, { method: "DELETE", credentials: "include" });
  },

  updateProductStatus: async (id: string, status: "ACCEPTED" | "REJECTED", rejectionReason?: string) => {
    return safeFetch(`${API_BASE}/products/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status, rejectionReason }),
    });
  },

  toggleFeatured: async (id: string) => {
    return safeFetch(`${API_BASE}/products/${id}/feature`, {
      method: "PATCH",
      credentials: "include",
    });
  },
};
