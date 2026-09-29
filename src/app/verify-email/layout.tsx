import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - Confirm Your Account",
  description:
    "Verify your email address to activate your Softcrayons account and start learning.",
  openGraph: {
    title: "Verify Email | Softcrayons Tech Solutions",
    description: "Verify your email to activate your Softcrayons account.",
    url: "https://softcrayons.in/verify-email",
  },
  alternates: {
    canonical: "https://softcrayons.in/verify-email",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
