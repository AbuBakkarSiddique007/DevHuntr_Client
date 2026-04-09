"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hi! I'm your DevHuntr Guide. How can I help you launch or explore today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg, 
          history: messages.slice(1) 
        }),
      });

      if (!res.ok) throw new Error("Connection failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      // Add placeholder for AI response
      setMessages(prev => [...prev, { role: "model", text: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiText += chunk;

        // Update the last message (the AI response placeholder) with current text
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "model", text: aiText };
          return updated;
        });
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: "model", text: "I'm having a little trouble connecting. Please check your internet or try again in a moment!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-4">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-[380px] h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 backdrop-blur-3xl">
          {/* HEADER */}
          <div className="p-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-white/70">DevHuntr Guide</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-bold">Online & Ready</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-transparent text-slate-900 dark:text-white">
            {messages.map((m, idx) => (
              <div key={idx} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-3xl text-sm whitespace-pre-wrap",
                  m.role === "user" 
                    ? "bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-500/10" 
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-muted-foreground rounded-tl-none border border-slate-100 dark:border-white/5"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-white/5 p-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-white/5 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-6 bg-white dark:bg-slate-950/50 border-t border-slate-100 dark:border-white/5">
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full h-12 pl-4 pr-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-slate-900 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden",
          isOpen 
            ? "bg-slate-900 text-white" 
            : "bg-linear-to-tr from-purple-600 to-indigo-600 text-white"
        )}
      >
        <div className="absolute inset-0 bg-white/10 blur-xl group-hover:bg-white/20 transition-all" />
        {isOpen ? (
          <X className="h-7 w-7 relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <MessageSquare className="h-7 w-7" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
        )}
      </button>
    </div>
  );
}
