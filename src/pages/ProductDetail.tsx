import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useProductBySlug } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isLoading } = useProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (isLoading) {
    return (
      <main className="pt-20 min-h-screen">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-[60%]">
            <Skeleton className="aspect-[3/4] rounded-none" />
            <div className="flex gap-px mt-px">
              {[1, 2].map((i) => <Skeleton key={i} className="flex-1 aspect-[3/4] rounded-none" />)}
            </div>
          </div>
          <div className="lg:w-[40%] px-6 lg:px-12 py-8 lg:py-16">
            <Skeleton className="h-3 w-20 rounded-none mb-4" />
            <Skeleton className="h-8 w-3/4 rounded-none mb-4" />
            <Skeleton className="h-5 w-24 rounded-none mb-6" />
            <Skeleton className="h-16 w-full rounded-none mb-8" />
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-14 rounded-none" />)}
            </div>
            <Skeleton className="h-12 w-full rounded-none mb-3" />
            <Skeleton className="h-12 w-full rounded-none" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Product not found.</p>
      </main>
    );
  }

  const inStock = product.stock_quantity > 0;
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addItem(product, selectedSize);
    toast.success("Added to bag");
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addItem(product, selectedSize);
    navigate("/checkout");
  };

  return (
    <main className="pt-20 min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[60%]">
          <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }} className="aspect-[3/4] bg-secondary overflow-hidden">
            {product.images[selectedImage] && (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-px mt-px">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`flex-1 aspect-[3/4] bg-secondary overflow-hidden ghost-slide ${i === selectedImage ? "ring-2 ring-foreground ring-inset" : "opacity-60 hover:opacity-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-[40%] px-6 lg:px-12 py-8 lg:py-16 lg:sticky lg:top-16 lg:self-start">
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2">{product.categories?.name}</p>
          <h1 className="font-display text-2xl lg:text-3xl uppercase mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono-price text-lg">৳{product.price.toLocaleString()}</span>
            {product.compare_at_price && (
              <>
                <span className="font-mono-price text-sm text-muted-foreground line-through">৳{product.compare_at_price.toLocaleString()}</span>
                <span className="text-[10px] uppercase tracking-premium text-destructive font-body">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-8 font-body">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-700" : "bg-destructive"}`} />
            <span className="text-[10px] uppercase tracking-premium text-muted-foreground">
              {inStock ? `In Stock — ${product.stock_quantity} left` : "Out of Stock"}
            </span>
          </div>

          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`text-[11px] uppercase tracking-premium px-5 py-2.5 border ghost-slide ${selectedSize === size ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} disabled={!inStock} className="w-full bg-foreground text-background text-[11px] uppercase tracking-premium py-4 font-body hover:bg-foreground/90 ghost-slide disabled:opacity-40 disabled:cursor-not-allowed">
              Add to Bag
            </button>
            <button onClick={handleBuyNow} disabled={!inStock} className="w-full border border-foreground text-foreground text-[11px] uppercase tracking-premium py-4 font-body hover:bg-foreground hover:text-background ghost-slide disabled:opacity-40 disabled:cursor-not-allowed">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
