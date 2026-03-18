import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0]);
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover="hover"
        className="group relative flex flex-col gap-3"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              loading="lazy"
            />
          )}
          <motion.button
            variants={{ hover: { y: 0, opacity: 1 } }}
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            onClick={handleQuickAdd}
            className="absolute bottom-0 w-full bg-foreground py-3 text-[10px] uppercase tracking-premium text-background font-body text-center"
          >
            Quick Add +
          </motion.button>
        </div>
        <div className="flex justify-between items-start px-1">
          <div>
            <h3 className="font-display text-sm uppercase tracking-tight">{product.name}</h3>
            <p className="text-[11px] text-muted-foreground uppercase">{product.categoryName}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono-price text-sm">৳{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="font-mono-price text-[10px] text-muted-foreground line-through">
                ৳{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
