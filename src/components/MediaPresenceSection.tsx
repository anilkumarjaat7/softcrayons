import Link from "next/link";
import { SectionHeader } from "@/components/public-ui";

const mediaMentions = [
  {
    brand: "Nucamp",
    logo: "https://www.nucamp.co/assets/imgs/nucamp-logotype-only-color-vector.svg",
    title: "Will AI Replace Finance Jobs in Myanmar? Here's What to Do in 2025",
    href: "#",
  },
  {
    brand: "Op-Ed Moped",
    logo: "	https://opedmoped.com/wp-content/uploads/2022/03/9.jpg",
    title: "Vaibhav Kakkar on IIM SKILLS: Industry-Relevant Training for Career Success",
    href: "#",
  },
  {
    brand: "Mid-day",
    logo: "https://static.mid-day.com/assets/images/logo.png",
    title: "Top 5 Best Financial Modeling and Valuation Courses for Investment Banking in India",
    href: "#",
  },
  {
    brand: "Jagran Josh",
    logo: "https://tse4.mm.bing.net/th/id/OIP.Bc-Jco4DF6srzm9vn7FOUwHaEj?w=780&h=480&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "List of CAT Crash Courses to Pursue in 2024",
    href: "#",
  },
];

export function MediaPresenceSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow="Media"
          title={<>Media <span className="text-gradient">presence</span></>}
          description="A growing footprint across education, technology, and career conversations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {mediaMentions.map((item) => (
            <Link
              key={item.brand}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group brand-panel brand-card-hover rounded-md overflow-hidden"
            >
              <div className="h-36 bg-background flex items-center justify-center p-8 border-b border-border/70">
                <img
                  src={item.logo}
                  alt={item.brand}
                  className="max-h-14 w-auto object-contain"
                />
              </div>
              <div className="min-h-[176px] bg-muted/45 px-6 py-7 flex items-center justify-center">
                <p className="text-center font-bold text-foreground/90 leading-snug">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
