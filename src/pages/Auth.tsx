import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        await signUp(email, password, fullName);
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 px-6 lg:px-12 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl uppercase mb-2 text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-xs text-muted-foreground text-center mb-10">
          {isLogin ? "Welcome back to On Items Zone" : "Join On Items Zone"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground ghost-slide font-body"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground ghost-slide font-body"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-premium text-muted-foreground mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-border bg-transparent text-sm py-2 outline-none focus:border-foreground ghost-slide font-body"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-foreground text-background text-[11px] uppercase tracking-premium py-4 font-body hover:bg-foreground/90 ghost-slide disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-xs text-muted-foreground hover:text-foreground ghost-slide text-center"
        >
          {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
};

export default Auth;
