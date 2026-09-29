import { CoursesSection } from "@/components/CoursesSection";
import { CTASection } from "@/components/CTASection";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedPlacementsSection } from "@/components/FeaturedPlacementsSection";
import { HeroSection } from "@/components/HeroSection";
import { KnowledgeHub } from "@/components/KnowledgeHub";
import { LearningPathway } from "@/components/LearningPathway";
import { MediaPresenceSection } from "@/components/MediaPresenceSection";
import AppleCardsCarouselDemo from "@/components/apple-cards-carousel-demo";
import { PartnersSection } from "@/components/PartnersSection";
import { PlacementsMarquee } from "@/components/PlacementsMarquee";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TrustSection } from "@/components/TrustSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <CoursesSection />
        <PlacementsMarquee />
        <LearningPathway />
        <TrustSection />
        <WhyChooseUs />
        <PartnersSection />
        <MediaPresenceSection />
        <KnowledgeHub />
        <TestimonialsSection />
        <FeaturedPlacementsSection />
        <AppleCardsCarouselDemo />
        <FaqSection />
        <CTASection />
      </main>
    </div>
  );
}
