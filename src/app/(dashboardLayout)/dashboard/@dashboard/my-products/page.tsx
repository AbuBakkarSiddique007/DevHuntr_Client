"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  Filter,
  ExternalLink,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { ProductService, Product } from "@/services/product/product.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchMyProducts = async () => {
    try {
      const res = await ProductService.getMyProducts();

      const data = res.data?.products || res.products || res;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load your products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setProcessingId(id);
    try {
      await ProductService.deleteProduct(id);
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
            <CheckCircle2 className="h-3 w-3" /> Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Products</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage and track the status of your submissions.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-white/10 bg-white/5 h-10 w-full"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-10 w-10 p-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                <th className="py-5 px-6">Product</th>
                <th className="py-5 px-4 text-center">Engagement</th>
                <th className="py-5 px-4 text-center">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-6 px-6"><div className="h-10 w-40 bg-white/5 rounded-lg" /></td>
                    <td className="py-6 px-4"><div className="h-10 w-20 bg-white/5 rounded-lg mx-auto" /></td>
                    <td className="py-6 px-4"><div className="h-10 w-24 bg-white/5 rounded-full mx-auto" /></td>
                    <td className="py-6 px-6"><div className="h-10 w-20 bg-white/5 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/2 transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 overflow-hidden shrink-0">
                          <Image src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-purple-400 transition-colors">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                          <Edit3 className="h-3 w-3" /> {product.upvoteCount}
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">{product.isFeatured ? "Featured" : "Regular"}</div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(product.status)}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg hover:bg-white/10 hover:text-purple-400"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
                          disabled={processingId === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:bg-white/10 hover:text-blue-400">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="h-12 w-12 text-muted-foreground/20" />
                      <div>
                        <p className="text-lg font-bold text-muted-foreground">No products found</p>
                        <p className="text-sm text-muted-foreground/60">Success favors the persistent. Launch your first app!</p>
                      </div>
                      <Button className="mt-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                        Get Started
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-lg bg-gray-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold uppercase tracking-tight">Edit Product</h2>
              <p className="text-[10px] mt-1 text-purple-400 font-bold uppercase tracking-widest">Update your creation&apos;s details</p>
            </div>

            <form
              className="p-6 space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  externalLink: formData.get("externalLink") as string,
                };

                setProcessingId(editingProduct.id);
                try {
                  await ProductService.updateProduct(editingProduct.id, payload);
                  toast.success("Product updated successfully");
                  setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
                  setEditingProduct(null);
                } catch (err) {
                  toast.error("Failed to update product");
                  console.error(err);
                } finally {
                  setProcessingId(null);
                }
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Product Name</label>
                  <Input
                    name="name"
                    defaultValue={editingProduct.name}
                    className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct.description}
                    className="w-full min-h-[120px] rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">External Link</label>
                  <Input
                    name="externalLink"
                    defaultValue={editingProduct.externalLink}
                    className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-xl h-12 font-bold hover:bg-white/5"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-12 font-bold bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-purple-500/20"
                  disabled={processingId === editingProduct.id}
                >
                  {processingId === editingProduct.id ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
