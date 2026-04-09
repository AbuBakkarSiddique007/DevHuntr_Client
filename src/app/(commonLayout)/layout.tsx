import type { Metadata } from "next";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";
import ChatAssistant from "@/components/ai/ChatAssistant";

export const metadata: Metadata = {
  title: "DevHuntr | Discover Tech Products",
  description: "Tech Product Discovery Platform",
};

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground font-sans antialiased selection:bg-purple-500/30">
      <Navbar />
      <main className="flex-1 wrapper">{children}</main>
      <ChatAssistant />
      <Footer />
    </div>
  );
}
