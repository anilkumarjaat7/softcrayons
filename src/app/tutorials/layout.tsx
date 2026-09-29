import type { ReactNode } from "react";
import { TutorialsNavbar } from "@/components/tutorials/TutorialsNavbar";
import { fetchServerApi } from "@/lib/server-api";

type NavbarTopic = {
  title: string;
  slug: string;
};

type NavbarResponse = {
  success: boolean;
  data: NavbarTopic[];
  error?: string;
};

async function getNavbarTopics() {
  const response = await fetchServerApi<NavbarResponse>("/api/tutorials/navbar-topics?limit=4", {
    next: { revalidate: 600 },
  });

  if (!response.success) {
    throw new Error(response.error || "Failed to fetch tutorial navbar topics");
  }

  return response.data;
}

export default async function TutorialsLayout({ children }: { children: ReactNode }) {
  const featuredTopics = await getNavbarTopics();

  return (
    <>
      <TutorialsNavbar featuredTopics={featuredTopics} />
      {children}
    </>
  );
}
