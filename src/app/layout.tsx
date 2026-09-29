import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppChrome } from "@/components/AppChrome";
import { AuthProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const SITE_URL = "https://softcrayons.in";
const SITE_NAME = "Softcrayons Tech Solutions";
const SITE_DESCRIPTION =
  "Softcrayons - No.1 Coding & IT Training Institute in Noida & Ghaziabad. Industry-focused courses in Full Stack Development, React, Python, Java, Data Science, Cloud Computing, DevOps, AI/ML & more. 100% placement assistance, expert mentors, live projects.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Softcrayons - Best Coding & IT Training Institute in Noida | Skill Development Courses",
    template: "%s | Softcrayons Tech Solutions",
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  keywords: [
    "Softcrayons",
    "Softcrayons Tech Solutions",
    "Soft Crayons",

    "Coding Institute in Noida",
    "Coding Institute in Ghaziabad",
    "IT Training Institute in Noida",
    "IT Training Institute in Ghaziabad",
    "Tech Institute in Noida",
    "Tech Institute in Ghaziabad",
    "Best Coaching in Noida",
    "Best Coaching in Ghaziabad",
    "Skill Development Institute",
    "Skill Development Courses",
    "Tech Training Institute Noida",
    "Computer Training Institute Noida",
    "Software Training Institute Noida",
    "Programming Classes Noida",
    "Coding Classes Noida",
    "Coding Classes Ghaziabad",
    "Best Coding Bootcamp Noida",
    "Best IT Coaching Noida",
    "Best IT Coaching Ghaziabad",

    "Full Stack Development Course Noida",
    "MERN Stack Training Noida",
    "React JS Training Noida",
    "Node JS Training Noida",
    "Next JS Course Noida",
    "JavaScript Training Noida",
    "Python Training Institute Noida",
    "Python Course Noida",
    "Java Training Institute Noida",
    "Java Course Noida",
    "C++ Programming Course Noida",
    "Data Structures and Algorithms Course Noida",
    "DSA Training Noida",
    "Data Science Training Noida",
    "Data Science Course Noida",
    "Machine Learning Course Noida",
    "Artificial Intelligence Course Noida",
    "AI ML Training Noida",
    "Cloud Computing Training Noida",
    "AWS Training Noida",
    "Azure Training Noida",
    "DevOps Training Noida",
    "DevOps Course Noida",
    "Cyber Security Course Noida",
    "Digital Marketing Course Noida",
    "UI UX Design Course Noida",
    "Frontend Development Course Noida",
    "Backend Development Course Noida",
    "Web Development Training Noida",
    "App Development Training Noida",
    "Mobile App Development Course Noida",
    "Flutter Training Noida",
    "React Native Course Noida",
    "Angular Training Noida",
    "PHP Training Noida",
    "WordPress Training Noida",
    "SQL Training Noida",
    "Database Training Noida",
    "MongoDB Training Noida",
    "Docker Kubernetes Training Noida",
    "Blockchain Training Noida",
    "Power BI Training Noida",
    "Tableau Training Noida",
    "Software Testing Course Noida",
    "Automation Testing Training Noida",
    "Manual Testing Course Noida",
    "Selenium Training Noida",
    "API Testing Course Noida",

    "Placement Guarantee Course Noida",
    "100 Percent Placement Assistance Noida",
    "Job Oriented Courses Noida",
    "Job Ready Training Noida",
    "Career Oriented Courses Noida",
    "IT Jobs Training Noida",
    "Campus Placement Training Noida",
    "Internship Training Noida",
    "Live Project Training Noida",
    "Industrial Training Noida",
    "Summer Training Noida",
    "Winter Training Noida",

    "Best Institute for BCA Students Noida",
    "Best Institute for MCA Students Noida",
    "Best Institute for BTech Students Noida",
    "Best Institute for Engineering Students Noida",
    "Coding for Beginners Noida",
    "Programming for Freshers Noida",
    "Upskilling Courses Noida",
    "Reskilling Courses Noida",

    "Sector 62 Noida Coaching",
    "Sector 63 Noida Coaching",
    "Best Institute near me Noida",
    "Top Coaching Center Noida",
    "Top 10 IT Institute Noida",
    "Best Computer Institute Delhi NCR",
    "IT Training Greater Noida",
    "IT Training Indirapuram Ghaziabad",
    "Coding Institute Delhi NCR",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "Softcrayons - Best Coding & IT Training Institute in Noida & Ghaziabad",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/favicon.png",
        width: 423,
        height: 423,
        alt: "Softcrayons Tech Solutions Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Softcrayons - Best Coding & IT Training Institute in Noida & Ghaziabad",
    description: SITE_DESCRIPTION,
    images: ["/favicon.png"],
    creator: "@softcrayons",
    site: "@softcrayons",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "Education",

  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Noida",
    "geo.position": "28.5855;77.3100",
    ICBM: "28.5855, 77.3100",
    "revisit-after": "3 days",
    rating: "general",
    "msvalidate.01": "",
    "yandex-verification": "",
    distribution: "global",
    target: "all",
    audience: "all",
    coverage: "Worldwide",
    subject: "IT Training, Coding Courses, Skill Development, Tech Education",
    classification: "Education / Technology Training",
    "page-topic": "IT Training and Skill Development Institute",
    "page-type": "Homepage",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Softcrayons",
    "mobile-web-app-capable": "yes",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  alternateName: "Softcrayons",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  image: `${SITE_URL}/favicon.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2020",
  sameAs: [
    "https://www.facebook.com/softcrayons",
    "https://www.instagram.com/softcrayons",
    "https://www.linkedin.com/company/softcrayons",
    "https://twitter.com/softcrayons",
    "https://www.youtube.com/@softcrayons",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
    postalCode: "201301",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.5855,
    longitude: 77.31,
  },
  areaServed: [
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Ghaziabad" },
    { "@type": "City", name: "Greater Noida" },
    { "@type": "City", name: "Delhi" },
    { "@type": "Place", name: "Delhi NCR" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "IT & Coding Courses",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Programming Courses",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Full Stack Web Development",
            },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "Python Programming" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "Java Programming" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "React JS" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Data Structures & Algorithms",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Advanced Technology Courses",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Data Science & Machine Learning",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Cloud Computing (AWS/Azure)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "DevOps Engineering" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "Artificial Intelligence" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "Cyber Security" },
          },
        ],
      },
    ],
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "admissions",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Softcrayons",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/courses?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  image: `${SITE_URL}/favicon.png`,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
    postalCode: "201301",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.5855,
    longitude: 77.31,
  },
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  areaServed: ["Noida", "Ghaziabad", "Greater Noida", "Delhi NCR"],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={SITE_URL} />
        <meta name="google" content="notranslate" />
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppChrome>{children}</AppChrome>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
