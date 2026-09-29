import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become an Instructor - Join Our Teaching Team",
  description:
    "Join Softcrayons as an instructor and share your tech expertise. Apply to become a mentor in Full Stack Development, Python, Java, Data Science, Cloud Computing, and more.",
  keywords: [
    "Become Instructor Softcrayons",
    "IT Teaching Jobs Noida",
    "Tech Instructor Jobs",
    "Programming Mentor",
    "Teaching at Softcrayons",
    "Coding Instructor Noida",
  ],
  openGraph: {
    title: "Become an Instructor | Softcrayons Tech Solutions",
    description:
      "Join Softcrayons as an instructor and help shape the next generation of tech professionals.",
    url: "https://softcrayons.in/instructor",
  },
  alternates: {
    canonical: "https://softcrayons.in/instructor",
  },
};

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
