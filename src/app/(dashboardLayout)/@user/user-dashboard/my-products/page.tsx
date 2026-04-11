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

  const openExternalLink = (url: string | undefined | null) => {
    const href = (url ?? "").trim();
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    fetchMyProducts();
    fetchTags();
  }, []);

  const getStatusBadge = (product: Product) => {
    switch (product.status) {
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">My Universe</h1>
          <p className="text-slate-500 dark:text-muted-foreground mt-2 text-lg md:text-xl">Manage and evolve your digital creations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search your products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 rounded-[1.25rem] border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-12 w-full focus:ring-purple-500/20 transition-all font-medium"
            />
          </div>
          <Button variant="outline" className="rounded-[1.25rem] border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-12 w-12 p-0 text-slate-700 dark:text-foreground hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl shadow-sm dark:shadow-none overflow-hidden group/table relative">
         <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-purple-500/5 blur-[80px] group-hover/table:bg-purple-500/10 transition-colors"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <th className="py-6 px-8">Product Entity</th>
                <th className="py-6 px-4 text-center">Metrics</th>
                <th className="py-6 px-4 text-center">Status</th>
                <th className="py-6 px-4 text-center">Feedback</th>
                <th className="py-6 px-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-8 px-8"><div className="h-12 w-48 bg-slate-100 dark:bg-white/5 rounded-xl" /></td>
                    <td className="py-8 px-4"><div className="h-12 w-24 bg-slate-100 dark:bg-white/5 rounded-xl mx-auto" /></td>
                    <td className="py-8 px-4"><div className="h-12 w-28 bg-slate-100 dark:bg-white/5 rounded-full mx-auto" /></td>
                    <td className="py-8 px-8"><div className="h-12 w-24 bg-slate-100 dark:bg-white/5 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group/row hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all duration-300">
                    <td className="py-8 px-8">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 shadow-md">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover group-hover/row:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 dark:text-white group-hover/row:text-purple-600 dark:group-hover/row:text-purple-400 transition-colors uppercase tracking-tight text-lg leading-none mb-2">{product.name}</p>
                          <p className="text-xs text-slate-400 dark:text-muted-foreground line-clamp-1 max-w-[280px] font-medium leading-relaxed">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-center">
                      <div className="inline-flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner group-hover/row:border-purple-200 dark:group-hover/row:border-purple-500/20 transition-colors">
                        <div className="flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400">
                          <Package className="h-3.5 w-3.5" /> {product.upvoteCount}
                        </div>
                        <div className="w-px h-3.5 bg-slate-300 dark:bg-white/20" />
                        <div className="text-[10px] font-black text-slate-500 dark:text-muted-foreground uppercase tracking-widest">{product.isFeatured ? "Elite" : "Standard"}</div>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(product)}
                      </div>
                    </td>
                    <td className="py-8 px-4 text-center">
                      {product.status === "REJECTED" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 px-4 rounded-xl bg-red-500/5 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-black uppercase tracking-[0.15em] border border-red-500/10 transition-all shadow-lg shadow-red-500/5"
                          onClick={() => setViewingReason(product)}
                        >
                          Review Feedback
                        </Button>
                      )}
                    </td>
                    <td className="py-8 px-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 border border-transparent hover:border-purple-500/20 transition-all"
                          onClick={() => {
                            setEditingProduct(product);
                            setSelectedTagIds(product.tags?.map(t => t.tagId) || []);
                          }}
                        >
                          <Edit3 className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
                          onClick={() => setDeleteProduct(product)}
                          disabled={processingId === product.id}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-blue-500/20 transition-all"
                          onClick={() => openExternalLink(product.externalLink)}
                          disabled={!product.externalLink}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center bg-slate-50/30 dark:bg-white/1">
                    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                      <div className="h-24 w-24 rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                         <Package className="h-12 w-12 text-slate-300 dark:text-muted-foreground/20" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No products found</p>
                        <p className="text-sm text-slate-500 dark:text-muted-foreground mt-2 leading-relaxed">The universe is expanding, and there&apos;s plenty of space for your next creation.</p>
                      </div>
                      <Link href="/user-dashboard/launch" className="w-full">
                        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-2xl shadow-purple-500/30 transition-all">
                          Launch Your App
                        </Button>
                      </Link>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 px-6">
          <div
            className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 md:p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                     <Edit3 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none mb-1">Evolve Entity</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none">Updating Identity of: {editingProduct.name}</p>
                  </div>
               </div>
            </div>

            <form
              className="p-8 md:p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar"
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
                  toast.success("Evolution successful");
                  fetchMyProducts();
                  setEditingProduct(null);
                } catch (error) {
                  toast.error("Process failed");
                  console.error(error);
                } finally {
                  setProcessingId(null);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] ml-1">Universal Name</label>
                    <Input
                      name="name"
                      defaultValue={editingProduct.name}
                      className="rounded-[1.25rem] border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-14 focus:ring-purple-500/20 text-base font-bold shadow-inner"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] ml-1">Visual Asset URL</label>
                    <Input
                      name="image"
                      defaultValue={editingProduct.image}
                      className="rounded-[1.25rem] border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-14 focus:ring-purple-500/20 text-sm font-medium shadow-inner"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] ml-1">Gateway Link</label>
                    <Input
                      name="externalLink"
                      defaultValue={editingProduct.externalLink}
                      className="rounded-[1.25rem] border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-14 focus:ring-purple-500/20 text-sm font-medium shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] ml-1">Detailed Logbook</label>
                   <textarea
                     name="description"
                     defaultValue={editingProduct.description}
                     className="w-full min-h-[220px] rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 text-sm md:text-base text-slate-900 dark:text-foreground focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all resize-none shadow-inner leading-relaxed"
                     required
                   />
                </div>
              </div>

              {/* TAGS SELECTION */}
              <div className="space-y-6 pt-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] ml-1">Classification Labels</label>
                <div className="flex flex-wrap gap-2.5 p-6 rounded-[2rem] bg-slate-50/50 dark:bg-white/2 border border-slate-100 dark:border-white/5 shadow-inner">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        selectedTagIds.includes(tag.id)
                          ? "bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/30 scale-105"
                          : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10"
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-10">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:flex-1 rounded-2xl h-16 font-black uppercase tracking-widest text-slate-500 dark:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel Evolve
                </Button>
                <Button
                  type="submit"
                  disabled={processingId === editingProduct.id}
                  className="w-full sm:flex-1 rounded-2xl h-16 font-black uppercase tracking-widest bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-2xl shadow-purple-500/40 transition-all active:scale-95"
                >
                  {processingId === editingProduct.id ? <Loader2 className="h-6 w-6 animate-spin" /> : "Finalize Evolution"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => {
            if (!processingId) setDeleteProduct(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 text-center">
               <div className="h-20 w-20 rounded-[1.75rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                   <Trash2 className="h-10 w-10 text-red-500" />
               </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Delete product?</h2>
              <p className="text-sm mt-3 text-slate-500 dark:text-muted-foreground leading-relaxed">
                This process is irreversible. The digital footprint of <span className="text-red-500 font-bold">“{deleteProduct.name}”</span> will be forever erased.
              </p>
            </div>

            <div className="p-10 flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:flex-1 rounded-2xl h-14 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-foreground font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                disabled={processingId === deleteProduct.id}
                onClick={() => setDeleteProduct(null)}
              >
                Hold On
              </Button>
              <Button
                type="button"
                className="w-full sm:flex-1 rounded-2xl h-14 font-black uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/25 transition-all active:scale-95"
                disabled={processingId === deleteProduct.id}
                onClick={async () => {
                  try {
                    await handleDelete(deleteProduct.id);
                    setDeleteProduct(null);
                  } catch {}
                }}
              >
                {processingId === deleteProduct.id ? <Loader2 className="h-5 w-5 animate-spin" /> : "Erase Entity"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {viewingReason && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 text-center"
          onClick={() => setViewingReason(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-red-500/20 rounded-[3rem] shadow-2xl shadow-red-500/10 overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-red-500/20 bg-red-50/50 dark:bg-red-500/5 items-center flex flex-col gap-6">
              <div className="h-20 w-20 rounded-[1.75rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/5">
                 <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">Moderation Logic</h2>
                <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] leading-none mt-3">
                   Subject: {viewingReason.name}
                </p>
              </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.25em] block">
                   Official Evaluator Note
                </label>
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-foreground leading-relaxed italic shadow-inner">
                  &quot;{viewingReason.rejectionReason || "No specific logic provided by evaluation team."}&quot;
                </div>
              </div>

              <div className="space-y-4 px-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60"> Protocol Implications </p>
                 <p className="text-xs text-slate-500 dark:text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Rejected entities are archived. They remain visible to you but are shielded from the public directory.
                 </p>
              </div>

              <Button
                className="w-full rounded-[1.5rem] h-16 font-black uppercase tracking-widest bg-slate-900 dark:bg-white/5 hover:bg-slate-800 dark:hover:bg-white/10 text-white dark:text-white transition-all shadow-xl shadow-black/10 active:scale-95"
                onClick={() => setViewingReason(null)}
              >
                Acknowledge & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

