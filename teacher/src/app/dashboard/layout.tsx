import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Chatbot } from "@/components/shared/chatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full relative overflow-hidden">
      {/* Animated background - Modern theme */}
      <div className="fixed inset-0 z-0 grid-pattern opacity-30" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-purple-100/40 via-transparent to-cyan-100/40" />

      <SidebarNav />
      <div className="flex flex-col flex-1 sm:pl-16 relative z-10">
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
