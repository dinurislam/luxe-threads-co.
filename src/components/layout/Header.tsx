import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 lg:px-12 h-16">
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/shop?category=shirts" className="text-[11px] uppercase tracking-premium font-body text-muted-foreground hover:text-foreground ghost-slide">Shirts</Link>
          <Link to="/shop?category=t-shirts" className="text-[11px] uppercase tracking-premium font-body text-muted-foreground hover:text-foreground ghost-slide">T-Shirts</Link>
          <Link to="/shop?category=pants" className="text-[11px] uppercase tracking-premium font-body text-muted-foreground hover:text-foreground ghost-slide">Pants</Link>
        </nav>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-display text-lg lg:text-xl tracking-tight uppercase">On Items Zone</h1>
        </Link>

        <div className="flex items-center gap-6 ml-auto">
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

      {searchOpen && (
        <div className="border-t border-border px-6 lg:px-12 py-4 animate-fade-in">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus
              className="w-full bg-transparent border-b border-foreground text-sm font-body py-2 outline-none placeholder:text-muted-foreground" />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
