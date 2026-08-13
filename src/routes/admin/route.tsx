import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebarContent from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dirty">
      {/* Desktop sidebar */}
      <aside className="hidden w-[264px] flex-shrink-0 bg-navy lg:block">
        <AdminSidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="fixed left-0 top-0 z-40 h-full w-[264px] bg-navy lg:hidden"
            >
              <AdminSidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar onMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-dirty p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
