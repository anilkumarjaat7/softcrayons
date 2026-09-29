"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Mail,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Code,
  Rocket,
  Zap,
  RefreshCw,
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");
    if (!storedEmail) {
      router.push("/sign-in");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError("");
    setResendSuccess(false);

    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/sign-in",
      });

      if (result.error) {
        setError(result.error.message || "Failed to resend verification email");
        setIsLoading(false);
        return;
      }

      setResendSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
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

      <div className="absolute top-20 left-[10%] animate-float hidden lg:block">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
      </div>
      <div
        className="absolute bottom-32 left-[15%] animate-float hidden lg:block"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
          <Code className="w-6 h-6 text-white" />
        </div>
      </div>
      <div
        className="absolute top-40 right-[12%] animate-float hidden lg:block"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
          <Rocket className="w-8 h-8 text-white" />
        </div>
      </div>
      <div
        className="absolute bottom-40 right-[18%] animate-float hidden lg:block"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-fade-up mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-3xl sm:text-4xl font-black mb-4">
              Verify your <span className="text-gradient">email</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              We&apos;ve sent a verification link to
            </p>
            <p className="text-foreground font-semibold text-lg mb-8">
              {email}
            </p>
          </div>

          <div
            className="animate-fade-up space-y-6"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 text-left">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Check your inbox</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email we sent to verify your account
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Check spam folder</h3>
                  <p className="text-sm text-muted-foreground">
                    If you don&apos;t see it, check your spam or junk folder
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {resendSuccess && (
              <Alert className="border-green-500 bg-green-500/10">
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Verification email sent successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email?
              </p>
              <Button
                onClick={handleResendVerification}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>
            </div>

            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
