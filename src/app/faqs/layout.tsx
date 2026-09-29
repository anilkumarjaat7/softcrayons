import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs - Frequently Asked Questions | Softcrayons",
  description:
    "Find answers to frequently asked questions about Softcrayons courses, admissions, fees, placements, batch timings, certification, and more. Get clarity before you enroll.",
  keywords: [
    "Softcrayons FAQ",
    "IT Training FAQ",
    "Coding Course Questions",
    "Admission Process Noida",
    "Course Fees IT Institute",
    "Placement Guarantee FAQ",
    "Batch Timing IT Course",
    "Certification Questions",
  ],
  openGraph: {
    title: "FAQs - Frequently Asked Questions | Softcrayons",
    description:
      "Find answers to common questions about courses, admissions, fees, and placements at Softcrayons.",
    url: "https://softcrayons.in/faqs",
  },
  alternates: {
    canonical: "https://softcrayons.in/faqs",
  },
};

export default function FaqsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
