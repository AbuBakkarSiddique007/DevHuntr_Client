import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevHuntr",
  description: "Tech Product Discovery Platform",
};

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar placeholder */}
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer placeholder */}
    </div>
  );
}
