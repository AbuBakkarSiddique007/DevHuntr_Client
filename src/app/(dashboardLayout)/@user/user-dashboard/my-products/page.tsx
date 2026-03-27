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
  XCircle,
  Loader2
} from "lucide-react";
import { ProductService, Product } from "@/services/product/product.service";
import { TagService, Tag } from "@/services/tag/tag.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

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

  const fetchTags = async () => {
    try {
      const tags = await TagService.getTags();
      setAllTags(tags);
    } catch (err) {
      console.error("Failed to fetch tags", err);
    }
  };

  const handleDelete = async (id: string) => {
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

  const openExternalLink = (url: string | undefined | null) => {
    const href = (url ?? "").trim();
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    fetchMyProducts();
    fetchTags();
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

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
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
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-purple-400 transition-colors uppercase tracking-tight">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                          <Package className="h-3 w-3" /> {product.upvoteCount}
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
                          onClick={() => {
                            setEditingProduct(product);
                            setSelectedTagIds(product.tags?.map(t => t.tagId) || []);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteProduct(product)}
                          disabled={processingId === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg hover:bg-white/10 hover:text-blue-400"
                          onClick={() => openExternalLink(product.externalLink)}
                          disabled={!product.externalLink}
                        >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="w-full max-w-2xl bg-[#0d1117] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-white/5 bg-white/2">
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Edit Product</h2>
              <p className="text-xs mt-1 text-purple-400 font-bold uppercase tracking-widest opacity-80">Update your creation&apos;s digital identity</p>
            </div>

            <form
              className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const uuidRegex =
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

                const name = (formData.get("name") as string | null)?.trim() ?? "";

                const description = (formData.get("description") as string | null)?.trim() ?? "";
                const image = (formData.get("image") as string | null)?.trim() ?? "";

                const externalLinkRaw = (formData.get("externalLink") as string | null)?.trim() ?? "";
                const tagIds = (selectedTagIds || []).filter((id) => uuidRegex.test(id));

                const payload: {
                  name: string;
                  description: string;
                  image: string;
                  externalLink?: string;
                  tagIds?: string[];
                } = {
                  name,
                  description,
                  image,
                };

                if (externalLinkRaw) payload.externalLink = externalLinkRaw;

                if (tagIds.length) payload.tagIds = tagIds;

                setProcessingId(editingProduct.id);
                try {
                  await ProductService.updateProduct(editingProduct.id, payload);
                  toast.success("Product updated successfully");
                  // Refresh list
                  fetchMyProducts();
                  setEditingProduct(null);
                } catch (err) {
                  const error = err as Error;
                  toast.error(error.message || "Failed to update product");
                } finally {
                  setProcessingId(null);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Product Name</label>
                    <Input
                      name="name"
                      defaultValue={editingProduct.name}
                      className="rounded-2xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Thumbnail URL</label>
                    <Input
                      name="image"
                      defaultValue={editingProduct.image}
                      className="rounded-2xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">External Link</label>
                    <Input
                      name="externalLink"
                      defaultValue={editingProduct.externalLink}
                      className="rounded-2xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingProduct.description}
                      className="w-full min-h-[160px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* TAGS SELECTION */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Update Categories</label>
                <div className="flex flex-wrap gap-2 p-4 rounded-3xl bg-white/2 border border-white/5">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                        selectedTagIds.includes(tag.id)
                          ? "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/30"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processingId === editingProduct.id}
                  className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-2xl shadow-purple-500/30 transition-all"
                >
                  {processingId === editingProduct.id ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Evolution"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION (AlertDialog-style) */}
      {deleteProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            if (!processingId) setDeleteProduct(null);
          }}
        >
          <div
            className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="p-6 border-b border-white/5 bg-white/2">
              <h2 className="text-xl font-black tracking-tight text-foreground">Delete product?</h2>
              <p className="text-sm mt-2 text-muted-foreground">
                This action can’t be undone. This will permanently delete “{deleteProduct.name}”.
              </p>
            </div>

            <div className="p-6 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-2xl border-white/10"
                disabled={processingId === deleteProduct.id}
                onClick={() => setDeleteProduct(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-2xl font-bold"
                disabled={processingId === deleteProduct.id}
                onClick={async () => {
                  try {
                    await handleDelete(deleteProduct.id);
                    setDeleteProduct(null);
                  } catch {
                    // handleDelete already toasts
                  }
                }}
              >
                {processingId === deleteProduct.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

