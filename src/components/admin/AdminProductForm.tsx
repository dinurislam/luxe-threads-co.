import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { X, Plus, ImageIcon } from "lucide-react";

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

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addImageUrl(); }
  };

  const removeImage = (i: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) { toast.error("Name and slug are required"); return; }
    if (form.price <= 0) { toast.error("Price must be greater than 0"); return; }

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
        <button onClick={onClose} className="text-[11px] uppercase tracking-premium text-muted-foreground hover:text-foreground font-body ghost-slide">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Name *</label>
            <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Slug *</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide" />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
            className="w-full border border-border bg-transparent text-sm p-3 outline-none focus:border-foreground font-body resize-none ghost-slide" />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Price (৳) *</label>
            <input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Compare Price</label>
            <input type="number" min={0} value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: Number(e.target.value) })}
              className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Stock *</label>
            <input type="number" required min={0} value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
              className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide cursor-pointer">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3 pb-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 border ghost-slide flex items-center justify-center ${form.is_featured ? "border-foreground bg-foreground" : "border-border group-hover:border-foreground"}`}>
                {form.is_featured && <span className="text-background text-[10px]">✓</span>}
              </div>
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="sr-only" />
              <span className="text-xs font-body">Featured product</span>
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2.5 block">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => (
              <button key={size} type="button" onClick={() => toggleSize(size)}
                className={`text-[10px] uppercase tracking-premium px-4 py-2.5 border ghost-slide ${
                  form.sizes.includes(size) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2.5 block">
            Images (URL) — {form.images.length} added
          </label>
          <div className="flex gap-2 mb-4">
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={handleImageKeyDown} placeholder="Paste image URL and press Enter..."
              className="flex-1 border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground font-body ghost-slide" />
            <button type="button" onClick={addImageUrl} className="text-[11px] uppercase tracking-premium px-5 py-2.5 border border-border hover:border-foreground hover:bg-foreground hover:text-background font-body ghost-slide flex items-center gap-1.5">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {form.images.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] bg-secondary overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 ghost-slide">
                    <X className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] uppercase tracking-premium bg-foreground/80 text-background px-1.5 py-0.5 font-body">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border p-8 flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="w-6 h-6" />
              <p className="text-[10px] uppercase tracking-premium">No images added yet</p>
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
