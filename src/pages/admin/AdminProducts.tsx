import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { Trash2, Edit, ImageIcon } from "lucide-react";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { Skeleton } from "@/components/ui/skeleton";

const AdminProducts = () => {
  const [products, setProducts] = useState<(Tables<"products"> & { categories?: { name: string } | null })[]>([]);
  const [editingProduct, setEditingProduct] = useState<Tables<"products"> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
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
          className="bg-foreground text-background text-[11px] uppercase tracking-premium px-6 py-3 font-body hover:bg-foreground/90 ghost-slide"
        >
          + Add Product
        </button>
      </div>

      <div className="border border-border">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-border text-[10px] uppercase tracking-premium text-muted-foreground">
          <span className="w-12">Image</span>
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-border last:border-0 items-center">
              <Skeleton className="w-12 h-14 rounded-none" />
              <div><Skeleton className="h-4 w-32 rounded-none mb-1" /><Skeleton className="h-3 w-20 rounded-none" /></div>
              <Skeleton className="h-4 w-16 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-16 rounded-none" />
            </div>
          ))
        ) : products.map((p) => (
          <div key={p.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-border last:border-0 items-center group hover:bg-secondary/50 ghost-slide">
            <div className="w-12 h-14 bg-secondary overflow-hidden flex-shrink-0">
              {p.images[0] ? (
                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon className="w-4 h-4" /></div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-display uppercase truncate">{p.name}</p>
              <p className="text-[10px] text-muted-foreground font-body">{p.categories?.name || "—"}</p>
            </div>
            <span className="font-mono-price text-sm">৳{p.price.toLocaleString()}</span>
            <span className={`text-xs font-body ${p.stock_quantity <= 5 ? "text-destructive" : ""}`}>{p.stock_quantity}</span>
            <div className="flex gap-1">
              <button onClick={() => { setEditingProduct(p); setShowForm(true); }} className="p-2 hover:bg-secondary ghost-slide rounded-sm">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-secondary ghost-slide rounded-sm text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <p className="px-6 py-12 text-xs text-muted-foreground text-center font-body">No products yet. Click "Add Product" to get started.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
