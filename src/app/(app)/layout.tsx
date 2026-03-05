import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pb-20 md:pl-16 md:pb-0">{children}</main>
    </div>
  );
}
