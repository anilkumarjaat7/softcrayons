"use client";

import { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    count: number;
}

interface CourseSidebarProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export function CourseSidebar({
    categories,
    selectedCategory,
    onCategoryChange,
}: CourseSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const selectedName = categories.find((c) => c.id === selectedCategory)?.name || "All Courses";

    const handleSelect = (categoryId: string) => {
        onCategoryChange(categoryId);
        setIsExpanded(false);
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
                <div className="brand-panel rounded-md p-5">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-between w-full lg:hidden"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" />
                            <span className="text-lg font-bold">Categories</span>
                            <span className="text-sm text-primary font-medium ml-1">- {selectedName}</span>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
                    </button>

                    <div className="hidden lg:flex items-center gap-2 mb-5">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold">Categories</h2>
                    </div>

                    <ul className={cn(
                        "space-y-1.5 overflow-hidden transition-all duration-300 lg:!max-h-none lg:!mt-0 lg:!opacity-100",
                        isExpanded ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 lg:opacity-100"
                    )}>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    onClick={() => handleSelect(category.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-all duration-200 ${
                                        selectedCategory === category.id
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <span className="font-medium text-sm">
                                        {category.name}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                            selectedCategory === category.id
                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                : "bg-muted-foreground/10"
                                        }`}
                                    >
                                        {category.count}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}
