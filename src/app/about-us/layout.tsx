import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Softcrayons Tech Solutions | Best IT Training Institute Noida",
  description:
    "Learn about Softcrayons Tech Solutions, the leading coding and IT training institute in Noida & Ghaziabad. Discover our mission, experienced faculty, multiple branches, and commitment to 100% placement assistance.",
  keywords: [
    "About Softcrayons",
    "About Softcrayons Tech Solutions",
    "IT Training Institute Noida",
    "Coding Institute Noida About",
    "Best IT Coaching Noida",
    "Tech Training Center Noida",
    "Softcrayons Branches",
    "Softcrayons Faculty",
  ],
  openGraph: {
    title: "About Us - Softcrayons Tech Solutions",
    description:
      "Discover Softcrayons, Noida's premier IT training institute with expert mentors, industry-focused curriculum, and 100% placement assistance.",
    url: "https://softcrayons.in/about-us",
  },
  alternates: {
    canonical: "https://softcrayons.in/about-us",
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
