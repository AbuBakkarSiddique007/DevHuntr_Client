import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | DevHuntr",
  description: "DevHuntr Dashboard",
};

export default function DashboardLayout({
  children,
  admin,
  dashboard,
  moderator,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  dashboard: React.ReactNode;
  moderator: React.ReactNode;
}) {


  return (
    <div className="min-h-screen flex text-foreground">
      {/* Sidebar placeholder */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          {children}
          {/* Role-based parallel slots */}
          <div className="space-y-4">
            {dashboard}
            {moderator}
            {admin}
          </div>
        </main>
      </div>
    </div>
  );
}
