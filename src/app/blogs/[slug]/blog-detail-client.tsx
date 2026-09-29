"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, ChevronRight, Link2, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "@/components/ui/loader";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    bannerImage: string | null;
    thumbnailImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    featured: boolean;
    readTime: number;
    createdAt: string;
    updatedAt: string;
    category: {
        id: number;
        title: string;
        slug: string;
    };
    author: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface RelatedBlog {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    thumbnailImage: string | null;
    createdAt: string;
}

async function getBlog(slug: string): Promise<{ blog: Blog | null; relatedBlogs: RelatedBlog[] }> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            return { blog: null, relatedBlogs: [] };
        }
        
        const data = await response.json();
        if (data.success) {
            return { blog: data.data, relatedBlogs: data.relatedBlogs || [] };
        }
        return { blog: null, relatedBlogs: [] };
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        return { blog: null, relatedBlogs: [] };
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const langLabel = language || "plaintext";

    return (
        <div className="relative my-6 overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">{langLabel}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    {copied ? (
                        <><Check className="h-3.5 w-3.5 text-green-500" /> Copied</>
                    ) : (
                        <><Copy className="h-3.5 w-3.5" /> Copy</>
                    )}
                </button>
            </div>
            <div className="code-block-rendered">
                <SyntaxHighlighter
                    language={langLabel}
                    style={oneDark}
                    customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        fontSize: "0.875rem",
                        padding: "0.75rem 1rem",
                    }}
                    showLineNumbers={false}
                    wrapLongLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

function BlogContent({ content }: { content: string | null }) {
    if (!content) return null;

    if (content.includes('<') && content.includes('>')) {
        const segments = parseContentSegments(content);

        return (
            <div className="course-content">
                {segments.map((segment, index) => {
                    if (segment.type === 'code') {
                        return (
                            <CodeBlock
                                key={index}
                                code={segment.code}
                                language={segment.language}
                            />
                        );
                    }
                    return (
                        <div
                            key={index}
                            dangerouslySetInnerHTML={{ __html: segment.html }}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <div className="course-content">
            {content.split("\n").map((line, index) => (
                <p key={index} className="text-muted-foreground mb-4">{line}</p>
            ))}
        </div>
    );
}

type ContentSegment =
    | { type: 'html'; html: string }
    | { type: 'code'; code: string; language: string };

function parseContentSegments(html: string): ContentSegment[] {
    const segments: ContentSegment[] = [];
    const codeBlockRegex = /<pre[^>]*>\s*<code(?:\s+class="language-([^"]*)")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(html)) !== null) {
        if (match.index > lastIndex) {
            const htmlSegment = html.slice(lastIndex, match.index).trim();
            if (htmlSegment) {
                segments.push({ type: 'html', html: htmlSegment });
            }
        }

        const rawCode = match[2]
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, '/')
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00A0/g, ' ');

        const cleanCode = rawCode.trim().replace(/^\n+|\n+$/g, '');

        segments.push({
            type: 'code',
            code: cleanCode,
            language: match[1] || 'plaintext',
        });

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < html.length) {
        const htmlSegment = html.slice(lastIndex).trim();
        if (htmlSegment) {
            segments.push({ type: 'html', html: htmlSegment });
        }
    }

    if (segments.length === 0) {
        segments.push({ type: 'html', html });
    }

    return segments;
}

function CopyLinkButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="w-9 h-9 rounded-md bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
            title="Copy link"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Link2 className="w-4 h-4" />
            )}
        </button>
    );
}

export default function BlogDetailClient({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlog() {
            const { slug } = await params;
            const data = await getBlog(slug);
            setBlog(data.blog);
            setRelatedBlogs(data.relatedBlogs);
            setLoading(false);
        }
        fetchBlog();
    }, [params]);

    if (loading) {
        return <Loader text="blog" fullScreen />;
    }

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background brand-section">
            <div className="bg-card/80 border-b border-border">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/blogs" className="hover:text-foreground transition-colors">
                            Blogs
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link 
                            href={`/blogs?category=${blog.category.slug}`} 
                            className="hover:text-foreground transition-colors"
                        >
                            {blog.category.title}
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="container pt-16 pb-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                            {blog.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            {blog.author.image ? (
                                <Image
                                    src={blog.author.image}
                                    alt={blog.author.name}
                                    width={44}
                                    height={44}
                                    className="rounded-md"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-foreground">{blog.author.name}</p>
                                <p className="text-sm text-muted-foreground">Author</p>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-border hidden sm:block" />

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(blog.createdAt)}</span>
                        </div>

                        <div className="h-10 w-px bg-border hidden sm:block" />

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime} min read</span>
                        </div>

                        <div className="sm:ml-auto">
                            <Link href={`/blogs?category=${blog.category.slug}`}>
                                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0">
                                    {blog.category.title}
                                </Badge>
                            </Link>
                        </div>
                    </div>
            </div>

            <div className="w-full mb-10">
                <div className="container">
                    <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-md overflow-hidden shadow-[0_18px_45px_hsl(222_47%_11%/0.12)]">
                        <Image
                            src={blog.bannerImage || blog.thumbnailImage || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className="container pb-16">
                <article className="max-w-5xl mx-auto">
                    <BlogContent content={blog.content} />

                        <div className="mt-12 pt-8 border-t border-border">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">Share:</span>
                                    <div className="flex gap-2">
                                        <a
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-md bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://www.linkedin.com/sharing/share-offsite/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-md bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-md bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        <CopyLinkButton />
                                    </div>
                                </div>

                                <Link href="/blogs" className="inline-flex items-center gap-2 text-primary hover:underline">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to all articles
                                </Link>
                            </div>
                        </div>

                </article>

                {relatedBlogs.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-border">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">More from SoftCrayons</h2>
                            <Link href="/blogs" className="text-primary hover:underline text-sm font-medium">
                                View all articles →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedBlogs.slice(0, 3).map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blogs/${related.slug}`}
                                    className="group brand-panel brand-card-hover rounded-md overflow-hidden"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <Image
                                            src={related.thumbnailImage || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80"}
                                            alt={related.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs text-muted-foreground mb-2">
                                            {formatDate(related.createdAt)}
                                        </p>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                            {related.title}
                                        </h3>
                                        {related.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
