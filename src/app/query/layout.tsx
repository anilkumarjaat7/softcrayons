import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquiry - Get in Touch With Us",
  description:
    "Have questions about our IT courses, admissions, or placements? Fill out the enquiry form and our team at Softcrayons will get back to you shortly.",
  keywords: [
    "Softcrayons Enquiry",
    "Contact Softcrayons",
    "IT Course Enquiry Noida",
    "Admission Enquiry",
    "Course Registration",
    "IT Training Enquiry",
  ],
  openGraph: {
    title: "Enquiry - Get in Touch With Us | Softcrayons",
    description:
      "Have questions about our IT courses, admissions, or placements? Reach out to Softcrayons today.",
    url: "https://softcrayons.in/query",
  },
  alternates: {
    canonical: "https://softcrayons.in/query",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function QueryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
