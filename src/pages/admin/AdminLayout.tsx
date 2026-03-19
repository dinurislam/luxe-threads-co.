import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Access denied. Admin only.</p>
      </main>
    );
  }

  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
  ];

  return (
    <main className="pt-24 px-6 lg:px-12 min-h-screen pb-20">
      <div className="flex items-center gap-6 mb-10 border-b border-border pb-4">
        <span className="font-display text-lg uppercase">Admin</span>
        <nav className="flex gap-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[11px] uppercase tracking-premium font-body ghost-slide ${
                location.pathname === l.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <Outlet />
    </main>
  );
};

export default AdminLayout;
