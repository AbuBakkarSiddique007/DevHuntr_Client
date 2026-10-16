"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductService, Product, ProductTag } from "@/services/product/product.service";
import { CommentService, Comment } from "@/services/comment/comment.service";
import { VoteService, VoteType } from "@/services/vote/vote.service";
import { ReportService } from "@/services/report/report.service";
import { PaymentService } from "@/services/payment/payment.service";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ExternalLink, Ghost, MessageSquare, ShieldAlert,
  ChevronUp, ChevronDown, Loader2, Send, X, User as UserIcon, Mail,
  Crown, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function ReportModal({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await ReportService.submitReport(productId, reason.trim());
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <ShieldAlert className="h-5 w-5 text-destructive" /> Report Product
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-base">Report submitted successfully</p>
            <p className="text-muted-foreground text-xs">Our moderators will review this product shortly.</p>
            <Button onClick={onClose} variant="outline" className="mt-4 rounded-xl">Close</Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              Describe the issue with this product so moderators can review and take appropriate action.
            </p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., This product is spam, misleading, or violates guidelines..."
              className="min-h-[110px] bg-muted/50 border-border rounded-xl resize-none focus-visible:ring-primary/30 mb-4 text-foreground text-sm"
            />
            <div className="flex gap-2.5">
              <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason.trim() || submitting}
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 font-semibold"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Report"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SubscriptionModal({ productName, onClose }: { productName: string; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const origin = window.location.origin;
      const result = await PaymentService.createCheckoutSession({
        successUrl: `${origin}/payment/success`,
        cancelUrl: `${origin}/payment/cancel`,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 text-center relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Lock className="h-8 w-8 text-amber-500" />
        </div>

        <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <Crown className="h-3 w-3" /> Premium Content
        </div>

        <h2 className="text-xl font-bold mt-2 mb-2 text-foreground">
          Unlock &ldquo;{productName}&rdquo;
        </h2>
        <p className="text-muted-foreground text-xs mb-6 leading-relaxed">
          This is a premium product. Get <span className="text-amber-600 dark:text-amber-400 font-semibold">lifetime access</span> to all premium products on DevHuntr for a one-time payment.
        </p>

        <div className="rounded-xl bg-muted/60 border border-border p-4 mb-5">
          <p className="text-3xl font-bold text-foreground">$50</p>
          <p className="text-xs text-muted-foreground mt-1">One-time · Lifetime Access · All Premium Products</p>
        </div>
 
        <Button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-xl h-11 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-all shadow-md shadow-amber-500/20"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : user ? (
            <span className="flex items-center gap-1.5">
              <Crown className="h-4 w-4" /> Unlock for $50
            </span>
          ) : (
            "Log in to Subscribe"
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-3">
          Secured by <span className="text-foreground font-semibold">Stripe</span>. One-time payment.
        </p>
      </div>
    </div>
  );
}

function VotingPanel({ product, onVote }: {
  product: Product;
  onVote: (delta: { up: number; down: number }) => void;
}) {
  const { user } = useAuth();
  const [myVote, setMyVote] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const net = (product.upvoteCount || 0) - (product.downvoteCount || 0);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    VoteService.checkVote(product.id)
      .then((res) => setMyVote(res.voteType ?? null))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [product.id, user]);

  const handleVote = async (type: VoteType) => {
    if (!user || voting) return;
    const prev = myVote;
    setVoting(true);

    const newVote = prev === type ? null : type;
    setMyVote(newVote);

    try {
      const upDelta = (newVote === "UPVOTE" ? 1 : 0) - (prev === "UPVOTE" ? 1 : 0);
      const downDelta = (newVote === "DOWNVOTE" ? 1 : 0) - (prev === "DOWNVOTE" ? 1 : 0);
      onVote({ up: upDelta, down: downDelta });
      await VoteService.castVote(product.id, type);
    } catch {
      setMyVote(prev);
      const upDelta = (prev === "UPVOTE" ? 1 : 0) - (newVote === "UPVOTE" ? 1 : 0);
      const downDelta = (prev === "DOWNVOTE" ? 1 : 0) - (newVote === "DOWNVOTE" ? 1 : 0);
      onVote({ up: upDelta, down: downDelta });
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-2xl text-center space-y-3 shadow-xs border border-border relative overflow-hidden">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net Community Score</p>
      <div className={`text-5xl font-bold tracking-tight tabular-nums ${net > 0 ? "text-emerald-600 dark:text-emerald-400" : net < 0 ? "text-rose-500 dark:text-red-400" : "text-muted-foreground"}`}>
        {net > 0 ? "+" : ""}{net}
      </div>
      <div className="flex gap-2.5 justify-center pt-1">
        <button
          onClick={() => handleVote("UPVOTE")}
          disabled={!user || loading || voting}
          aria-label="Upvote product"
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            myVote === "UPVOTE"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-muted/60 border-border text-foreground hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          <ChevronUp className="h-4 w-4" /> {product.upvoteCount ?? 0}
        </button>
        <button
          onClick={() => handleVote("DOWNVOTE")}
          disabled={!user || loading || voting}
          aria-label="Downvote product"
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            myVote === "DOWNVOTE"
              ? "bg-destructive text-destructive-foreground border-destructive shadow-sm"
              : "bg-muted/60 border-border text-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
          }`}
        >
          <ChevronDown className="h-4 w-4" /> {product.downvoteCount ?? 0}
        </button>
      </div>
      {!user && (
        <p className="text-xs text-muted-foreground pt-1">
          <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link> to vote
        </p>
      )}
    </div>
  );
}

function CommentsSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const data = await CommentService.getComments(productId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handlePost = async () => {
    if (!text.trim() || !user || posting) return;
    setPosting(true);
    try {
      const res = await CommentService.postComment(productId, text.trim());
      const newComment: Comment = res.data ?? {
        id: res.id ?? crypto.randomUUID(),
        description: res.description ?? text.trim(),
        createdAt: res.createdAt ?? new Date().toISOString(),
        author: res.author ?? {
          id: user?.id ?? "",
          name: user?.name ?? "You",
          photoUrl: user?.photoUrl,
        },
      };
      setComments((prev) => [newComment, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-card p-6 md:p-8 rounded-2xl space-y-8 border border-border shadow-xs">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3 text-foreground">
        <MessageSquare className="h-6 w-6 text-primary" />
        Discussion
        <span className="text-sm font-semibold text-muted-foreground">({comments.length})</span>
      </h2>

      {user ? (
        <div className="flex gap-3 items-start">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-border overflow-hidden">
            {user.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={user.name || "User"}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
              placeholder="Share your feedback or questions..."
              className="flex-1 min-h-[42px] max-h-[160px] bg-muted/50 border-border rounded-xl resize-none text-sm focus-visible:ring-primary/30 text-foreground"
            />
            <Button
              onClick={handlePost}
              disabled={!text.trim() || posting}
              size="icon"
              className="shrink-0 h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90"
            >
              {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground bg-muted/60 px-4 py-3 rounded-xl border border-border">
          <Link href="/login" className="text-primary hover:underline font-semibold">Log in</Link> to join the discussion.
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-24 bg-muted rounded-full" />
                <div className="h-3 w-full bg-muted rounded-full" />
                <div className="h-3 w-3/4 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-6 text-sm">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4 divide-y divide-border">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 pt-4 first:pt-0">
              <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
                {c.author?.photoUrl ? (
                  <Image
                    src={c.author.photoUrl}
                    alt={c.author.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground">{c.author?.name ?? "Anonymous"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleVoteDelta = (delta: { up: number; down: number }) => {
    setProduct((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        upvoteCount: (prev.upvoteCount || 0) + delta.up,
        downvoteCount: (prev.downvoteCount || 0) + delta.down,
      };
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[calc(100vh-100px)]">
        <div className="skeleton h-80 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 skeleton h-96 rounded-2xl" />
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <Ghost className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-foreground">Product Not Found</h1>
        <p className="text-muted-foreground mb-6 text-sm">The product you are looking for does not exist or was removed.</p>
        <Link href="/products">
          <Button variant="outline" className="rounded-xl">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  if (product.isLocked) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        {showSubscription && (
          <SubscriptionModal
            productName={product.name}
            onClose={() => setShowSubscription(false)}
          />
        )}

        {product.image && (
          <div className="relative mx-auto mb-6 w-fit">
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className="h-24 w-24 rounded-2xl object-cover border border-amber-500/20 shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
            </div>
          </div>
        )}

        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <Crown className="h-3 w-3" /> Premium Product
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">{product.name}</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm leading-relaxed">
          This is an exclusive premium product. Subscribe to get lifetime access to all premium tools on DevHuntr.
        </p>

        <Button
          onClick={() => setShowSubscription(true)}
          className="rounded-xl h-12 px-7 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/20 transition-all"
        >
          <Crown className="mr-2 h-4 w-4" /> Unlock for $50 Lifetime
        </Button>

        <div className="mt-6">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 min-h-[calc(100vh-100px)]">
      {showReport && <ReportModal productId={product.id} onClose={() => setShowReport(false)} />}
      {showSubscription && (
        <SubscriptionModal
          productName={product.name}
          onClose={() => setShowSubscription(false)}
        />
      )}

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card p-6 md:p-10 mb-8 shadow-xs border border-border group">
        <Link href="/products" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-muted/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group">
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Explore
        </Link>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={160}
                height={160}
                className="h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover shadow-sm border border-border"
              />
            ) : (
              <div className="h-28 w-28 md:h-36 md:w-36 rounded-2xl bg-primary/10 flex items-center justify-center border border-border shadow-sm">
                <Ghost className="h-12 w-12 text-primary" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
              {product.externalLink && (
                <a href={product.externalLink} target="_blank" rel="noreferrer">
                  <Button className="rounded-xl h-10 px-5 bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium shadow-sm">
                    Visit App <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {product.tags?.map((tagObj: ProductTag) => (
                <span key={tagObj.id} className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
                  #{tagObj.tag?.name || (tagObj as unknown as { name: string }).name}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">About this product</h2>
              <p className="text-foreground/90 text-base leading-relaxed max-w-3xl">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Discussion and Maker/Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CommentsSection productId={product.id} />
        </div>

        <div className="space-y-6">
          {/* Maker Card */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs space-y-4 relative overflow-hidden">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Meet the Maker</h3>
            <div className="flex items-center gap-3.5">
              {product.owner?.photoUrl ? (
                <Image
                  src={product.owner.photoUrl}
                  alt={product.owner.name || "Maker"}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover border border-border shadow-xs shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border shadow-xs shrink-0">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground truncate">{product.owner?.name || "Anonymous Maker"}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{product.owner?.email || "No email provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voting panel */}
          <VotingPanel product={product} onVote={handleVoteDelta} />

          {/* Report Button */}
          <button
            onClick={() => setShowReport(true)}
            className="w-full bg-card hover:bg-destructive/10 p-4 rounded-xl flex items-center justify-between group cursor-pointer border border-border hover:border-destructive/30 transition-colors"
          >
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-destructive transition-colors uppercase tracking-wider">
              Report Product
            </span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
