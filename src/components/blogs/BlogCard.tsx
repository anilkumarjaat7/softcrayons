"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
    blog: {
        id: number;
        slug?: string;
        title: string;
        description: string;
        image: string;
        tags: string[];
        category: string;
        categoryName: string;
        author: string;
        authorImage: string | null;
        date: string;
        readTime: string;
    };
}

export function BlogCard({ blog }: BlogCardProps) {
    return (
        <Link href={`/blogs/${blog.slug || blog.id}`}>
            <article className="group brand-panel brand-card-hover rounded-md overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <Badge
                            variant="secondary"
                            className="bg-secondary/10 text-secondary border-0 text-xs font-bold"
                        >
                            {blog.categoryName}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {blog.readTime}
                        </span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-grow-0">
                        {blog.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                        {blog.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                        {blog.authorImage ? (
                            <Image
                                src={blog.authorImage}
                                alt={blog.author}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{blog.author}</p>
                            <p className="text-xs text-muted-foreground">{blog.date}</p>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
