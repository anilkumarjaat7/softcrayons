import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placements - Our Students' Success Stories | Softcrayons",
  description:
    "See placement records of Softcrayons students at top MNCs and tech companies. 100% placement assistance with industry partnerships across Noida, Delhi NCR & beyond.",
  keywords: [
    "Placement Records Noida",
    "IT Training Placements",
    "100% Placement Assistance",
    "Softcrayons Placements",
    "Job Placement Noida",
    "Campus Placement IT Institute",
    "Placed Students Softcrayons",
    "IT Jobs After Training",
    "Coding Bootcamp Placements Noida",
  ],
  openGraph: {
    title: "Placements - Student Success Stories | Softcrayons",
    description:
      "Explore placement records of Softcrayons students placed at top tech companies with 100% placement assistance.",
    url: "https://softcrayons.in/placements",
  },
  alternates: {
    canonical: "https://softcrayons.in/placements",
  },
};

export default function PlacementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
