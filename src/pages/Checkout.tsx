import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

type PaymentMethod = "bkash" | "nagad" | "cod";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <main className="pt-24 px-6 lg:px-12 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">Please sign in to checkout.</p>
        <Link to="/auth" className="bg-foreground text-background text-[11px] uppercase tracking-premium px-8 py-3 font-body">
          Sign In
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setSubmitting(true);

    // Create order
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

    // Create order items
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

    toast.success("Order placed successfully! We will contact you shortly.");
    clearCart();
    navigate("/account");
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
        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-4">Shipping Details</p>
          <div className="flex flex-col gap-4">
            {(["name", "phone", "address", "city"] as const).map((field) => (
              <div key={field}>
                <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">{field}</label>
                <input type="text" required value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground ghost-slide font-body" />
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
                  className={`flex items-center gap-3 border px-4 py-3 ghost-slide ${paymentMethod === method.id ? "border-foreground" : "border-border"}`}>
                  {method.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: method.color }} />}
                  <span className="text-xs font-body">{method.label}</span>
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
