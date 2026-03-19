import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { Trash2, Edit } from "lucide-react";
import AdminProductForm from "@/components/admin/AdminProductForm";

const AdminProducts = () => {
  const [products, setProducts] = useState<(Tables<"products"> & { categories?: { name: string } | null })[]>([]);
  const [editingProduct, setEditingProduct] = useState<Tables<"products"> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Product deleted");
    fetchProducts();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (showForm) {
    return <AdminProductForm product={editingProduct} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl uppercase">Products</h2>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-foreground text-background text-[11px] uppercase tracking-premium px-6 py-3 font-body"
        >
          Add Product
        </button>
      </div>

      <div className="border border-border">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-border text-[10px] uppercase tracking-premium text-muted-foreground">
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>
        {products.map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-border last:border-0 items-center">
            <div>
              <p className="text-sm font-display uppercase">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">{p.categories?.name || "—"}</p>
            </div>
            <span className="font-mono-price text-sm">৳{p.price.toLocaleString()}</span>
            <span className="text-xs font-body">{p.stock_quantity}</span>
            <div className="flex gap-2">
              <button onClick={() => { setEditingProduct(p); setShowForm(true); }} className="p-2 hover:bg-secondary ghost-slide">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-secondary ghost-slide text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="px-6 py-8 text-xs text-muted-foreground text-center">No products yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
