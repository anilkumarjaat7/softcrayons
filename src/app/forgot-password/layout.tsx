import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Reset Your Password",
  description:
    "Forgot your Softcrayons account password? Enter your email to receive a password reset link.",
  openGraph: {
    title: "Forgot Password | Softcrayons Tech Solutions",
    description: "Reset your Softcrayons account password.",
    url: "https://softcrayons.in/forgot-password",
  },
  alternates: {
    canonical: "https://softcrayons.in/forgot-password",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
