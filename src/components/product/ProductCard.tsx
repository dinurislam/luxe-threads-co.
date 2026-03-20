import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import type { DbProduct } from "@/hooks/useProducts";

interface ProductCardProps {
  product: DbProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0] || "M";
    addItem(product, size);
    toast.success(`${product.name} added to bag`);
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div whileHover="hover" className="group relative flex flex-col gap-3">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
              loading="lazy"
            />
          )}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
            />
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-foreground text-background text-[9px] uppercase tracking-premium px-2 py-1 font-body">
              -{discount}%
            </span>
          )}
          <motion.button
            variants={{ hover: { y: 0, opacity: 1 } }}
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            onClick={handleQuickAdd}
            className="absolute bottom-0 w-full bg-foreground/95 backdrop-blur-sm py-3.5 text-[10px] uppercase tracking-premium text-background font-body text-center hover:bg-foreground ghost-slide"
          >
            Quick Add +
          </motion.button>
        </div>
        <div className="flex justify-between items-start px-1">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-display text-sm uppercase tracking-tight truncate">{product.name}</h3>
            <p className="text-[11px] text-muted-foreground uppercase font-body">{product.categories?.name || ""}</p>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-mono-price text-sm">৳{product.price.toLocaleString()}</span>
            {product.compare_at_price && (
              <span className="font-mono-price text-[10px] text-muted-foreground line-through">
                ৳{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
