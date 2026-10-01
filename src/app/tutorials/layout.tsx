import type { ReactNode } from "react";
import { TutorialsNavbar } from "@/components/tutorials/TutorialsNavbar";
import { getPublicTutorialNavbarTopics } from "@/services/tutorial-public.service";

async function getNavbarTopics() {
  return getPublicTutorialNavbarTopics(4);
}

export default async function TutorialsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const featuredTopics = await getNavbarTopics();

  return (
    <>
      <TutorialsNavbar featuredTopics={featuredTopics} />
      {children}
    </>
  );
}
