"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  KeyRound,
  Link2,
  BookOpen,
  Code,
  Rocket,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SignInMethod = "password" | "otp" | "magic-link";

const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data.exists === true;
  } catch {
    return false;
  }
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [activeMethod, setActiveMethod] = useState<SignInMethod>("password");

  const showSuccessToast = (message: string) => {
    toast.success(message);
  };

  const showErrorToast = (message: string) => {
    toast.error(message);
  };

  const resetStates = () => {
    setOtpSent(false);
    setMagicLinkSent(false);
    setOtp("");
  };

  const handleMethodChange = (method: string) => {
    setActiveMethod(method as SignInMethod);
    resetStates();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        if (
          result.error.message?.toLowerCase().includes("email") &&
          result.error.message?.toLowerCase().includes("verif")
        ) {
          sessionStorage.setItem("verifyEmail", email);
          router.push("/verify-email");
          return;
        }
        showErrorToast(result.error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      showSuccessToast("Signed in successfully!");
      router.push("/dashboard/admin");
      router.refresh();
    } catch {
      showErrorToast("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showErrorToast("Please enter your email address");
      return;
    }
    setIsLoading(true);

    try {
      const exists = await checkUserExists(email);
      if (!exists) {
        showErrorToast("No account found with this email. Please contact admin.");
        setIsLoading(false);
        return;
      }

      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        showErrorToast(result.error.message || "Failed to send OTP");
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      showSuccessToast("OTP sent to your email!");
    } catch {
      showErrorToast("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      showErrorToast("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);

    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (result.error) {
        showErrorToast(result.error.message || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      showSuccessToast("Signed in successfully!");
      router.push("/dashboard/admin");
      router.refresh();
    } catch {
      showErrorToast("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showErrorToast("Please enter your email address");
      return;
    }
    setIsLoading(true);

    try {
      const exists = await checkUserExists(email);
      if (!exists) {
        showErrorToast("No account found with this email. Please contact admin.");
        setIsLoading(false);
        return;
      }

      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: "/dashboard/admin",
      });

      if (result.error) {
        showErrorToast(result.error.message || "Failed to send magic link");
        setIsLoading(false);
        return;
      }

      setMagicLinkSent(true);
      showSuccessToast("Magic link sent! Check your email to sign in.");
    } catch {
      showErrorToast("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              Sign In to visit your{" "}
              <span className="text-gradient">dashboards</span>
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred sign-in method
            </p>
          </div>

          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Tabs
              value={activeMethod}
              onValueChange={handleMethodChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
                <TabsTrigger
                  value="password"
                  className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Password</span>
                </TabsTrigger>
                <TabsTrigger
                  value="otp"
                  className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">OTP</span>
                </TabsTrigger>
                <TabsTrigger
                  value="magic-link"
                  className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Magic Link</span>
                </TabsTrigger>
              </TabsList>

              <div className="min-h-[320px]">
                <TabsContent value="password" className="mt-0">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-password">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-password"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 bg-background/50 backdrop-blur-sm"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 pr-9 bg-background/50 backdrop-blur-sm"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                    <div className="text-center pt-2">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="otp" className="mt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-otp">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-otp"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 bg-background/50 backdrop-blur-sm"
                          required
                          disabled={isLoading || otpSent}
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter 6-digit OTP</Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(/\D/g, "").slice(0, 6)
                              )
                            }
                            className="pl-9 text-center text-lg tracking-widest bg-background/50 backdrop-blur-sm"
                            maxLength={6}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    )}

                    {!otpSent && <div className="h-[76px]" />}

                    {otpSent ? (
                      <>
                        <Button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="w-full bg-primary hover:opacity-90 transition-opacity"
                          disabled={isLoading || otp.length !== 6}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP & Sign In"
                          )}
                        </Button>
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                            }}
                            className="text-sm text-primary hover:underline"
                          >
                            Change email or resend OTP
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={handleSendOtp}
                          className="w-full bg-primary hover:opacity-90 transition-opacity"
                          disabled={isLoading || !email}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Send OTP
                            </>
                          )}
                        </Button>
                        <div className="h-[36px]" />
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="magic-link" className="mt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-magic">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-magic"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 bg-background/50 backdrop-blur-sm"
                          required
                          disabled={isLoading || magicLinkSent}
                        />
                      </div>
                    </div>

                    {magicLinkSent ? (
                      <div className="text-center space-y-4 py-4">
                        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">
                            Check your email!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            We sent a magic link to <strong>{email}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMagicLinkSent(false);
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          Use a different email
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="h-[76px]" />
                        <Button
                          type="button"
                          onClick={handleMagicLink}
                          className="w-full bg-primary hover:opacity-90 transition-opacity"
                          disabled={isLoading || !email}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending link...
                            </>
                          ) : (
                            <>
                              <Link2 className="mr-2 h-4 w-4" />
                              Send Magic Link
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground pt-2">
                          We&apos;ll send a secure sign-in link to your email
                        </p>
                      </>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div
              className="text-center mt-6 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-sm text-muted-foreground">
                If you don&apos;t have an account?{" "}
                <Link
                  href="/query"
                  className="text-primary font-medium hover:underline"
                >
                  Click to Join Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
