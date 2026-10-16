"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIService } from "@/services/ai/ai.service";

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
      const res = await AIService.sendMessage(userMsg, messages.slice(1));

      if (!res.ok) {
        let errDetail = "Connection failed";
        try {
          const errJson = await res.json();
          errDetail = errJson.details || errJson.error || errDetail;
        } catch {}
        throw new Error(errDetail);
      }

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
    <div 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-3 sm:gap-4 pointer-events-none"
      style={{ zIndex: "var(--z-chat, 9999)" }}
    >
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] h-[min(520px,calc(100dvh-7.5rem))] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-xl pointer-events-auto">
          <div className="p-5 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">DevHuntr Guide</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-medium">Online & Ready</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat assistant"
              className="h-8 w-8 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar bg-muted/20 text-foreground">
            {messages.map((m, idx) => (
              <div key={idx} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-3.5 text-sm whitespace-pre-wrap leading-relaxed",
                  m.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs shadow-xs" 
                    : "bg-card text-foreground rounded-2xl rounded-tl-xs border border-border shadow-xs"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-card p-3 rounded-2xl rounded-tl-xs border border-border flex items-center gap-2 shadow-xs">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-card border-t border-border">
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full h-11 pl-4 pr-12 rounded-xl bg-muted/50 border border-border text-sm focus:ring-2 focus:ring-ring outline-hidden transition-all text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI chat assistant" : "Open AI chat assistant"}
        className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden pointer-events-auto cursor-pointer",
          isOpen 
            ? "bg-card text-foreground border border-border" 
            : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <MessageSquare className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-background" />
          </div>
        )}
      </button>
    </div>
  );
}
