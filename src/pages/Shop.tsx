import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const setCategoryFilter = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) { params.set("category", slug); } else { params.delete("category"); }
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter && p.categories?.slug !== categoryFilter) return false;
      if (selectedSizes.length > 0 && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [products, categoryFilter, selectedSizes, priceRange, searchQuery]);

  return (
    <main className="pt-24 px-6 lg:px-12 min-h-screen">
      <div className="mb-10">
        <h1 className="font-display text-3xl uppercase">
          {searchQuery ? `Results for "${searchQuery}"` : categoryFilter ? categoryFilter.replace("-", " ") : "All Products"}
        </h1>
        <p className="text-xs text-muted-foreground mt-2">{filtered.length} {filtered.length === 1 ? "item" : "items"}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-48 flex-shrink-0">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-3">Category</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => setCategoryFilter("")} className={`text-xs text-left font-body ghost-slide ${!categoryFilter ? "text-foreground" : "text-muted-foreground"}`}>All</button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategoryFilter(cat.slug)} className={`text-xs text-left font-body ghost-slide ${categoryFilter === cat.slug ? "text-foreground" : "text-muted-foreground"}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button key={size} onClick={() => toggleSize(size)} className={`text-[10px] uppercase tracking-premium px-3 py-1.5 border ghost-slide ${selectedSizes.includes(size) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-3">Price</p>
            <input type="range" min={0} max={10000} step={500} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-foreground" />
            <div className="flex justify-between mt-1">
              <span className="font-mono-price text-[10px] text-muted-foreground">৳0</span>
              <span className="font-mono-price text-[10px] text-muted-foreground">৳{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-20">No products found.</p>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filtered.map((product) => (
                <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Shop;
