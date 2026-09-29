import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogDetailClient from "./blog-detail-client";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    try {
        const blog = await prisma.blog.findUnique({
            where: { slug, isPublic: true },
            select: {
                title: true,
                metaTitle: true,
                metaDescription: true,
                metaKeywords: true,
                description: true,
                tags: true,
                bannerImage: true,
                thumbnailImage: true,
                category: { select: { title: true } },
                author: { select: { name: true } },
            },
        });

        if (!blog) {
            return {
                title: "Blog Not Found",
            };
        }

        const title = blog.metaTitle || blog.title;
        const description =
            blog.metaDescription ||
            blog.description ||
            `Read "${blog.title}" on the Softcrayons blog.`;
        const image = blog.bannerImage || blog.thumbnailImage;

        // Build keywords from metaKeywords (Json?) and tags (Json?)
        const metaKeywords = Array.isArray(blog.metaKeywords) ? blog.metaKeywords : [];
        const tags = Array.isArray(blog.tags) ? blog.tags : [];
        const keywords = [...new Set([...metaKeywords, ...tags])].filter(Boolean) as string[];

        return {
            title,
            description,
            ...(keywords.length > 0 && { keywords }),
            openGraph: {
                title,
                description,
                url: `https://softcrayons.in/blogs/${slug}`,
                type: "article",
                ...(image && {
                    images: [{ url: image, alt: blog.title }],
                }),
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                ...(image && { images: [image] }),
            },
            alternates: {
                canonical: `https://softcrayons.in/blogs/${slug}`,
            },
        };
    } catch {
        return {
            title: "Blog",
        };
    }
}

export default function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    return <BlogDetailClient params={params} />;
}
