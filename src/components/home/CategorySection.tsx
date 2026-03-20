import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackImages: Record<string, string> = {
  shirts: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  "t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  pants: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
};

const CategorySection = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="px-6 lg:px-12 py-20">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2">Browse</p>
        <h2 className="font-display text-2xl lg:text-3xl uppercase">Categories</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-none" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {(categories || []).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
              >
                <img
                  src={cat.image_url || fallbackImages[cat.slug] || ""}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 ghost-slide" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl uppercase text-background">{cat.name}</h3>
                  <p className="text-[10px] uppercase tracking-premium text-background/70 mt-1 font-body">
                    Explore →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
