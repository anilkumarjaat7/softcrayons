import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  courses: [
    { name: "Web Development", href: "/courses?category=web-development" },
    { name: "Machine Learning", href: "/courses?category=data-science" },
    { name: "DevOps", href: "/courses?category=devops" },
    { name: "Mobile Development", href: "/courses?category=mobile-development" },
  ],
  company: [
    { name: "About Us", href: "/about-us" },
    { name: "Faculties", href: "/faculties" },
    { name: "Blog", href: "/blogs" },
    { name: "Contact", href: "/query" },
  ],
  support: [
    { name: "Courses", href: "/courses" },
    { name: "Placements", href: "/placements" },
    { name: "FAQs", href: "/faqs" },
    { name: "Reviews", href: "/reviews" },
  ],
  legal: [
    { name: "Enterprise Hiring", href: "/enterprise" },
    { name: "Join as Instructor", href: "/instructor" },
    { name: "Admission Query", href: "/query" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/softcrayons", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/TechSoftcrayons", label: "X" },
  { icon: Instagram, href: "https://www.instagram.com/softcrayons", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/softcrayons-it-education", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[hsl(var(--brand-navy))] text-white">
      <div className="relative z-10 w-full px-6 pt-16 pb-8 sm:px-10 lg:px-16 lg:pt-20 lg:pb-10 xl:px-24">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6 lg:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-18">
                <Image
                  src="/logo.png"
                  alt="Soft Crayons Logo"
                  width={160}
                  height={32}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/65 text-sm mb-6 max-w-xs">
              Practical IT training, expert mentorship, and placement-focused guidance for ambitious learners.
            </p>
            <div className="flex gap-5 text-white/70">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center text-inherit transition-colors duration-300 ease-out hover:text-secondary"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-300 ease-out hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-300 ease-out hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-300 ease-out hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white">More</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-300 ease-out hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none select-none mt-14 overflow-hidden sm:mt-24">
          <p className="font-heading text-center text-[clamp(2.75rem,12vw,14rem)] leading-none font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-secondary-foreground/[0.22] via-secondary-foreground/[0.12] to-secondary-foreground/[0.03]">
            SOFTCRAYONS
          </p>
        </div>
      </div>
    </footer>
  );
}
