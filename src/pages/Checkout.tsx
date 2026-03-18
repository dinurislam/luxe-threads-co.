import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type PaymentMethod = "bkash" | "nagad" | "cod";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    toast.success("Order placed successfully! We will contact you shortly.");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Your bag is empty.</p>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 lg:px-12 min-h-screen max-w-4xl mx-auto">
      <h1 className="font-display text-3xl uppercase mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping info */}
        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Shipping Details</p>
          <div className="flex flex-col gap-4">
            {(["name", "phone", "address", "city"] as const).map((field) => (
              <div key={field}>
                <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">
                  {field}
                </label>
                <input
                  type="text"
                  required
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground ghost-slide font-body"
                />
              </div>
            ))}
          </div>

          {/* Payment method */}
          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Payment Method</p>
            <div className="flex flex-col gap-3">
              {([
                { id: "bkash" as const, label: "bKash", color: "#E2136E" },
                { id: "nagad" as const, label: "Nagad", color: "#F6921E" },
                { id: "cod" as const, label: "Cash on Delivery", color: undefined },
              ]).map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center gap-3 border px-4 py-3 ghost-slide ${
                    paymentMethod === method.id
                      ? "border-foreground"
                      : "border-border"
                  }`}
                >
                  {method.color && (
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: method.color }}
                    />
                  )}
                  <span className="text-xs font-body">{method.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Order Summary</p>
          <div className="border border-border p-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-xs font-display uppercase">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">Size: {item.size} × {item.quantity}</p>
                </div>
                <span className="font-mono-price text-xs">৳{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 mt-2">
              <span className="text-[11px] uppercase tracking-premium">Total</span>
              <span className="font-mono-price text-sm">৳{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-foreground text-background text-[11px] uppercase tracking-premium py-4 font-body hover:bg-foreground/90 ghost-slide"
          >
            Place Order
          </button>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
