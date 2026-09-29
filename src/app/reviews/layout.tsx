import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Reviews & Testimonials | Softcrayons",
  description:
    "Read genuine reviews and testimonials from Softcrayons students. See how our IT training and coding courses have transformed careers and helped students land top tech jobs.",
  keywords: [
    "Softcrayons Reviews",
    "Student Testimonials IT Training",
    "Coding Institute Reviews Noida",
    "IT Training Reviews",
    "Best Coaching Reviews Noida",
    "Student Feedback Softcrayons",
    "Training Institute Ratings",
  ],
  openGraph: {
    title: "Student Reviews & Testimonials | Softcrayons",
    description:
      "Read genuine reviews from our students about their learning experience at Softcrayons Tech Solutions.",
    url: "https://softcrayons.in/reviews",
  },
  alternates: {
    canonical: "https://softcrayons.in/reviews",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
