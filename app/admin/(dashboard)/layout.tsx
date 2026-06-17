import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastProvider from "@/components/ui/ToastProvider";
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        {children}
      </main>
      <ToastProvider />
    </div>
  );
}
