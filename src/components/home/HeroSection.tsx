import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroCover from "@/assets/hero-cover.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={heroCover}
        alt="On Items Zone Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/10" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1], delay: 0.2 }}
        >
          <p className="text-[10px] uppercase tracking-premium text-background/80 mb-3 font-body">
            Collection 01
          </p>
          <h2 className="font-display text-4xl lg:text-6xl uppercase text-background leading-[1.1] max-w-lg">
            On Items Zone
          </h2>
          <p className="text-xs text-background/70 mt-4 max-w-sm font-body leading-relaxed">
            Refined essentials for the modern silhouette. Structured cuts, premium fabrics.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-8 border border-background/60 text-background text-[11px] uppercase tracking-premium px-8 py-3.5 font-body hover:bg-background hover:text-foreground ghost-slide"
          >
            Shop Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
