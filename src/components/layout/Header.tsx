import { Link } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/shop?category=shirts", label: "Shirts" },
    { to: "/shop?category=t-shirts", label: "T-Shirts" },
    { to: "/shop?category=pants", label: "Pants" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 lg:px-12 h-16">
        {/* Mobile menu toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-foreground" aria-label="Menu">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-[11px] uppercase tracking-premium font-body text-muted-foreground hover:text-foreground ghost-slide">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-display text-lg lg:text-xl tracking-tight uppercase whitespace-nowrap">On Items Zone</h1>
        </Link>

        <div className="flex items-center gap-5 ml-auto">
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-muted-foreground hover:text-foreground ghost-slide" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
          {isAdmin && (
            <Link to="/admin" className="hidden md:block text-[11px] uppercase tracking-premium font-body text-muted-foreground hover:text-foreground ghost-slide">
              Admin
            </Link>
          )}
          <Link to={user ? "/account" : "/auth"} className="hidden md:block text-muted-foreground hover:text-foreground ghost-slide" aria-label="Account">
            <User className="w-4 h-4" />
          </Link>
          <button onClick={() => setIsOpen(true)} className="text-[11px] uppercase tracking-premium font-body text-muted-foreground hover:text-foreground ghost-slide">
            Bag ({totalItems})
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="border-t border-border overflow-hidden">
            <div className="px-6 lg:px-12 py-4">
              <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus
                  className="w-full bg-transparent border-b border-foreground text-sm font-body py-2 outline-none placeholder:text-muted-foreground" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-premium font-body text-foreground hover:text-muted-foreground ghost-slide">
                  {link.label}
                </Link>
              ))}
              <Link to={user ? "/account" : "/auth"} onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-premium font-body text-foreground hover:text-muted-foreground ghost-slide">
                {user ? "Account" : "Sign In"}
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-premium font-body text-foreground hover:text-muted-foreground ghost-slide">
                  Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
