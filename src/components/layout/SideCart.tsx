import { useCart } from "@/context/CartContext";
import { X, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const SideCart = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/20 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Cart panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 border-l border-border animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-[11px] uppercase tracking-premium font-body">
            Bag ({totalItems})
          </span>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center mt-12">
              Your bag is empty.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-secondary"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-display uppercase">{item.product.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">Size: {item.size}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono-price w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-mono-price text-xs">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="self-start text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-premium">Total</span>
              <span className="font-mono-price text-sm">৳{totalPrice.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-foreground text-background text-center text-[11px] uppercase tracking-premium py-4 hover:bg-foreground/90 ghost-slide"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart;
