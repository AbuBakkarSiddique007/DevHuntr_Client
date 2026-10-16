"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  XCircle,
  Loader2,
  X
} from "lucide-react";
import { ProductService, Product } from "@/services/product/product.service";
import { TagService, Tag } from "@/services/tag/tag.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
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
  const [viewingReason, setViewingReason] = useState<Product | null>(null);

  const fetchMyProducts = async () => {
    try {
      const res = await ProductService.getMyProducts();
      const r = res as unknown as { data?: { products?: Product[] }; products?: Product[] };
      const data = r?.data?.products || r?.products || res.products;
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

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
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

  const filteredProducts = products.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage, update, and monitor your submitted products.</p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search your products"
              placeholder="Filter by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl bg-card border-border"
            />
          </div>
          <Link href="/user-dashboard/launch">
            <Button size="sm" className="h-9 rounded-xl text-xs font-semibold">
              Add New
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Mobile card list — visible below md */}
        <div className="md:hidden divide-y divide-border">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-muted shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-48 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl bg-muted border border-border overflow-hidden shrink-0 shadow-xs">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{product.description || "No description"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={product.status || "PENDING"} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {product.upvoteCount || 0} upvotes · {product.pricingType || "FREE"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.status === "REJECTED" && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-destructive hover:bg-destructive/10 text-xs font-medium h-8"
                        onClick={() => setViewingReason(product)}
                      >
                        Feedback
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit product"
                      className="hover:text-primary h-8 w-8"
                      onClick={() => {
                        setEditingProduct(product);
                        setSelectedTagIds(product.tags?.map(t => t.tagId) || []);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete product"
                      className="hover:text-destructive h-8 w-8"
                      onClick={() => setDeleteProduct(product)}
                      disabled={processingId === product.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {product.externalLink && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Visit external link"
                        className="hover:text-primary h-8 w-8"
                        onClick={() => openExternalLink(product.externalLink)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-semibold text-foreground text-sm">No products found</p>
              <p className="text-xs text-muted-foreground mt-1">Submit your first application to see it listed here.</p>
            </div>
          )}
        </div>

        {/* Desktop table — visible md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
                <th className="py-3 px-4 sm:px-6">Product</th>
                <th className="py-3 px-4 text-center">Engagement</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Notes</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-10 w-44 bg-muted rounded-xl" /></td>
                    <td className="py-4 px-4"><div className="h-8 w-20 bg-muted rounded-lg mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-muted rounded-full mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-16 bg-muted rounded-lg mx-auto" /></td>
                    <td className="py-4 px-6"><div className="h-8 w-20 bg-muted rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-muted border border-border overflow-hidden shrink-0 shadow-xs">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">{product.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted text-xs font-semibold text-foreground">
                        <Package className="h-3.5 w-3.5 text-primary" /> {product.upvoteCount || 0}
                        <span className="text-muted-foreground font-normal">• {product.pricingType || "FREE"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={product.status || "PENDING"} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      {product.status === "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-destructive hover:bg-destructive/10 text-xs font-medium"
                          onClick={() => setViewingReason(product)}
                        >
                          View Feedback
                        </Button>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit product"
                          className="hover:text-primary"
                          onClick={() => {
                            setEditingProduct(product);
                            setSelectedTagIds(product.tags?.map(t => t.tagId) || []);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete product"
                          className="hover:text-destructive"
                          onClick={() => setDeleteProduct(product)}
                          disabled={processingId === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {product.externalLink && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Visit external link"
                            className="hover:text-primary"
                            onClick={() => openExternalLink(product.externalLink)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-semibold text-foreground text-sm">No products found</p>
                    <p className="text-xs text-muted-foreground mt-1">Submit your first application to see it listed here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Edit Product</h2>
                <p className="text-xs text-muted-foreground">Update details for {editingProduct.name}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                aria-label="Close edit modal"
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
                } = { name, description, image };
                if (externalLinkRaw) payload.externalLink = externalLinkRaw;
                if (tagIds.length) payload.tagIds = tagIds;

                setProcessingId(editingProduct.id);
                try {
                  await ProductService.updateProduct(editingProduct.id, payload);
                  toast.success("Product updated successfully");
                  fetchMyProducts();
                  setEditingProduct(null);
                } catch (error) {
                  toast.error("Failed to update product");
                  console.error(error);
                } finally {
                  setProcessingId(null);
                }
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Product Name</label>
                  <Input
                    name="name"
                    defaultValue={editingProduct.name}
                    className="h-9 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Icon / Image URL</label>
                  <Input
                    name="image"
                    defaultValue={editingProduct.image}
                    className="h-9 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Website / External Link</label>
                <Input
                  name="externalLink"
                  defaultValue={editingProduct.externalLink}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <Textarea
                  name="description"
                  defaultValue={editingProduct.description}
                  className="min-h-[100px] text-sm resize-none"
                  required
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-foreground">Categories</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-muted/40 border border-border max-h-36 overflow-y-auto custom-scrollbar">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors",
                        selectedTagIds.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:bg-muted"
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processingId === editingProduct.id}
                  className="rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  {processingId === editingProduct.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteProduct && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => { if (!processingId) setDeleteProduct(null); }}
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Delete product?</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-foreground">&ldquo;{deleteProduct.name}&rdquo;</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                disabled={processingId === deleteProduct.id}
                onClick={() => setDeleteProduct(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 font-semibold"
                disabled={processingId === deleteProduct.id}
                onClick={async () => {
                  try {
                    await handleDelete(deleteProduct.id);
                    setDeleteProduct(null);
                  } catch {}
                }}
              >
                {processingId === deleteProduct.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {viewingReason && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setViewingReason(null)}
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Moderator Feedback</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Product: {viewingReason.name}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs text-foreground/90 text-left leading-relaxed italic">
              &ldquo;{viewingReason.rejectionReason || "No specific feedback note was provided by the moderation team."}&rdquo;
            </div>

            <Button
              className="w-full rounded-xl"
              onClick={() => setViewingReason(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
