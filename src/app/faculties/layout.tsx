import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Faculty - Expert Mentors & Instructors | Softcrayons",
  description:
    "Meet the expert faculty and mentors at Softcrayons Tech Solutions. Industry professionals with years of experience in software development, data science, cloud computing, and more.",
  keywords: [
    "Softcrayons Faculty",
    "IT Training Mentors Noida",
    "Expert Instructors Coding",
    "Programming Teachers Noida",
    "Best Faculty IT Institute",
    "Industry Expert Trainers",
    "Software Development Mentors",
  ],
  openGraph: {
    title: "Our Faculty - Expert Mentors | Softcrayons",
    description:
      "Meet Softcrayons' expert faculty. Industry professionals training the next generation of tech talent.",
    url: "https://softcrayons.in/faculties",
  },
  alternates: {
    canonical: "https://softcrayons.in/faculties",
  },
};

export default function FacultiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
