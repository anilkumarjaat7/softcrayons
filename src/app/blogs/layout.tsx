import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs - Tech Articles & Tutorials | Softcrayons",
  description:
    "Read the latest tech blogs, coding tutorials, career guides, and industry insights from Softcrayons Tech Solutions. Stay updated on programming, AI, cloud computing, and more.",
  keywords: [
    "Tech Blogs",
    "Coding Tutorials",
    "Programming Articles",
    "IT Training Blog",
    "Learn Coding Online",
    "Technology News",
    "Career Guides IT",
    "Softcrayons Blog",
    "Full Stack Development Tutorial",
    "Python Tutorial",
    "Java Tutorial",
  ],
  openGraph: {
    title: "Blogs - Tech Articles & Tutorials | Softcrayons",
    description:
      "Read the latest tech blogs, coding tutorials, and industry insights from Softcrayons Tech Solutions.",
    url: "https://softcrayons.in/blogs",
  },
  alternates: {
    canonical: "https://softcrayons.in/blogs",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
