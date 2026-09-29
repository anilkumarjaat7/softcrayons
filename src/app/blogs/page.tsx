"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/blogs/BlogCard";
import { FeaturedBlogCard } from "@/components/blogs/FeaturedBlogCard";
import { BlogSidebar } from "@/components/blogs/BlogSidebar";
import { Search, Loader2, X } from "lucide-react";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";

interface Category {
    id: string;
    name: string;
    count: number;
}

export interface BlogData {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    content: string;
    tags: string[];
    category: string;
    categoryName: string;
    author: string;
    authorImage: string | null;
    date: string;
    readTime: string;
    featured?: boolean;
}

interface ApiBlog {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnailImage: string | null;
    bannerImage: string | null;
    dateOfPublish: string;
    readTime: number;
    tags: string[] | null;
    isFeatured: boolean;
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

interface SearchResult {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnailImage: string | null;
    dateOfPublish: string;
    readTime: number;
    category: {
        title: string;
        slug: string;
    };
    author: {
        name: string;
    };
    type: string;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function transformBlog(blog: ApiBlog): BlogData {
    return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        description: blog.description || "",
        image: blog.thumbnailImage || blog.bannerImage || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
        content: "",
        tags: blog.tags || [],
        category: blog.category.slug,
        categoryName: blog.category.title,
        author: blog.author.name,
        authorImage: blog.author.image,
        date: formatDate(blog.dateOfPublish),
        readTime: `${blog.readTime} min read`,
        featured: blog.isFeatured,
    };
}

export default function BlogsPage() {
    const [categories, setCategories] = useState<Category[]>([
        { id: "all", name: "All Blogs", count: 0 }
    ]);
    const [blogs, setBlogs] = useState<BlogData[]>([]);
    const [featuredBlogs, setFeaturedBlogs] = useState<BlogData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/blog-categories');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const apiCategories = data.data.map((cat: { id: number; title: string; slug: string; _count?: { blogs: number } }) => ({
                            id: cat.slug,
                            name: cat.title,
                            count: cat._count?.blogs || 0
                        }));
                        const totalCount = apiCategories.reduce((sum: number, cat: Category) => sum + cat.count, 0);
                        setCategories([
                            { id: "all", name: "All Blogs", count: totalCount },
                            ...apiCategories
                        ]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchFeaturedBlogs() {
            try {
                const response = await fetch('/api/blogs?featured=true&limit=3');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setFeaturedBlogs(data.data.map(transformBlog));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch featured blogs:', error);
            }
        }
        fetchFeaturedBlogs();
    }, []);

    const performSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=blogs&limit=10`);
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data.blogs);
                setShowSearchResults(true);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, performSearch]);

    useEffect(() => {
        async function fetchBlogs() {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: '1',
                    limit: '12',
                });
                if (selectedCategory !== 'all') {
                    params.set('categorySlug', selectedCategory);
                }

                const response = await fetch(`/api/blogs?${params}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setBlogs(data.data.map(transformBlog));
                        setHasMore(data.pagination.hasNextPage);
                        setTotalBlogs(data.pagination.totalCount);
                        setPage(1);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchBlogs();
    }, [selectedCategory]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const params = new URLSearchParams({
                page: nextPage.toString(),
                limit: '12',
            });
            if (selectedCategory !== 'all') {
                params.set('categorySlug', selectedCategory);
            }

            const response = await fetch(`/api/blogs?${params}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setBlogs(prev => [...prev, ...data.data.map(transformBlog)]);
                    setHasMore(data.pagination.hasNextPage);
                    setPage(nextPage);
                }
            }
        } catch (error) {
            console.error('Failed to load more blogs:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const displayFeaturedBlogs = featuredBlogs.length > 0 ? featuredBlogs : blogs.slice(0, 3);
    const heroBlog = displayFeaturedBlogs[0];
    const sideFeatured = displayFeaturedBlogs.slice(1, 3);

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-16">
                <div className="container">
                    <Loader text="blogs" size="lg" />
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-background pt-24 pb-16 brand-section">
            <div className="container">
                <div className="mb-12 brand-panel rounded-md p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                                Tech Knowledge and Career Growth
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Stay informed, inspired, and future-ready with our collection of tech insights, practical tutorials, and career guidance.
                            </p>
                        </div>

                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-10 py-6 rounded-md bg-card border border-primary/30 ring-1 ring-primary/15 focus:border-primary focus:ring-2 focus:ring-primary/30"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            {isSearching && (
                                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                                    <div className="p-2">
                                        <p className="text-xs text-muted-foreground px-3 py-2">
                                            Found {searchResults.length} article{searchResults.length !== 1 ? 's' : ''}
                                        </p>
                                        {searchResults.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={`/blogs/${result.slug}`}
                                                onClick={clearSearch}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                    {result.thumbnailImage && (
                                                        <img
                                                            src={result.thumbnailImage}
                                                            alt={result.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{result.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {result.category.title} • {result.author.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 p-6 text-center">
                                    <p className="text-muted-foreground">No articles found for &quot;{searchQuery}&quot;</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {!searchQuery && selectedCategory === "all" && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 bg-primary rounded-full" />
                            <h2 className="text-2xl font-bold">Featured Articles</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {heroBlog && (
                                <FeaturedBlogCard
                                    blog={{
                                        ...heroBlog,
                                        categoryName:
                                            categories.find((c) => c.id === heroBlog.category)
                                                ?.name || "",
                                    }}
                                    variant="hero"
                                />
                            )}
                            <div className="grid grid-cols-1 gap-6">
                                {sideFeatured.map((blog) => (
                                    <FeaturedBlogCard
                                        key={blog.id}
                                        blog={{
                                            ...blog,
                                            categoryName:
                                                categories.find((c) => c.id === blog.category)
                                                    ?.name || "",
                                        }}
                                        variant="horizontal"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <div className="border-t border-border mb-10" />

                <div className="flex flex-col lg:flex-row gap-8">
                    <BlogSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                {searchQuery
                                    ? `Search Results`
                                    : selectedCategory === "all"
                                    ? "All Articles"
                                    : categories.find((c) => c.id === selectedCategory)?.name}
                            </h2>
                            <p className="text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {totalBlogs}
                                </span>{" "}
                                article
                                {totalBlogs !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>

                        {blogs.length === 0 && (
                            <div className="text-center py-16 brand-panel rounded-md">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground text-lg mb-2">
                                    No articles found
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Try adjusting your search or filter
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedCategory("all");
                                        setSearchQuery("");
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {hasMore && (
                            <div className="flex justify-center mt-10">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="min-w-[200px]"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        `Load More (${blogs.length} of ${totalBlogs})`
                                    )}
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
