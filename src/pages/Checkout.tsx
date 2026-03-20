import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "cod";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!user) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground font-body">Please sign in to checkout.</p>
        <Link to="/auth" className="bg-foreground text-background text-[11px] uppercase tracking-premium px-8 py-3 font-body hover:bg-foreground/90 ghost-slide">
          Sign In
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setSubmitting(true);

    const { data: order, error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_city: formData.city,
      payment_method: paymentMethod,
      total_amount: totalPrice,
    }).select().single();

    if (orderError || !order) {
      toast.error("Failed to place order");
      setSubmitting(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.product.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      toast.error("Order created but items failed to save");
      setSubmitting(false);
      return;
    }

    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="text-center max-w-md">
          <CheckCircle className="w-12 h-12 mx-auto mb-6 text-green-700" />
          <h2 className="font-display text-2xl uppercase mb-3">Order Placed</h2>
          <p className="text-xs text-muted-foreground font-body leading-relaxed mb-8">
            Thank you for your order! We'll contact you shortly to confirm delivery details.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/account" className="bg-foreground text-background text-[11px] uppercase tracking-premium px-8 py-3 font-body hover:bg-foreground/90 ghost-slide">
              View Orders
            </Link>
            <Link to="/shop" className="border border-foreground text-foreground text-[11px] uppercase tracking-premium px-8 py-3 font-body hover:bg-foreground hover:text-background ghost-slide">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-body mb-4">Your bag is empty.</p>
          <Link to="/shop" className="bg-foreground text-background text-[11px] uppercase tracking-premium px-8 py-3 font-body hover:bg-foreground/90 ghost-slide">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 lg:px-12 min-h-screen max-w-4xl mx-auto pb-20">
      <h1 className="font-display text-3xl uppercase mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Shipping Details</p>
          <div className="flex flex-col gap-5">
            {(["name", "phone", "address", "city"] as const).map((field) => (
              <div key={field}>
                <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1.5 block">{field}</label>
                <input type="text" required value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full border-b border-border bg-transparent text-sm py-2.5 outline-none focus:border-foreground ghost-slide font-body" />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Payment Method</p>
            <div className="flex flex-col gap-3">
              {([
                { id: "bkash" as const, label: "bKash", color: "#E2136E" },
                { id: "nagad" as const, label: "Nagad", color: "#F6921E" },
                { id: "cod" as const, label: "Cash on Delivery", color: undefined },
              ]).map((method) => (
                <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center gap-3 border px-5 py-3.5 ghost-slide ${paymentMethod === method.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"}`}>
                  {method.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: method.color }} />}
                  <span className="text-xs font-body">{method.label}</span>
                  {paymentMethod === method.id && <span className="ml-auto text-[10px] text-muted-foreground">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Order Summary</p>
          <div className="border border-border p-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex justify-between py-3 border-b border-border last:border-0">
                <div className="flex gap-3">
                  {item.product.images[0] && (
                    <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover bg-secondary flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-display uppercase">{item.product.name}</p>
                    <p className="text-[10px] text-muted-foreground font-body">Size: {item.size} × {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono-price text-xs">৳{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 mt-2">
              <span className="text-[11px] uppercase tracking-premium">Total</span>
              <span className="font-mono-price text-sm font-medium">৳{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full mt-6 bg-foreground text-background text-[11px] uppercase tracking-premium py-4 font-body hover:bg-foreground/90 ghost-slide disabled:opacity-50">
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
