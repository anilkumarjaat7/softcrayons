"use client";

import { CheckCircle2, GraduationCap, Sparkles, Users } from "lucide-react";
import Link from "next/link";

const technologies = [
  { name: "Java", icon: "☕", className: "tech-java" },
  { name: "React", icon: "⚛", className: "tech-react" },
  { name: "Node.js", icon: "⬢", className: "tech-node" },
  { name: "Python", icon: "🐍", className: "tech-python" },
  { name: "AI", icon: "✦", className: "tech-ai" },
  { name: "AWS", icon: "☁", className: "tech-aws" },
];

const benefits = [
  "Live mentor-led classes",
  "Real-world projects",
  "Interview preparation",
  "Placement guidance",
];

type TutorialTopic = {
  title: string;
  slug: string;
};

export function HeroSection({
  tutorialTopics = [],
}: {
  tutorialTopics?: TutorialTopic[];
}) {
  const marqueeTopics = [...tutorialTopics, ...tutorialTopics];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />

        <div
          className="absolute right-[10%] top-[20%] h-80 w-80 rounded-full bg-secondary/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      {tutorialTopics.length > 0 && (
        <div className="absolute inset-x-0 top-14 z-20 overflow-hidden border-y border-border/60 bg-card/75  pt-5">
          <div className="container overflow-hidden py-2.5">
            <div
              className="flex w-max animate-marquee items-center gap-3 [--gap:0.75rem]"
              style={{
                animationDuration: `${Math.max(24, tutorialTopics.length * 6)}s`,
              }}
            >
              {marqueeTopics.map((topic, index) => (
                <Link
                  key={`${topic.slug}-${index}`}
                  href={`/tutorials/${topic.slug}`}
                  className="shrink-0 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container relative z-10 flex min-h-[calc(100vh-6rem)] items-center py-16">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary animate-[fadeInUp_0.7s_ease-out]">
              <Sparkles className="h-4 w-4" />
              Learn. Build. Get Job Ready.
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            </div>

            {/* Heading */}
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              Build Your
              <span className="block">
                <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                  Tech Career
                </span>

                <span className="ml-3 inline-block animate-bounce">🚀</span>
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
              Learn Java, MERN, Python, Cloud, DevOps and Generative AI through
              practical projects, expert mentorship and career-focused training.
            </p>

            {/* CTA */}
            {/* <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/query">
                <Button
                  size="lg"
                  className="group h-12 w-full px-7 bg-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                >
                  Book Free Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full px-7 transition-all duration-300 hover:-translate-y-1 sm:w-auto"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
              </Link>
            </div> */}

            {/* Benefits */}
            <div className="mx-auto mt-9 grid max-w-2xl grid-cols-2 gap-3 lg:mx-0 lg:grid-cols-4">
              {benefits.map((item, index) => (
                <div
                  key={item}
                  className="group flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-3 text-left text-sm font-medium backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${0.3 + index * 0.1}s both`,
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary transition-transform group-hover:scale-110" />

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          {/* RIGHT */}
          {/* RIGHT */}
          <div className="relative mx-auto w-full max-w-xl">
            {/* Soft Glow Behind Image */}
            <div className="pointer-events-none absolute inset-10 rounded-full bg-primary/15 blur-3xl animate-pulse" />

            {/* Hero Image */}
            <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
              <img
                src="/hero.webp"
                alt="Students learning technology"
                width={900}
                height={900}
                className="relative z-10 mx-auto h-auto w-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Mentor Card */}
            <div className="absolute -left-6 top-16 z-20 hidden rounded-2xl border border-border/60 bg-background/90 p-4 shadow-xl backdrop-blur md:block animate-[floatSlow_5s_ease-in-out_infinite]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>

                {/* <div>
                  <p className="text-xs text-muted-foreground">
                    Expert Mentors
                  </p>

                  <p className="font-bold">Live Classes</p>
                </div> */}
              </div>
            </div>

            {/* Community Card */}
            <div
              className="absolute -right-6 bottom-20 z-20 hidden rounded-3xl border border-border/60 bg-background/90 p-4 shadow-xl backdrop-blur md:block animate-[floatSlow_6s_ease-in-out_infinite]"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Community</p>

                  <p className="font-bold">Learn Together</p>
                </div>
              </div>
            </div>

            {/* Placement Badge */}
            <div className="absolute right-6 top-6 z-20 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-xl backdrop-blur animate-[floatSlow_4s_ease-in-out_infinite]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Career Focus</p>

                  <p className="font-bold">Job Ready 🚀</p>
                </div>
              </div>
            </div>

            {/* Technology Pills */}
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className={`absolute z-20 hidden items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2 text-xs font-bold shadow-lg backdrop-blur sm:flex ${tech.className}`}
                style={{
                  animation: `floatTech ${
                    4 + index * 0.5
                  }s ease-in-out infinite`,
                  animationDelay: `${index * 0.4}s`,
                }}
              >
                <span className="text-base">{tech.icon}</span>

                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="container relative z-10 pb-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-border rounded-2xl border border-border/60 bg-card/50 py-5 backdrop-blur md:grid-cols-4">
          <Stat number="10+" label="Tech Courses" />
          <Stat number="50+" label="Real Projects" />
          <Stat number="1000+" label="Learners" />
          <Stat number="24/7" label="Learning Support" />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes floatTech {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }

          to {
            width: 78%;
          }
        }

        .tech-java {
          left: -15px;
          top: 38%;
        }

        .tech-react {
          right: 5px;
          top: 8%;
        }

        .tech-node {
          right: -20px;
          top: 42%;
        }

        .tech-python {
          left: 15px;
          bottom: 18%;
        }

        .tech-ai {
          right: 20%;
          bottom: 5%;
        }

        .tech-aws {
          left: 30%;
          top: -10px;
        }
      `}</style>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="px-4 text-center">
      <div className="text-2xl font-black text-primary sm:text-3xl">
        {number}
      </div>

      <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
        {label}
      </div>
    </div>
  );
}

// OLD HERO SECTION

// "use client";

// import {
//   ArrowRight,
//   BookOpen,
//   CheckCircle2,
//   PhoneCall,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Marquee } from "@/components/ui/marquee";
// import Link from "next/link";

// const TECH_CHIPS = [
//   {
//     name: "Java",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
//   },
//   {
//     name: "Python",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
//   },
//   {
//     name: "React",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
//   },
//   {
//     name: "AWS",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
//   },
//   {
//     name: "Docker",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
//   },
//   {
//     name: "Node.js",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
//   },
//   {
//     name: "Angular",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
//   },
//   {
//     name: "GenAI",
//     src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
//   },
//   { name: "Cloud", src: "https://cdn.simpleicons.org/googlecloud/4285F4" },
//   { name: "AutoCAD", src: "https://cdn.simpleicons.org/autodesk/0696D7" },
//   {
//     name: "Graphics",
//     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
//   },
//   { name: "DevOps", src: "https://cdn.simpleicons.org/githubactions/2088FF" },
// ];

// const wins = [
//   "Live mentor-led classes",
//   "Project portfolio",
//   "Interview practice",
//   "Placement support",
// ];

// export function HeroSection() {
//   return (
//     <section className="brand-section relative min-h-screen overflow-hidden pt-24">
//       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
//       <div className="container relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-center py-14">
//         <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
//           <div className="max-w-3xl text-center lg:text-left">
//             <span className="brand-eyebrow animate-fade-up">
//               Noida and Ghaziabad #1 Tech Institute
//             </span>

//             <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up">
//               We Guarantee Your <span className="text-gradient">Placement</span>
//             </h1>

//             <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0 animate-fade-up">
//               Practical IT courses, expert mentors, live projects, and
//               placement-focused guidance for learners who want a real career
//               path.
//             </p>

//             <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start animate-fade-up">
//               <Link href="/query" className="w-full sm:w-auto">
//                 <Button
//                   size="lg"
//                   className="w-full group bg-secondary hover:bg-secondary/90"
//                 >
//                   Book Free Demo Class
//                   <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//               <Link href="/courses" className="w-full sm:w-auto">
//                 <Button variant="outline" size="lg" className="w-full">
//                   <BookOpen className="h-5 w-5" />
//                   Explore Courses
//                 </Button>
//               </Link>
//             </div>

//             <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-up">
//               {wins.map((win) => (
//                 <div
//                   key={win}
//                   className="flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3 py-2 text-left text-sm font-semibold shadow-sm"
//                 >
//                   <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" />
//                   <span>{win}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative mx-auto w-full max-w-xl animate-fade-up">
//             <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/12 via-transparent to-secondary/16 blur-2xl" />
//             <div className="brand-panel relative overflow-hidden rounded-lg p-3">
//               <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
//                 <img
//                   src="hero.webp"
//                   alt="SoftCrayons classroom and mentors"
//                   className="h-full w-full object-cover object-center"
//                 />
//               </div>

//               <div className="mt-3 grid gap-3 sm:absolute sm:left-6 sm:right-6 sm:bottom-6 sm:mt-0 sm:grid-cols-2">
//                 <div className="rounded-md border border-white/40 bg-white/90 p-3 shadow-lg backdrop-blur sm:p-4">
//                   <div className="flex items-center gap-1 text-secondary">
//                     {[...Array(5)].map((_, index) => (
//                       <Star key={index} className="h-4 w-4 fill-current" />
//                     ))}
//                   </div>
//                   <p className="mt-2 text-sm font-black text-primary">
//                     Best Rated Teachers in Noida & Ghaziabad
//                   </p>
//                 </div>
//                 <Link
//                   href="tel:+918545012345"
//                   className="rounded-md border border-white/40 bg-primary p-3 text-primary-foreground shadow-lg transition hover:bg-primary/90 sm:p-4"
//                 >
//                   <div className="flex items-center gap-2 text-sm font-bold">
//                     <PhoneCall className="h-4 w-4" />
//                     Call for admission
//                   </div>
//                   <p className="mt-1 text-base font-black sm:text-lg">
//                     +91 85450 12345
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative z-10 border-y border-white/10 bg-[hsl(var(--brand-navy))] py-6 text-white">
//         <div className="mb-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white/65">
//           Technologies learners master here
//         </div>
//         <Marquee pauseOnHover duration={42} className="[--gap:1rem]">
//           {TECH_CHIPS.map((tech) => (
//             <div
//               key={tech.name}
//               className="flex min-w-[180px] items-center justify-center gap-3 rounded-md border border-white/10 bg-white/10 px-5 py-3"
//             >
//               <img src={tech.src} alt={tech.name} className="h-6 w-6" />
//               <span className="font-bold">{tech.name}</span>
//             </div>
//           ))}
//         </Marquee>
//       </div>
//     </section>
//   );
// }
