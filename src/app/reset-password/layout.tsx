import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Set a New Password",
  description:
    "Set a new password for your Softcrayons account.",
  openGraph: {
    title: "Reset Password | Softcrayons Tech Solutions",
    description: "Set a new password for your Softcrayons account.",
    url: "https://softcrayons.in/reset-password",
  },
  alternates: {
    canonical: "https://softcrayons.in/reset-password",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
