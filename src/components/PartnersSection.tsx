"use client";

import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/public-ui";

const partners = [
  {
    name: "Pearson",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Pearson_plc_2025.svg/250px-Pearson_plc_2025.svg.png",
  },
  {
    name: "SAP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  },
  {
    name: "Google Cloud",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
  },
  {
    name: "AWS",
    logo: "https://svgstack.com/media/img/amazon-aws-logo_1735162417.webp",
  },
  {
    name: "Kryterion",
    logo: "https://www.kryterion.com/wp-content/uploads/2022/07/Logo-kryterion@2x.png",
  },
  {
    name: "ACT",
    logo: "https://www.actcorp.in/themes/custom/actcorp/logo.svg",
  },
  {
    name: "LanguageCert",
    logo: "https://www.languagecert.org/-/media/images/languagecert-logotypes-2024/lc_logotypes/header-languagecertcolor1x-1/lc-logo-481x75px.ashx",
  },
  {
    name: "Skills For English",
    logo: "https://skillsforenglish.com/wp-content/uploads/2023/09/Skills-for-English-SELT-logo-nav.png",
  },
  {
    name: "Salesforce",
    logo: "https://svgstack.com/media/img/salesforce-logo-2N6P664928.webp",
  },
  {
    name: "Oracle",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "ISO",
    logo: "https://cdn-icons-png.flaticon.com/512/11540/11540688.png",
  },
];

export function PartnersSection() {
  return (
    <section className="py-24 bg-muted/45">
      <div className="container">
        <SectionHeader
          eyebrow="Partners"
          title={<>SoftCrayons <span className="text-gradient">global partners</span></>}
          description={
            <>
            We are proud to partner with world-leading technology and certification organizations.
            </>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className={cn(
                "group relative brand-panel brand-card-hover rounded-md p-6 flex items-center justify-center",
                "h-24 sm:h-28"
              )}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 sm:max-h-12 w-auto object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
              />
              
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-foreground text-background text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap">
                  {partner.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
