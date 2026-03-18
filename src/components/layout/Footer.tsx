import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-24">
      <div className="px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-lg uppercase mb-4">On Items Zone</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Refined essentials for the modern silhouette.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Shop</p>
            <div className="flex flex-col gap-2">
              <Link to="/shop?category=shirts" className="text-xs text-foreground hover:text-muted-foreground ghost-slide">Shirts</Link>
              <Link to="/shop?category=t-shirts" className="text-xs text-foreground hover:text-muted-foreground ghost-slide">T-Shirts</Link>
              <Link to="/shop?category=pants" className="text-xs text-foreground hover:text-muted-foreground ghost-slide">Pants</Link>
              <Link to="/shop" className="text-xs text-foreground hover:text-muted-foreground ghost-slide">All Products</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Information</p>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-foreground">Shipping & Returns</span>
              <span className="text-xs text-foreground">Size Guide</span>
              <span className="text-xs text-foreground">Care Instructions</span>
              <span className="text-xs text-foreground">Contact</span>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Newsletter</p>
            <p className="text-xs text-muted-foreground mb-4">Receive updates on new arrivals.</p>
            <div className="flex border-b border-foreground">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent text-xs py-2 outline-none placeholder:text-muted-foreground font-body"
              />
              <button className="text-[10px] uppercase tracking-premium font-body px-2 py-2 text-foreground">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">© 2026 On Items Zone. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-[10px] text-muted-foreground">Privacy</span>
            <span className="text-[10px] text-muted-foreground">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
