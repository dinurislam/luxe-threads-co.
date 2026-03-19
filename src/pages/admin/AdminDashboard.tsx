import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, pendingOrders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, productsRes, pendingRes] = await Promise.all([
        supabase.from("orders").select("total_amount"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      const orders = ordersRes.data || [];
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + o.total_amount, 0),
        totalProducts: productsRes.count || 0,
        pendingOrders: pendingRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}` },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Products", value: stats.totalProducts },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl uppercase mb-8">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="border border-border p-6">
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2">{c.label}</p>
            <p className="font-display text-2xl">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link to="/admin/products" className="bg-foreground text-background text-[11px] uppercase tracking-premium px-6 py-3 font-body ghost-slide">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="border border-foreground text-foreground text-[11px] uppercase tracking-premium px-6 py-3 font-body ghost-slide hover:bg-foreground hover:text-background">
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
