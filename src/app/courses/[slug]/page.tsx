import type { Metadata } from "next";
import { Clock, BarChart, BookOpen, ArrowLeft, CheckCircle, BadgeCheck, Briefcase, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    try {
        const course = await prisma.course.findUnique({
            where: { slug, isPublic: true },
            select: {
                title: true,
                metaTitle: true,
                metaDescription: true,
                metaKeywords: true,
                description: true,
                bannerImage: true,
                thumbnailImage: true,
                category: { select: { title: true } },
            },
        });

        if (!course) {
            return {
                title: "Course Not Found",
            };
        }

        const title = course.metaTitle || course.title;
        const description =
            course.metaDescription ||
            course.description ||
            `Learn ${course.title} at Softcrayons. Hands-on training with placement assistance.`;
        const image = course.bannerImage || course.thumbnailImage;
        const keywords = Array.isArray(course.metaKeywords)
            ? (course.metaKeywords.filter(Boolean) as string[])
            : [];

        return {
            title,
            description,
            ...(keywords.length > 0 && { keywords }),
            openGraph: {
                title,
                description,
                url: `https://softcrayons.in/courses/${slug}`,
                type: "website",
                ...(image && {
                    images: [{ url: image, alt: course.title }],
                }),
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                ...(image && { images: [image] }),
            },
            alternates: {
                canonical: `https://softcrayons.in/courses/${slug}`,
            },
        };
    } catch {
        return {
            title: "Course",
        };
    }
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    about: string | null;
    fees: number | null;
    discount: number | null;
    duration: string | null;
    difficulty: string;
    topics: string[] | null;
    bannerImage: string | null;
    thumbnailImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    category: {
        id: number;
        title: string;
        slug: string;
    };
}

interface RelatedCourse {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnailImage: string | null;
    bannerImage: string | null;
    duration: string | null;
    difficulty: string;
    fees: number | null;
    discount: number | null;
}

async function getCourse(slug: string): Promise<{ course: Course | null; relatedCourses: RelatedCourse[] }> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/courses/${slug}`, {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            return { course: null, relatedCourses: [] };
        }
        
        const data = await response.json();
        if (data.success) {
            return { course: data.data, relatedCourses: data.relatedCourses || [] };
        }
        return { course: null, relatedCourses: [] };
    } catch (error) {
        console.error('Failed to fetch course:', error);
        return { course: null, relatedCourses: [] };
    }
}

const levelColors: Record<string, string> = {
    BEGINNER: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    INTERMEDIATE: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    ADVANCED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

function formatDifficulty(difficulty: string): string {
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
}

function formatPrice(fees: number): string {
    return `₹${fees.toLocaleString('en-IN')}`;
}

function renderContent(content: string | null) {
    if (!content) return null;
    
    if (content.includes('<') && content.includes('>')) {
        return (
            <div 
                className="course-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }
    
    return (
        <div className="course-content">
            {content.split("\n").map((line, index) => {
                if (line.startsWith("## ")) {
                    return (
                        <h2 key={index} className="text-xl font-bold mt-6 mb-4">
                            {line.replace("## ", "")}
                        </h2>
                    );
                } else if (line.startsWith("### ")) {
                    return (
                        <h3 key={index} className="text-lg font-semibold mt-5 mb-3">
                            {line.replace("### ", "")}
                        </h3>
                    );
                } else if (line.startsWith("- **")) {
                    const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                    if (match) {
                        return (
                            <div key={index} className="flex items-start gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {match[1]}
                                    </span>
                                    : {match[2]}
                                </p>
                            </div>
                        );
                    }
                } else if (line.startsWith("- ")) {
                    return (
                        <div key={index} className="flex items-start gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">
                                {line.replace("- ", "")}
                            </p>
                        </div>
                    );
                } else if (line.match(/^\d+\. \*\*/)) {
                    const match = line.match(/^\d+\. \*\*(.+?)\*\*: (.+)/);
                    if (match) {
                        return (
                            <div key={index} className="flex items-start gap-3 mb-2 ml-4">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {line.match(/^\d+/)?.[0]}
                                </span>
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {match[1]}
                                    </span>
                                    : {match[2]}
                                </p>
                            </div>
                        );
                    }
                } else if (line.trim() !== "") {
                    return (
                        <p key={index} className="text-muted-foreground mb-3">
                            {line}
                        </p>
                    );
                }
                return null;
            })}
        </div>
    );
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { course, relatedCourses } = await getCourse(slug);

    if (!course) {
        notFound();
    }

    const topics = Array.isArray(course.topics) ? course.topics : [];

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 brand-section">
            <div className="container">
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                            {course.category.title}
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                            {course.title}
                        </h1>

                        <p className="text-muted-foreground text-lg mb-8">
                            {course.description}
                        </p>

                        <div className="brand-panel rounded-md p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-primary" />
                                About This Course
                            </h2>
                            {renderContent(course.about)}
                        </div>
                    </div>

                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <div className="brand-panel rounded-md overflow-hidden">
                                <div className="relative h-40 sm:h-50">
                                    <img
                                        src={course.bannerImage || course.thumbnailImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80'}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-6">
                                    {course.fees != null && course.fees > 0 && (
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-muted-foreground">Course Fees</span>
                                            <div className="flex flex-col items-end">
                                                {course.discount && course.discount > 0 ? (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base text-muted-foreground line-through">
                                                                {formatPrice(course.fees)}
                                                            </span>
                                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                                                {course.discount}% off
                                                            </span>
                                                        </div>
                                                        <span className="text-3xl font-black text-primary">
                                                            {formatPrice(Math.round(course.fees - (course.fees * course.discount / 100)))}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-3xl font-black text-primary">
                                                        {formatPrice(course.fees)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between py-3 border-b border-border">
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                Duration
                                            </span>
                                            <span className="font-semibold">{course.duration || 'Self-paced'}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-border">
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <BarChart className="w-4 h-4" />
                                                Difficulty
                                            </span>
                                            <span
                                                className={`px-3 py-1 text-xs font-bold rounded-full border ${levelColors[course.difficulty] || levelColors.BEGINNER}`}
                                            >
                                                {formatDifficulty(course.difficulty)}
                                            </span>
                                        </div>
                                        {topics.length > 0 && (
                                        <div className="py-3 border-b border-border">
                                            <span className="flex items-center gap-2 text-muted-foreground mb-3">
                                                <BookOpen className="w-4 h-4" />
                                                Topics Covered
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {topics.map((topic: string) => (
                                                    <span
                                                        key={topic}
                                                        className="px-3 py-1 rounded-md text-xs font-bold bg-secondary text-white"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        )}
                                    </div>

                                    <Link href={`/query?id=${course.id}`}>
                                        <Button className="w-full" size="lg">
                                            Join Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="brand-panel rounded-md p-5 mt-4">
                                <h3 className="font-bold mb-2">Need Help?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Have questions about this course? We&apos;re here to help!
                                </p>
                                <Link href={`/query?id=${course.id}`}>
                                    <Button variant="outline" className="w-full">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedCourses.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedCourses.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/courses/${related.slug}`}
                                    className="group brand-panel brand-card-hover rounded-md overflow-hidden"
                                >
                                    <div className="relative h-32 overflow-hidden">
                                        <img
                                            src={related.thumbnailImage || related.bannerImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80'}
                                            alt={related.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {related.duration || 'Self-paced'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-20 brand-panel rounded-md overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center gap-0">
                        <div className="flex-1 p-8 md:p-12 lg:p-14">
                            <span
                                className="inline-block font-mono text-xs font-bold tracking-[0.25em] uppercase text-primary border border-primary/40 px-3 py-1 mb-6"
                                style={{ boxShadow: "2px 2px 0px #F97316" }}
                            >
                                Industry Recognised
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                                Get Officially{" "}
                                <span className="text-gradient">Certified</span>{" "}
                                in {course.title}
                            </h2>

                            <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                                Upon successful completion, earn a{" "}
                                <span className="font-semibold text-foreground">Softcrayons Certificate of Achievement</span>{" "}
                                that validates your expertise and stands out to top employers across the industry.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    { icon: BadgeCheck, text: "Government & Industry Recognised Certificate", sub: "Accepted by 500+ hiring partners nationwide" },
                                    { icon: Briefcase, text: "Boost Your Hiring Potential", sub: "Certificate holders get 3× more interview callbacks" },
                                    { icon: Share2, text: "Share on LinkedIn & Resume", sub: "Downloadable, verifiable, and shareable instantly" },
                                    { icon: Shield, text: "Lifetime Validity", sub: "Your achievement never expires - it's yours forever" },
                                ].map(({ icon: Icon, text, sub }) => (
                                    <li key={text} className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Icon className="w-4.5 h-4.5 text-primary" style={{ width: "18px", height: "18px" }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{text}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Link href={`/query?id=${course.id}`}>
                                <Button size="lg" className="gap-2">
                                    <BadgeCheck className="w-4 h-4" />
                                    Enroll & Get Certified
                                </Button>
                            </Link>
                        </div>

                        <div className="w-full lg:w-[480px] flex-shrink-0 bg-muted/30 flex items-center justify-center p-8 lg:p-10 lg:border-l border-t lg:border-t-0 border-border">
                            <div
                                className="relative w-full rounded-md overflow-hidden"
                                style={{ boxShadow: "8px 8px 0px hsl(var(--border))" }}
                            >
                                <img
                                    src="https://res.cloudinary.com/dbrxgmnyn/image/upload/v1773047279/blog-banners/impuhtwg9sr9thyo62l1.png"
                                    alt="Softcrayons Certificate of Achievement"
                                    className="w-full h-auto object-contain"
                                />
                                <div
                                    className="absolute inset-0 rounded-md border-2 border-primary/20 pointer-events-none"
                                    style={{ boxShadow: "inset 0 0 32px rgba(var(--primary-rgb, 234 88 12)/0.06)" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
