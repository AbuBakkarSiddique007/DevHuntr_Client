"use client";

import { useEffect, useState, useMemo } from "react";
import { TagService, Tag } from "@/services/tag/tag.service";
import { Tag as TagIcon, Plus, Loader2, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TagsManagementPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [search, setSearch] = useState("");

  const fetchTags = async () => {
    setLoading(true);
    try {
      const data = await TagService.getTags();
      setTags(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch platform tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setIsCreating(true);
    try {
      const created = await TagService.createTag(newTagName.trim());
      toast.success(`Tag "${created.name}" created successfully`);
      setTags(prev => [created, ...prev]);
      setNewTagName("");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to create tag");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTags = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter(t => t.name.toLowerCase().includes(q));
  }, [search, tags]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <TagIcon className="h-6 w-6 text-primary" />
          Platform Tags
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage searchable taxonomies and categories for launched products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CREATE TAG PANEL */}
        <div className="lg:col-span-1 border border-border bg-card rounded-2xl p-6 h-fit shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Plus className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-base text-foreground">Create New Tag</h2>
          </div>

          <form onSubmit={handleCreateTag} className="space-y-3.5">
            <div className="space-y-1.5">
              <label htmlFor="tag-name" className="text-xs font-semibold text-foreground">Tag Name</label>
              <Input
                id="tag-name"
                placeholder="e.g. Developer Tools, AI, SaaS..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-10 text-sm"
                maxLength={40}
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating || !newTagName.trim()}
              className="w-full h-10 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Tag
            </Button>
          </form>
        </div>

        {/* TAGS LIST PANEL */}
        <div className="lg:col-span-2 border border-border bg-card rounded-2xl p-0 overflow-hidden shadow-xs flex flex-col min-h-[460px]">
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm text-foreground">Active Tags ({tags.length})</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                aria-label="Filter tags"
                placeholder="Filter tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-center py-16 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 opacity-30 mb-2" />
                <p className="font-semibold text-sm">No tags found</p>
                <p className="text-xs">Try another keyword or create a new tag.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <div 
                    key={tag.id}
                    className="px-3 py-1.5 rounded-lg border border-border bg-muted/60 flex items-center gap-2 hover:border-primary/40 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground font-mono">#{tag.id.slice(-4)}</span>
                    <span className="font-semibold text-xs text-foreground">{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
