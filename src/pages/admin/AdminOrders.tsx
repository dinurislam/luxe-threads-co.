import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const STATUSES = ["pending", "processing", "shipped", "delivered"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Tables<"orders">[]>([]);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Order updated to ${status}`);
    fetchOrders();
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-600",
    processing: "text-blue-600",
    shipped: "text-purple-600",
    delivered: "text-green-600",
  };

  return (
    <div>
      <h2 className="font-display text-2xl uppercase mb-8">Orders</h2>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-border p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-display uppercase">{order.customer_name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {order.customer_phone} · {order.customer_city} · {order.customer_address}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()} · {order.payment_method}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono-price text-lg">৳{order.total_amount.toLocaleString()}</p>
                <p className={`text-[10px] uppercase tracking-premium ${statusColors[order.status] || ""}`}>{order.status}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  disabled={order.status === s}
                  className={`text-[10px] uppercase tracking-premium px-4 py-2 border ghost-slide font-body ${
                    order.status === s ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
