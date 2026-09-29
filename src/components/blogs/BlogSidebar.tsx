"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";

interface Category {
    id: string;
    name: string;
    count: number;
}

interface BlogSidebarProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export function BlogSidebar({
    categories,
    selectedCategory,
    onCategoryChange,
}: BlogSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const selectedName = categories.find((c) => c.id === selectedCategory)?.name || "All Blogs";

    const handleSelect = (categoryId: string) => {
        onCategoryChange(categoryId);
        setIsExpanded(false);
    };

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 brand-panel rounded-md p-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full lg:hidden"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-lg">Categories</span>
                        <span className="text-sm text-primary font-medium ml-1">- {selectedName}</span>
                    </div>
                    <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
                </button>

                <h3 className="hidden lg:block font-semibold text-lg mb-4 px-2">Categories</h3>

                <nav className={cn(
                    "space-y-1 overflow-hidden transition-all duration-300 lg:!max-h-none lg:!mt-0 lg:!opacity-100",
                    isExpanded ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 lg:opacity-100"
                )}>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                selectedCategory === category.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <span>{category.name}</span>
                            <span
                                className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    selectedCategory === category.id
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {category.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
