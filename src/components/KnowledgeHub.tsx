"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/ui/loader";
import { SectionHeader } from "@/components/public-ui";

interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnailImage: string | null;
  bannerImage: string | null;
  dateOfPublish: string;
  readTime: number;
  tags: string[];
  isFeatured: boolean;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: number;
    title: string;
    slug: string;
  };
}

function KnowledgeHubCard({ blog, index }: { blog: Blog; index: number }) {
  const image = blog.thumbnailImage || blog.bannerImage;
  return (
    <Link href={`/blogs/${blog.slug || blog.id}`}>
      <article
        className="group brand-panel brand-card-hover rounded-md overflow-hidden h-full flex flex-col animate-fade-up"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={blog.title}
              fill
              className="object-cover duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl font-black text-primary/20">SC</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-secondary text-secondary-foreground border-0 text-xs shadow-md">
              {blog.category.title}
            </Badge>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Clock className="w-3 h-3" />
            <span>{blog.readTime} min read</span>
          </div>

          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
            {blog.description || ""}
          </p>

          <div className="flex items-center justify-between pt-4 mt-auto">
            <div className="flex items-center gap-2">
              {blog.author.image ? (
                <Image
                  src={blog.author.image}
                  alt={blog.author.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {blog.author.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function KnowledgeHub() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs?featured=true&limit=3");
        const data = await response.json();
        if (data.success) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="container">
          <SectionLoader text="articles" />
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow="Knowledge hub"
          title={<>Career insights from <span className="text-gradient">our mentors</span></>}
          description={
            <>
            Stay ahead with the latest insights, tutorials, and career tips from
            our experts.
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {blogs.map((blog, index) => (
            <KnowledgeHubCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blogs">
            <Button variant="outline" size="lg">
              Explore All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
