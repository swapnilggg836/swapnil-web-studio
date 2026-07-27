import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound, Mail, Lock, ShieldCheck, ArrowLeft, CheckCircle2, Copy } from "lucide-react";

type AuthMode = "login" | "signup" | "forgot_email" | "forgot_verify";

const AdminLogin = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP Password Reset States
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  
  const { signIn, signUp, sendPasswordResetOTP, verifyOTPAndResetPassword, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { count } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });
      setAdminExists(count !== null && count > 0);
    };
    checkAdmin();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password);
        toast({
          title: "Admin Account Created!",
          description: "Welcome! Redirecting to dashboard...",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome Back!",
          description: "Sign in successful. Redirecting...",
        });
      }
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { otpCode: code } = await sendPasswordResetOTP(resetEmail);
      setGeneratedOtp(code);
      setMode("forgot_verify");
      toast({
        title: "OTP Code Sent!",
        description: "Enter your 6-digit OTP code below to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Error Requesting OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTPAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTPAndResetPassword(resetEmail, otpCode, newPassword);
      toast({
        title: "Password Updated Successfully!",
        description: "Please sign in with your new password.",
      });
      // Try to sign in with new password automatically
      try {
        await signIn(resetEmail, newPassword);
        navigate("/admin/dashboard");
      } catch {
        setMode("login");
        setEmail(resetEmail);
      }
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyOTP = () => {
    if (generatedOtp) {
      navigator.clipboard.writeText(generatedOtp);
      setOtpCode(generatedOtp);
      toast({ title: "Copied OTP to clipboard & auto-filled!" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <Card className="w-full max-w-md bg-card/90 border-white/10 shadow-2xl backdrop-blur-xl relative z-10 text-foreground">
        {/* Card Header */}
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "hsl(199,89%,48%,0.15)", border: "1px solid hsl(199,89%,48%,0.3)" }}>
            {mode === "login" || mode === "signup" ? (
              <ShieldCheck className="w-6 h-6" style={{ color: "hsl(199,89%,60%)" }} />
            ) : (
              <KeyRound className="w-6 h-6" style={{ color: "hsl(199,89%,60%)" }} />
            )}
          </div>

          <CardTitle className="text-2xl font-black tracking-tight text-white">
            {mode === "login" && "Admin Access"}
            {mode === "signup" && "Create Admin Account"}
            {mode === "forgot_email" && "Reset Password with OTP"}
            {mode === "forgot_verify" && "Enter OTP & New Password"}
          </CardTitle>

          <CardDescription className="text-white/40 text-xs">
            {mode === "login" && "Sign in to manage your web studio portfolio"}
            {mode === "signup" && "Initialize your master admin credentials"}
            {mode === "forgot_email" && "Enter your admin email to receive a 6-digit OTP code"}
            {mode === "forgot_verify" && "Verify your 6-digit OTP code to update your password"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {/* LOGIN & SIGNUP FORMS */}
          {(mode === "login" || mode === "signup") && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                  <Mail size={13} /> Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="swapnilg836@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                    <Lock size={13} /> Password
                  </Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => { setResetEmail(email); setMode("forgot_email"); }}
                      className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-5 text-sm"
                style={{ background: "hsl(199,89%,48%)", color: "#000" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === "signup" ? "Creating Account..." : "Signing In..."}
                  </span>
                ) : (
                  mode === "signup" ? "Create Admin Account" : "Sign In to Dashboard"
                )}
              </Button>

              {adminExists === false && mode !== "signup" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                  onClick={() => setMode("signup")}
                >
                  Create Initial Admin Account
                </Button>
              )}

              {mode === "signup" && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white/50 hover:text-white"
                  onClick={() => setMode("login")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Button>
              )}
            </form>
          )}

          {/* FORGOT STEP 1: EMAIL INPUT */}
          {mode === "forgot_email" && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                  <Mail size={13} /> Registered Admin Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-5 text-sm"
                style={{ background: "hsl(199,89%,48%)", color: "#000" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending OTP Code...
                  </span>
                ) : (
                  "Send 6-Digit OTP Code"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-white/50 hover:text-white text-xs"
                onClick={() => setMode("login")}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Sign In
              </Button>
            </form>
          )}

          {/* FORGOT STEP 2: OTP VERIFY & NEW PASSWORD */}
          {mode === "forgot_verify" && (
            <form onSubmit={handleVerifyOTPAndReset} className="space-y-4">
              {/* Generated OTP Alert / Display Banner */}
              {generatedOtp && (
                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between text-xs"
                  style={{
                    background: "hsl(199,89%,48%,0.1)",
                    borderColor: "hsl(199,89%,48%,0.3)",
                    color: "hsl(199,89%,70%)",
                  }}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-white">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      OTP Code Generated:
                    </div>
                    <div className="font-mono text-xl font-black text-cyan-400 mt-0.5 tracking-widest">
                      {generatedOtp}
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copyOTP}
                    className="border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 text-xs"
                  >
                    <Copy size={12} className="mr-1" /> Copy & Fill
                  </Button>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                  <KeyRound size={13} /> 6-Digit OTP Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white font-mono text-center text-lg tracking-widest"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                  <Lock size={13} /> New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                  <Lock size={13} /> Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-5 text-sm"
                style={{ background: "hsl(199,89%,48%)", color: "#000" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying & Updating...
                  </span>
                ) : (
                  "Reset Password & Login"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-white/50 hover:text-white text-xs"
                onClick={() => setMode("forgot_email")}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Resend OTP
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="pt-0 justify-center">
          <button
            type="button"
            className="text-white/40 hover:text-white text-xs transition-colors cursor-pointer"
            onClick={() => navigate("/")}
          >
            ← Back to Portfolio Website
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
