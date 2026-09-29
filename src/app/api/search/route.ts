import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";
        const type = searchParams.get("type") || "all";
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                success: true,
                data: {
                    blogs: [],
                    courses: [],
                },
                message: "Search query must be at least 2 characters",
            });
        }

        const searchTerms = query
            .trim()
            .split(/\s+/)
            .filter(term => term.length > 0)
            .map(term => `${term}:*`)
            .join(" | ");

        const results: {
            blogs: any[];
            courses: any[];
        } = {
            blogs: [],
            courses: [],
        };

        if (type === "all" || type === "blogs") {
            const blogs = await prisma.$queryRaw<any[]>`
                SELECT 
                    b.id,
                    b.title,
                    b.slug,
                    b.description,
                    b."thumbnailImage",
                    b."dateOfPublish",
                    b."readTime",
                    bc.title as "categoryTitle",
                    bc.slug as "categorySlug",
                    u.name as "authorName",
                    ts_rank(
                        setweight(to_tsvector('english', COALESCE(b.title, '')), 'A') ||
                        setweight(to_tsvector('english', COALESCE(b.description, '')), 'B') ||
                        setweight(to_tsvector('english', COALESCE(b.content, '')), 'C'),
                        to_tsquery('english', ${searchTerms})
                    ) as rank
                FROM "Blog" b
                LEFT JOIN "BlogCategory" bc ON b."categoryId" = bc.id
                LEFT JOIN "user" u ON b."authorId" = u.id
                WHERE 
                    bc."isPublic" = true
                    AND (
                        to_tsvector('english', COALESCE(b.title, '')) ||
                        to_tsvector('english', COALESCE(b.description, '')) ||
                        to_tsvector('english', COALESCE(b.content, ''))
                    ) @@ to_tsquery('english', ${searchTerms})
                    OR LOWER(b.title) LIKE LOWER(${`%${query}%`})
                    OR LOWER(b.description) LIKE LOWER(${`%${query}%`})
                ORDER BY rank DESC, b."dateOfPublish" DESC
                LIMIT ${limit}
            `;

            results.blogs = blogs.map(blog => ({
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                description: blog.description,
                thumbnailImage: blog.thumbnailImage,
                dateOfPublish: blog.dateOfPublish,
                readTime: blog.readTime,
                category: {
                    title: blog.categoryTitle,
                    slug: blog.categorySlug,
                },
                author: {
                    name: blog.authorName,
                },
                type: "blog",
            }));
        }

        if (type === "all" || type === "courses") {
            const courses = await prisma.$queryRaw<any[]>`
                SELECT 
                    c.id,
                    c.title,
                    c.slug,
                    c.description,
                    c."thumbnailImage",
                    c."bannerImage",
                    c.duration,
                    c.difficulty,
                    c.fees,
                    c.discount,
                    cc.title as "categoryTitle",
                    cc.slug as "categorySlug",
                    ts_rank(
                        setweight(to_tsvector('english', COALESCE(c.title, '')), 'A') ||
                        setweight(to_tsvector('english', COALESCE(c.description, '')), 'B') ||
                        setweight(to_tsvector('english', COALESCE(c.about, '')), 'C'),
                        to_tsquery('english', ${searchTerms})
                    ) as rank
                FROM "Course" c
                LEFT JOIN "CourseCategory" cc ON c."categoryId" = cc.id
                WHERE 
                    c."isPublic" = true
                    AND (
                        to_tsvector('english', COALESCE(c.title, '')) ||
                        to_tsvector('english', COALESCE(c.description, '')) ||
                        to_tsvector('english', COALESCE(c.about, ''))
                    ) @@ to_tsquery('english', ${searchTerms})
                    OR LOWER(c.title) LIKE LOWER(${`%${query}%`})
                    OR LOWER(c.description) LIKE LOWER(${`%${query}%`})
                ORDER BY rank DESC, c."isFeatured" DESC, c."createdAt" DESC
                LIMIT ${limit}
            `;

            results.courses = courses.map(course => ({
                id: course.id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnailImage: course.thumbnailImage,
                bannerImage: course.bannerImage,
                duration: course.duration,
                difficulty: course.difficulty,
                fees: course.fees,
                discount: course.discount,
                category: {
                    title: course.categoryTitle,
                    slug: course.categorySlug,
                },
                type: "course",
            }));
        }

        return NextResponse.json({
            success: true,
            data: results,
            query: query,
            totalResults: results.blogs.length + results.courses.length,
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to perform search",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
