import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  
  const { signIn, signUp, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    // Check if admin exists
    const checkAdmin = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { count } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });
      setAdminExists(count !== null && count > 0);
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        await signUp(email, password);
        toast({
          title: "Account created!",
          description: "You are now the admin. Redirecting...",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "Redirecting to dashboard...",
        });
      }
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            {adminExists === false 
              ? "Create your admin account to manage the portfolio"
              : "Sign in to manage your portfolio"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignup ? "Creating..." : "Signing in..."}
                </>
              ) : (
                isSignup ? "Create Admin Account" : "Sign In"
              )}
            </Button>

            {adminExists === false && !isSignup && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsSignup(true)}
              >
                Create Admin Account
              </Button>
            )}

            {isSignup && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsSignup(false)}
              >
                Back to Login
              </Button>
            )}

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => navigate("/")}
            >
              ← Back to Portfolio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
