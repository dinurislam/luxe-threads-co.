import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

interface Props {
  product: Tables<"products"> | null;
  onClose: () => void;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminProductForm = ({ product, onClose }: Props) => {
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    compare_at_price: product?.compare_at_price || 0,
    stock_quantity: product?.stock_quantity || 0,
    category_id: product?.category_id || "",
    is_featured: product?.is_featured || false,
    sizes: product?.sizes || [] as string[],
    images: product?.images || [] as string[],
  });
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => { if (data) setCategories(data); });
  }, []);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: product ? f.slug : slugify(name) }));
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, imageUrl.trim()] }));
    setImageUrl("");
  };

  const removeImage = (i: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: form.price,
      compare_at_price: form.compare_at_price || null,
      stock_quantity: form.stock_quantity,
      category_id: form.category_id || null,
      is_featured: form.is_featured,
      sizes: form.sizes,
      images: form.images,
    };

    let error;
    if (product) {
      ({ error } = await supabase.from("products").update(payload).eq("id", product.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(product ? "Product updated" : "Product created");
    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl uppercase">{product ? "Edit Product" : "Add Product"}</h2>
        <button onClick={onClose} className="text-[11px] uppercase tracking-premium text-muted-foreground hover:text-foreground font-body">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Name</label>
            <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Slug</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body" />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
            className="w-full border border-border bg-transparent text-sm p-2 outline-none focus:border-foreground font-body resize-none" />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Price (৳)</label>
            <input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Compare Price</label>
            <input type="number" min={0} value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: Number(e.target.value) })}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Stock</label>
            <input type="number" required min={0} value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3 pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="accent-foreground" />
              <span className="text-xs font-body">Featured</span>
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2 block">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => (
              <button key={size} type="button" onClick={() => toggleSize(size)}
                className={`text-[10px] uppercase tracking-premium px-4 py-2 border ghost-slide ${
                  form.sizes.includes(size) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2 block">Images (URL)</label>
          <div className="flex gap-2 mb-3">
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."
              className="flex-1 border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground font-body" />
            <button type="button" onClick={addImageUrl} className="text-[11px] uppercase tracking-premium px-4 py-2 border border-border hover:border-foreground font-body">
              Add
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-16 h-20 bg-secondary overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-foreground/50 text-background text-[10px] opacity-0 group-hover:opacity-100 ghost-slide flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="mt-4 bg-foreground text-background text-[11px] uppercase tracking-premium py-4 font-body hover:bg-foreground/90 ghost-slide disabled:opacity-50">
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
