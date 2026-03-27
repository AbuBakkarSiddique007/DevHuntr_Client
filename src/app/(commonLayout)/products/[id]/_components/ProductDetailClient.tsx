"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductService, Product, ProductTag } from "@/services/product/product.service";
import { CommentService, Comment } from "@/services/comment/comment.service";
import { VoteService, VoteType } from "@/services/vote/vote.service";
import { ReportService } from "@/services/report/report.service";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ExternalLink, Ghost, MessageSquare, ShieldAlert,
  ChevronUp, ChevronDown, Loader2, Send, X, User as UserIcon, Mail
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0d12] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-400" /> Report Product
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-green-400 font-bold text-lg">Report submitted ✓</p>
            <p className="text-muted-foreground text-sm">Our moderators will review this shortly.</p>
            <Button onClick={onClose} variant="outline" className="mt-4 rounded-xl border-white/10">Close</Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Describe the issue with this product. Be specific so moderators can act quickly.
            </p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., This product is spam / contains misleading information..."
              className="min-h-[120px] bg-white/5 border-white/10 rounded-xl resize-none focus-visible:ring-red-500/50 mb-4"
            />
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl border-white/10">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason.trim() || submitting}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
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

function VotingPanel({ product, onVote }: {
  product: Product;
  onVote: (delta: { up: number; down: number }) => void;
}) {
  const { user } = useAuth();
  const [myVote, setMyVote] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const net = product.upvoteCount - product.downvoteCount;

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

      // update: optimistic update
      onVote({ up: upDelta, down: downDelta });

      await VoteService.castVote(product.id, type);
    } catch {
      // update: revert if failed
      setMyVote(prev);
      const upDelta = (prev === "UPVOTE" ? 1 : 0) - (newVote === "UPVOTE" ? 1 : 0);

      const downDelta = (prev === "DOWNVOTE" ? 1 : 0) - (newVote === "DOWNVOTE" ? 1 : 0);

      onVote({ up: upDelta, down: downDelta });
      
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="glass p-6 rounded-3xl text-center space-y-4 shadow-xl border border-white/5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Net Score</p>
      <div className={`text-6xl font-black tabular-nums ${net > 0 ? "text-green-400" : net < 0 ? "text-red-400" : "text-white/40"}`}>
        {net > 0 ? "+" : ""}{net}
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleVote("UPVOTE")}
          disabled={!user || loading || voting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all duration-200 ${myVote === "UPVOTE"
            ? "bg-green-500/20 border-green-500/40 text-green-400"
            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400"
            }`}
        >
          <ChevronUp className="h-4 w-4" /> {product.upvoteCount}
        </button>
        <button
          onClick={() => handleVote("DOWNVOTE")}
          disabled={!user || loading || voting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all duration-200 ${myVote === "DOWNVOTE"
            ? "bg-red-500/20 border-red-500/40 text-red-400"
            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            }`}
        >
          <ChevronDown className="h-4 w-4" /> {product.downvoteCount}
        </button>
      </div>
      {!user && (
        <p className="text-xs text-muted-foreground">
          <Link href="/login" className="text-purple-400 hover:underline">Log in</Link> to vote
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
      const newComment: Comment = res.data || res;
      setComments((prev) => [newComment, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2rem] space-y-6">
      <h3 className="text-2xl font-bold flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-purple-400" />
        Discussion
        <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
      </h3>

      {user ? (
        <div className="flex gap-3 items-start">
          <div className="h-9 w-9 shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center border border-white/10">
            {user.photoUrl
              ? (
                <Image
                  src={user.photoUrl}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="h-full w-full rounded-full object-cover"
                />
              )
              : <UserIcon className="h-4 w-4 text-purple-400" />}
          </div>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
              placeholder="Share your thoughts..."
              className="flex-1 min-h-[44px] max-h-[200px] bg-white/5 border-white/10 rounded-2xl resize-none text-sm focus-visible:ring-purple-500/50"
            />
            <Button
              onClick={handlePost}
              disabled={!text.trim() || posting}
              size="icon"
              className="shrink-0 h-11 w-11 rounded-2xl bg-purple-600 hover:bg-purple-700"
            >
              {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
          <Link href="/login" className="text-purple-400 hover:underline font-semibold">Log in</Link> to join the discussion.
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-white/5 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-24 bg-white/5 rounded-full" />
                <div className="h-3 w-full bg-white/5 rounded-full" />
                <div className="h-3 w-3/4 bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 text-sm">
          {loading ? "Loading comments..." : "No comments yet. Be the first to share your thoughts!"}
        </p>
      ) : (
        <div className="space-y-5 divide-y divide-white/5">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 pt-5 first:pt-0">
              <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden">
                {c.author?.photoUrl
                  ? (
                    <Image
                      src={c.author.photoUrl}
                      alt={c.author.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  )
                  : <UserIcon className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{c.author?.name ?? "Anonymous"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
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

  useEffect(() => {
    ProductService.getProductById(id)
      .then((res) => setProduct(res.data ?? res))
      .catch((err) => console.error("Failed to load product", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVoteDelta = ({ up, down }: { up: number; down: number }) => {
    setProduct((prev) => prev
      ? { ...prev, upvoteCount: prev.upvoteCount + up, downvoteCount: prev.downvoteCount + down }
      : prev
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 animate-pulse">
        <div className="h-10 w-32 bg-white/5 rounded-full mb-8" />
        <div className="h-[400px] w-full rounded-3xl bg-white/5" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
        <Ghost className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products">
          <Button variant="outline" className="rounded-full mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-100px)]">
      {showReport && <ReportModal productId={product.id} onClose={() => setShowReport(false)} />}

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-[2rem] glass p-8 md:p-12 mb-12 shadow-2xl shadow-purple-500/10 border border-border/50 group">
        <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px] group-hover:bg-purple-500/20 transition-colors duration-700" />

        <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 bg-black/20 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={192}
                height={192}
                className="h-32 w-32 md:h-48 md:w-48 rounded-3xl object-cover shadow-2xl border border-white/10"
              />
            ) : (
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-2xl">
                <Ghost className="h-16 w-16 text-purple-400" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{product.name}</h1>
              <a href={product.externalLink || "#"} target="_blank" rel="noreferrer">
                <Button className="rounded-full border-white/20 hover:opacity-90 shadow-md">
                  Visit App <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="flex gap-2 flex-wrap pb-4 border-b border-border/40">
              {product.tags?.map((tagObj: ProductTag) => (
                <span key={tagObj.id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground">
                  #{tagObj.tag?.name || (tagObj as unknown as { name: string }).name}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-semibold opacity-90">About this product</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CommentsSection productId={product.id} />
        </div>

        <div className="space-y-6">
          {/* Meet the Maker Section */}
          <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Meet the Maker</h3>
            <div className="flex items-center gap-4">
              {product.owner?.photoUrl ? (
                <Image
                  src={product.owner.photoUrl}
                  alt={product.owner.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-2xl object-cover border border-white/10"
                />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">{product.owner?.name || "Anonymous Maker"}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{product.owner?.email || "No email provided"}</span>
                </div>
              </div>
            </div>
          </div>

          <VotingPanel product={product} onVote={handleVoteDelta} />

          <button
            onClick={() => setShowReport(true)}
            className="w-full glass p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-destructive/10 hover:border-destructive/30 border border-transparent transition-all"
          >
            <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors">
              Report an issue
            </span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
