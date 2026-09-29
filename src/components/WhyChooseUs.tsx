import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/public-ui";

const highlights = [
  "100% Placement Assistance",
  "15+ Years Industry Expert Trainers",
  "Hands-On Projects & Real-World Use Cases",
  "AI-Personalized Learning Paths",
  "40+ Industry-Relevant Courses",
  "Global Certifications",
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-muted/45 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center max-w-6xl mx-auto">
          <div className="relative flex items-center justify-center animate-fade-up min-h-[320px] sm:min-h-[420px]">
            <img
                src="https://i.ibb.co/wZh2B6P5/07.png"
                alt="Softcrayons learner"
                className="w-[78%] max-w-[360px] sm:max-w-[430px] h-auto object-contain"
              />
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.12s" }}>

            <SectionHeader
              align="left"
              eyebrow="Why SoftCrayons"
              title={<>Built for <span className="text-gradient">job-ready learning</span></>}
              description="SoftCrayons delivers practical, career-focused training with mentorship, live projects, and deep placement support so learners become job-ready with confidence."
              className="mb-8"
            />

            <ul className="mb-9 space-y-5 list-none p-0">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-4 text-foreground">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-white shadow-[0_8px_18px_hsl(var(--secondary)/0.25)]">
                    <ChevronRight className="h-5 w-5" />
                  </span>
                  <span className="text-lg sm:text-[1.1rem] font-semibold leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
