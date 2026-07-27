import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      setIsAdmin(!!data);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer any Supabase call out of the auth callback to avoid deadlocks
          setTimeout(() => {
            checkAdmin(session.user.id).finally(() => setLoading(false));
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await checkAdmin(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Check if any admin already exists
    const { count } = await supabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });
    
    if (count && count > 0) {
      throw new Error("Admin registration is closed. Only one admin is allowed.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("Signup failed. Please try again.");
    }

    // Sign in immediately to get an authenticated session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    // Now insert admin_users entry (RLS allows first admin insert)
    const { error: insertError } = await supabase
      .from("admin_users")
      .insert({ id: data.user.id, email });
    
    if (insertError) {
      await supabase.auth.signOut();
      throw new Error("Failed to create admin account. Please try again.");
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Verify user is admin
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!adminData) {
      await supabase.auth.signOut();
      throw new Error("You are not authorized as admin.");
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // OTP Password Reset Helpers
  const sendPasswordResetOTP = async (email: string) => {
    // 1. Verify admin email exists
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email.trim())
      .maybeSingle();

    if (!adminData) {
      throw new Error("No registered admin user found with this email.");
    }

    // 2. Trigger Supabase reset email (if SMTP configured)
    await supabase.auth.resetPasswordForEmail(email.trim()).catch(() => {});

    // 3. Generate 6-digit OTP code & store in session with 10min expiry
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    sessionStorage.setItem(`otp_${email.trim()}`, JSON.stringify({ code: otpCode, expiresAt }));

    return { otpCode };
  };

  const verifyOTPAndResetPassword = async (email: string, enteredOtp: string, newPassword: string) => {
    const trimmedEmail = email.trim();
    const trimmedOtp = enteredOtp.trim();

    // Check stored OTP code
    const storedData = sessionStorage.getItem(`otp_${trimmedEmail}`);
    let isValidOtp = false;

    if (storedData) {
      const { code, expiresAt } = JSON.parse(storedData);
      if (Date.now() < expiresAt && code === trimmedOtp) {
        isValidOtp = true;
      }
    }

    // Try Supabase OTP verification as fallback
    if (!isValidOtp) {
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: trimmedOtp,
        type: "recovery",
      });
      if (!otpError) isValidOtp = true;
    }

    if (!isValidOtp) {
      throw new Error("Invalid or expired 6-digit OTP code. Please check and try again.");
    }

    // If session is present, update user password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      // If no active session, sign in or notify user
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    // Clear OTP
    sessionStorage.removeItem(`otp_${trimmedEmail}`);
    return true;
  };

  const updateUserPassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    sendPasswordResetOTP,
    verifyOTPAndResetPassword,
    updateUserPassword,
  };
};
