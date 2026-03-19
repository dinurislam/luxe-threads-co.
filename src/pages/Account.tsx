import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [orders, setOrders] = useState<Tables<"orders">[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setForm({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "", city: data.city || "" });
      }
    });
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setOrders(data);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    if (error) { toast.error("Failed to update profile"); return; }
    toast.success("Profile updated");
    setEditing(false);
    setProfile({ ...profile!, ...form });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-600",
    processing: "text-blue-600",
    shipped: "text-purple-600",
    delivered: "text-green-600",
  };

  return (
    <main className="pt-24 px-6 lg:px-12 min-h-screen max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl uppercase">My Account</h1>
        <button onClick={handleSignOut} className="text-[11px] uppercase tracking-premium text-muted-foreground hover:text-foreground ghost-slide font-body">
          Sign Out
        </button>
      </div>

      {/* Profile section */}
      <section className="mb-16">
        <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Profile</p>
        <div className="border border-border p-6">
          <p className="text-xs text-muted-foreground mb-4">{user?.email}</p>
          {editing ? (
            <div className="flex flex-col gap-3">
              {(["full_name", "phone", "address", "city"] as const).map((field) => (
                <div key={field}>
                  <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground ghost-slide font-body"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button onClick={handleSave} className="bg-foreground text-background text-[11px] uppercase tracking-premium px-6 py-3 font-body">Save</button>
                <button onClick={() => setEditing(false)} className="border border-border text-[11px] uppercase tracking-premium px-6 py-3 font-body">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-body">{profile?.full_name || "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">{profile?.phone || "No phone"} · {profile?.city || "No city"}</p>
              <p className="text-xs text-muted-foreground">{profile?.address || "No address"}</p>
              <button onClick={() => setEditing(true)} className="mt-4 text-[11px] uppercase tracking-premium text-muted-foreground hover:text-foreground ghost-slide font-body">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Order history */}
      <section>
        <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Order History</p>
        {orders.length === 0 ? (
          <p className="text-xs text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-premium text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] uppercase tracking-premium ${statusColors[order.status] || "text-muted-foreground"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body">{order.payment_method}</span>
                  <span className="font-mono-price text-sm">৳{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Account;
