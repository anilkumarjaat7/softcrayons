import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses - Best IT & Coding Courses in Noida | Softcrayons",
  description:
    "Explore industry-focused IT courses at Softcrayons. Full Stack Development, Python, Java, React, Data Science, AI/ML, Cloud Computing, DevOps & more. Hands-on training with live projects and 100% placement assistance in Noida & Ghaziabad.",
  keywords: [
    "IT Courses Noida",
    "Coding Courses Noida",
    "Full Stack Development Course",
    "Python Course Noida",
    "Java Course Noida",
    "React JS Training Noida",
    "Data Science Course Noida",
    "Machine Learning Course Noida",
    "DevOps Training Noida",
    "Cloud Computing Course Noida",
    "Web Development Course Noida",
    "Best Programming Courses Noida",
    "Software Training Noida",
    "Placement Guarantee Courses",
    "Job Oriented Courses Noida",
  ],
  openGraph: {
    title: "Courses - Best IT & Coding Courses in Noida | Softcrayons",
    description:
      "Industry-focused IT and coding courses with hands-on training, live projects, and 100% placement assistance at Softcrayons Noida.",
    url: "https://softcrayons.in/courses",
  },
  alternates: {
    canonical: "https://softcrayons.in/courses",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
