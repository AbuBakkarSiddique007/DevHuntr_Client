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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Tags</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage searchable categories for all products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE TAG PANEL */}
        <div className="lg:col-span-1 border border-white/5 bg-white/2 rounded-[2rem] p-6 h-fit backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Plus className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg">Create New Tag</h3>
          </div>

          <form onSubmit={handleCreateTag} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Tag Name</label>
              <Input
                placeholder="e.g. Developer Tools, AI, SaaS..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-sm"
                maxLength={40}
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating || !newTagName.trim()}
              className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Tag
            </Button>
          </form>
        </div>

        {/* TAGS LIST PANEL */}
        <div className="lg:col-span-2 border border-white/5 bg-white/2 rounded-[2rem] p-0 overflow-hidden backdrop-blur-xl flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                <TagIcon className="h-4 w-4 text-pink-400" />
              </div>
              <h3 className="font-bold">Active Tags ({tags.length})</h3>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 rounded-xl h-10 w-full"
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-center opacity-60">
                 <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                 <p className="font-bold text-lg">No tags found</p>
                 <p className="text-sm">Try empty search or create a new one.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {filteredTags.map((tag) => (
                   <div 
                     key={tag.id}
                     className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2 hover:bg-white/10 transition-colors"
                   >
                     <span className="text-[10px] text-muted-foreground">ID: {tag.id.slice(-4)}</span>
                     <span className="font-bold text-sm tracking-wide">{tag.name}</span>
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
